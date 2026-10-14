# SEO: estrategia, matriz de búsquedas y puesta en marcha en Google

Estado: el dominio de producción está configurado: `SITE_URL` en `src/config/site.ts` vale `https://linaochoa.com` (dominio canónico; `https://www.linaochoa.com` es alternativo y no se usa en ninguna URL generada). Aún no hay datos de Google, así que ninguna cifra de este documento es de volumen de búsqueda, dificultad ni posición: no hay acceso a Search Console ni a Keyword Planner. Las frases son **hipótesis** que se validan después de publicar.

## 1. Cómo funciona la implementación

| Pieza | Archivo | Función |
|---|---|---|
| Texto por ruta (título, descripción) | `src/content/pages.ts` | Única fuente. |
| Modelo del `<head>` | `src/lib/seoModel.ts` | Calcula título, meta, canonical, Open Graph, Twitter y JSON-LD. Lo usan las dos capas siguientes. |
| Navegador | `src/lib/seo.ts` + `usePageMeta` | Aplica el modelo al navegar (actualiza las etiquetas existentes, no las duplica). |
| HTML estático | `build/seoPlugin.ts` | Escribe el mismo modelo en `dist/<ruta>/index.html`, más `sitemap.xml` y `robots.txt` (se generan porque `SITE_URL` está definido). |

- **Estado actual (con `SITE_URL`)**: cada página incluye canonical, `og:url`, `og:image` y `twitter:image` absolutos (1200×630, `/og-image.jpg`), Open Graph y Twitter, JSON-LD con `WebSite`, `WebPage`/`ProfilePage`, `Person` y `Organization` (BMQ) con `@id` estables `https://linaochoa.com/#...`, y la compilación genera `sitemap.xml` (5 rutas) y `robots.txt` (con la referencia al sitemap).
- Si `SITE_URL` se vaciara: no habría canonical, `og:url`, `og:image`, sitemap ni robots (requieren URL absoluta) y el JSON-LD sólo incluiría `Person`. Es un modo de respaldo cubierto por pruebas, no la configuración de producción.
- `SITE_URL` se valida al compilar: `http`, barra final, rutas, parámetros o direcciones locales hacen fallar la compilación con un mensaje claro.
- **Los cambios de SEO (títulos, descripciones, dominio, JSON-LD) viven en el HTML generado: sólo llegan a producción tras una nueva compilación y un nuevo despliegue** (ver `docs/deployment.md`).
- La 404 (`404.html`, servida con estado HTTP 404) lleva `noindex, follow`, sin canonical, sin JSON-LD y fuera del sitemap.
- Todo está cubierto por pruebas: `src/lib/seoModel.test.ts`, `src/lib/seo.test.ts`, `build/seoPlugin.test.ts`.

## 2. Matriz de búsquedas objetivo (hipótesis)

Una intención principal por ruta; las demás frases aparecen sólo como variación natural del texto, no repetidas.

| Intención | Frase hipótesis | Ruta principal | Dónde aparece hoy |
|---|---|---|---|
| Marca personal | Lina María Ochoa Figueroa | `/` | Título, h1, JSON-LD `Person` |
| Marca personal | Lina Ochoa abogada / Lina Ochoa derecho médico | `/` | Descripción, hero, `alternateName` |
| Marca personal | Abogada especialista en derecho médico (en Colombia) | `/` y `/derecho-medico` | Título/descripción |
| Marca personal + BMQ | Lina Ochoa Blindaje Médico Quirúrgico / Lina Ochoa BMQ / CEO de Blindaje Médico Quirúrgico | `/blindaje-medico-quirurgico` | Título, descripción, h1 |
| Marca corporativa | Blindaje Médico Quirúrgico / BMQ Blindaje Médico Quirúrgico | web oficial de BMQ (no este sitio) | Esta web solo enlaza y describe el vínculo |
| Autoridad temática | Derecho médico en Colombia; responsabilidad médica y profesional | `/derecho-medico` | Título, descripción, contenido |
| Autoridad temática | Consultoría jurídica / gestión jurídica de instituciones de salud | `/consultoria-en-salud` | Título, descripción, contenido |
| Autoridad temática | Historia clínica; protección del ejercicio médico | `/derecho-medico`, `/perfil-profesional`, videos | Contenido y `knowsAbout` |
| Trayectoria | Trayectoria, formación y experiencia de Lina Ochoa | `/perfil-profesional` | Título, descripción, contenido |

Para validar con datos reales (cuando exista acceso): exportar consultas de Search Console y priorizar por impresiones, CTR y posición media; usar Keyword Planner sólo como referencia de demanda. No crear páginas nuevas por variante de palabra clave.

## 3. Lo que el sitio NO afirma (y por qué)

No se publican direcciones, teléfonos de oficina, premios, asociaciones, publicaciones, reseñas ni calificaciones, ni se usan tipos `LegalService`/`Attorney`/`FAQPage`. El cargo de CEO de BMQ no lleva fecha. `sameAs` contiene sólo los perfiles oficiales ya configurados en `src/config/site.ts`.

## 4. Dominio de producción y comprobaciones tras desplegar

Dominio canónico: `https://linaochoa.com` (ya configurado en `SITE_URL`); `https://www.linaochoa.com` también responde, pero el sitio nunca genera URLs con `www`.

**Historial.** El sitio salió primero en `linamariaochoafigueroa.wellezyhub.com`. Tras el cambio a `linaochoa.com`, ese subdominio (si sigue activo) sirve el mismo HTML, cuyo canonical apunta a `linaochoa.com`. Para consolidar las señales de SEO conviene una redirección 301 desde `www` y desde el subdominio anterior hacia `linaochoa.com`; se configura en Nginx Proxy Manager y está pendiente como decisión aparte.

Tras cada despliegue conviene comprobar:

1. `https://linaochoa.com/sitemap.xml` y `/robots.txt` responden 200 y listan sólo el dominio de producción.
2. Cada una de las 5 rutas responde 200, se puede abrir directamente y recargar; una ruta inexistente devuelve 404 con la página personalizada.
3. `https://linaochoa.com/og-image.jpg` responde 200 públicamente (probar con el depurador de Facebook/LinkedIn).
4. Validar la portada en la [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results) y en el [validador de Schema.org](https://validator.schema.org/).

El procedimiento de despliegue está en `docs/deployment.md`.

## 5. Procedimiento en Google Search Console

Requiere acceso al sitio y a la cuenta de Google de la clienta; **no se ha hecho ni se puede afirmar que Google haya indexado el sitio**. No se ha creado ninguna propiedad ni se ha verificado nada todavía.

1. **Verificar la propiedad**: con dominio propio, lo recomendable es una propiedad de *Dominio* sobre `linaochoa.com` (verificación con un registro TXT en el DNS; cubre `www` y sin `www`, http y https). Alternativa: *Prefijo de URL* con `https://linaochoa.com/`, verificada con el método que ofrezca Search Console (archivo HTML en la raíz, etiqueta meta o DNS). El código de verificación lo entrega Search Console; no está en este repositorio.
2. **Enviar el sitemap**: Indexación → Sitemaps → `https://linaochoa.com/sitemap.xml`. Debe listar 5 URLs.
3. **Inspeccionar URLs**: pegar `https://linaochoa.com/` y `https://linaochoa.com/perfil-profesional` en la barra superior; comprobar "La URL está en Google" o los motivos si no.
4. **Solicitar indexación**: sólo si la inspección indica que no está indexada y la página está lista; hacerlo para la portada y el perfil; el resto se descubre por sitemap y enlaces internos.
5. **Revisar indexación**: Indexación → Páginas. Esperadas: 5 indexadas; la 404 excluida por `noindex`. Revisar "Rastreada, actualmente sin indexar", duplicadas y errores 404/5xx.
6. **Medir**: Rendimiento → Resultados de búsqueda; revisar impresiones, clics, CTR y posición por consulta y por página, a 28 días y a 3 meses.
7. **Comparar marcas**: crear dos filtros de consulta (regex) y comparar impresiones/clics/CTR:
   - Marca personal: `lina.*ochoa`
   - BMQ: `bmq|blindaje m[eé]dico`
   - Mixtas (Lina + BMQ): `(lina|ochoa).*(bmq|blindaje)`
   Observar a qué página llega cada grupo (la mixta debería llegar a `/blindaje-medico-quirurgico`; la personal a `/` y `/perfil-profesional`).

## 6. Pendientes que dependen de la clienta

- Confirmar que Instagram/Facebook configurados son perfiles oficiales (se usan en `sameAs`).
- Si se desea, una fotografía autorizada y de buena resolución para la imagen de compartir.
