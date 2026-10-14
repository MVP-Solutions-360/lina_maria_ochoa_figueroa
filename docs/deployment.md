# Despliegue en el VPS (Docker + Nginx Proxy Manager)

Sitio estático de Lina María Ochoa Figueroa: Vite compila `dist/` y un contenedor Nginx lo sirve.
Nginx Proxy Manager (NPM) ya recibe `https://linaochoa.com` (dominio canónico) y `https://www.linaochoa.com`
(alternativo), ambos con certificado SSL válido, y los reenvía a `http://172.17.0.1:3005`. Este procedimiento
publica el contenedor en ese punto **sin tocar NPM ni otros sitios** del servidor.

> **Historial del dominio.** El sitio estuvo primero en el subdominio `linamariaochoafigueroa.wellezyhub.com`.
> Desde el cambio a `linaochoa.com` el sitio genera canonical, Open Graph, JSON-LD, sitemap y robots **solo con
> `https://linaochoa.com`** (sin `www` y sin el subdominio anterior). Como el HTML es el mismo en todos los
> nombres, las páginas servidas por `www` o por el subdominio antiguo declaran igualmente el canonical de
> `linaochoa.com`. Una redirección 301 de `www` (y del subdominio antiguo) hacia `linaochoa.com` es una decisión
> aparte, que se configura en NPM y no forma parte de este repositorio.

| Elemento | Valor |
|---|---|
| Repositorio | `https://github.com/MVP-Solutions-360/lina_maria_ochoa_figueroa.git` (público, rama `main`) |
| Dominio canónico | `https://linaochoa.com` (alternativo: `https://www.linaochoa.com`) |
| Servicio / contenedor / imagen | `lina-ochoa-web` |
| Puerto interno del contenedor | `80` |
| Publicación en el host | `${LINA_BIND_IP}:${LINA_HOST_PORT}` → por defecto `172.17.0.1:3005` |

Archivos de despliegue: `Dockerfile`, `deploy/nginx.conf`, `compose.yaml`, `.dockerignore`, `.env.example`.

> **Qué hace la imagen.** Etapa 1: `node:22-alpine` ejecuta `npm ci` (reproducible desde `package-lock.json`) y
> `npm run build`. Etapa 2: `nginx:1.30-alpine` (rama estable de Nginx sobre Alpine) recibe **solo** `dist/` y `deploy/nginx.conf`. No contiene código
> fuente, `.git`, `node_modules`, imágenes originales ni archivos personales. El dominio (`SITE_URL`) está fijado en
> `src/config/site.ts` y se incorpora al compilar; no hay variables de entorno de aplicación ni secretos.

---

## 0. Requisitos en el VPS

- Docker Engine y el plugin Compose v2 (`docker compose version`).
- `git`.
- Acceso a Internet saliente (GitHub y el registro de npm durante el build).
- ~1 GB libre de disco y unos 600 MB de RAM durante la compilación.

```bash
docker --version
docker compose version
git --version
df -h /
```

## 1. Comprobar que el puerto 3005 está libre

```bash
ss -ltnp | grep ':3005' || echo "3005 libre"
docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

Si el puerto 3005 ya está ocupado por otra cosa, **no continúes**: elige otro puerto (paso 3) y avísame para
cambiar el destino en NPM.

## 2. Confirmar la IP donde debe escuchar el contenedor

NPM apunta a `172.17.0.1`, la puerta de enlace habitual de la red `bridge` de Docker. Confírmalo en el VPS; no se
da por supuesto:

```bash
docker network inspect bridge --format '{{(index .IPAM.Config 0).Gateway}}'
ip -4 addr show docker0
```

- Si imprime `172.17.0.1`, ya está: es el valor por defecto.
- Si imprime otra IP, úsala en `LINA_BIND_IP` (paso 3) **y** actualiza el destino del proxy host en NPM.

Comprueba también que NPM realmente llega al host por esa IP (ajusta el nombre del contenedor de NPM):

```bash
docker ps --format '{{.Names}}' | grep -i -E 'npm|proxy'
docker inspect <contenedor_npm> --format '{{json .NetworkSettings.Networks}}'
```

> **No publiques el puerto en `0.0.0.0`.** Docker ignora las reglas de `ufw` para los puertos publicados y el sitio
> quedaría accesible por `http://187.77.5.20:3005`, sin pasar por NPM ni TLS.

## 3. Clonar y configurar

Elige una ruta propia para este sitio (no reutilices la de otros sitios); aquí `/opt/sitios` es solo un ejemplo.

```bash
sudo mkdir -p /opt/sitios && sudo chown "$USER": /opt/sitios
cd /opt/sitios
git clone https://github.com/MVP-Solutions-360/lina_maria_ochoa_figueroa.git
cd lina_maria_ochoa_figueroa
git log -1 --oneline        # debe mostrar el último commit de main

cp .env.example .env
nano .env                   # confirma LINA_BIND_IP y LINA_HOST_PORT
```

`.env` está en `.gitignore`: no se sube a GitHub ni contiene secretos. Valores por defecto:

```dotenv
LINA_BIND_IP=172.17.0.1
LINA_HOST_PORT=3005
```

## 4. Construir y validar la configuración

```bash
docker compose build
docker compose run --rm --no-deps lina-ochoa-web nginx -t
```

`nginx -t` debe terminar con `syntax is ok` y `test is successful`. Si el build falla en `npm run build` con un
mensaje que empieza por `seoPlugin: configuración SEO incoherente`, `SITE_URL` no es válido (debe ser `https://…`, sin
barra final ni ruta).

## 5. Arrancar

```bash
docker compose up -d
docker compose ps
docker compose logs --tail=50 lina-ochoa-web
```

El estado debe ser `running` y, tras unos segundos, `healthy`.

## 6. Verificar en el propio servidor (sin pasar por NPM)

Sustituye la IP/puerto si cambiaste el `.env`.

```bash
BASE=http://172.17.0.1:3005

curl -fsS $BASE/healthz                                   # ok
for r in / /perfil-profesional /derecho-medico /consultoria-en-salud /blindaje-medico-quirurgico; do
  printf '%s -> ' "$r"; curl -s -o /dev/null -w '%{http_code}\n' "$BASE$r"      # 200 en las cinco
done
curl -s -o /dev/null -w '404 esperado: %{http_code}\n' $BASE/no-existe          # 404
curl -s $BASE/no-existe | grep -o '<title>[^<]*'                                # página 404 personalizada
curl -sI $BASE/sitemap.xml | head -n1
curl -sI $BASE/robots.txt  | head -n1
curl -sI $BASE/og-image.jpg | head -n1
curl -sI $BASE/favicon.ico  | head -n1
```

Cabeceras de caché:

```bash
JS=$(curl -s $BASE/ | grep -o '/assets/[^"]*\.js' | head -n1)
curl -sI "$BASE$JS" | grep -i cache-control        # public, max-age=31536000, immutable
curl -sI $BASE/perfil-profesional | grep -i cache-control   # no-cache
curl -sI $BASE/og-image.jpg | grep -i cache-control         # public, max-age=86400
```

Confirma además que el puerto solo escucha en la IP del puente, no en todas las interfaces:

```bash
ss -ltn | grep ':3005'      # debe mostrar 172.17.0.1:3005, NO 0.0.0.0:3005 ni [::]:3005
```

## 7. Verificar por el dominio público

```bash
D=https://linaochoa.com

curl -sI $D/ | head -n1                                  # HTTP/2 200
curl -s  $D/ | grep -o '<link rel="canonical" href="[^"]*"'
curl -s  $D/perfil-profesional | grep -o '<link rel="canonical" href="[^"]*"'
curl -sI https://www.linaochoa.com/ | head -n1                          # HTTP/2 200 (alternativo)
curl -s  https://www.linaochoa.com/ | grep -o '<link rel="canonical" href="[^"]*"'   # debe seguir apuntando a https://linaochoa.com/
curl -s  $D/sitemap.xml | grep -c '<loc>'                # 5
curl -s  $D/robots.txt                                    # Sitemap: https://linaochoa.com/sitemap.xml
curl -s -o /dev/null -w '%{http_code}\n' $D/no-existe     # 404
curl -s  $D/no-existe | grep -o 'name="robots" content="[^"]*"'   # noindex, follow
```

Debe verse el canonical con **`https://linaochoa.com`** (sin `www`) en cada ruta, también al consultar por `www`. Si NPM respondiera 502, ver el apartado
de problemas más abajo. En NPM no hace falta cambiar nada si el destino sigue siendo `http://172.17.0.1:3005`;
conviene tener activados *Block Common Exploits* y *Force SSL*.

Después, abre el sitio en el navegador (portada, las cuatro páginas interiores, recargar con F5 en cada una) y sigue
la sección de Search Console de `docs/seo.md`.

---

## Actualizar el sitio

Los cambios de contenido o SEO (títulos, dominio, JSON-LD, sitemap) viven en el HTML generado: **solo llegan a
producción tras reconstruir y volver a desplegar**.

```bash
cd /opt/sitios/lina_maria_ochoa_figueroa
git fetch origin
git log --oneline HEAD..origin/main            # revisa qué llegará
docker tag lina-ochoa-web:latest lina-ochoa-web:previous     # punto de retorno
git pull --ff-only
docker compose up -d --build
docker compose ps
```

Repite las comprobaciones de los pasos 6 y 7.

Para recibir además los parches de la imagen base de Nginx (`nginx:1.30-alpine`), construye con `docker compose build --pull` antes de `docker compose up -d`.

## Volver a la versión anterior

```bash
cd /opt/sitios/lina_maria_ochoa_figueroa
docker tag lina-ochoa-web:previous lina-ochoa-web:latest
docker compose up -d --no-build
```

(`git checkout <commit>` también sirve, pero reconstruye la imagen; el retorno por etiqueta es inmediato.)

## Comandos útiles

```bash
docker compose logs -f lina-ochoa-web      # registros (rotan a 3 × 10 MB)
docker compose restart lina-ochoa-web
docker compose down                         # detiene y elimina el contenedor (no afecta a otros sitios)
docker image prune -f                       # limpia imágenes huérfanas
```

## Problemas frecuentes

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| NPM muestra **502 Bad Gateway** | El contenedor no está arriba o NPM no alcanza la IP/puerto | `docker compose ps`; repetir paso 6; confirmar `LINA_BIND_IP` (paso 2) y el destino en NPM |
| `docker compose up` falla con `cannot assign requested address` | `LINA_BIND_IP` no existe en el host | Usar la IP del paso 2 |
| `port is already allocated` | El 3005 lo usa otro servicio | Elegir otro `LINA_HOST_PORT` y cambiar el destino en NPM |
| `npm ci` falla en el build | Sin salida a Internet o `package-lock.json` desincronizado | Revisar red/DNS del VPS; avisar para regenerar el lock |
| Las rutas dan 404 al recargar | Imagen antigua o `deploy/nginx.conf` modificado | `docker compose up -d --build`; `nginx -t` |
| El canonical muestra otro dominio | Imagen compilada con otro `SITE_URL` | Revisar `src/config/site.ts` y reconstruir |
| Cambios de contenido que no se ven | Imagen no reconstruida o caché del navegador | `docker compose up -d --build`; recarga forzada |

## Seguridad

- El contenedor no necesita credenciales ni variables secretas; `.env` solo contiene IP y puerto.
- TLS, la redirección http→https y (si se desea) HSTS se gestionan en NPM.
- Nginx envía `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN` y `Referrer-Policy`. No se define una
  `Content-Security-Policy` porque el sitio monta un iframe de Instagram (`instagram.com/embed`) cuando el visitante pulsa «Reproducir»;
  añadirla requeriría permitir ese origen en `frame-src` y probarla con esos contenidos.
- No expongas el puerto 3005 en `0.0.0.0` ni lo abras en el cortafuegos.
