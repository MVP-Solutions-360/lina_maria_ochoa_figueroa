# syntax=docker/dockerfile:1
#
# Imagen estática del sitio de Lina María Ochoa Figueroa.
#   1) Etapa "build": compila con Node (dependencias reproducibles desde package-lock.json).
#   2) Etapa final: Nginx sirve únicamente dist/. No incluye código fuente, .git, node_modules,
#      imágenes originales ni archivos personales.
#
# El dominio de producción (SITE_URL) está fijado en src/config/site.ts y se incorpora al
# compilar; no se pasa por variables de entorno ni hay secretos en la imagen.

# --- Etapa 1: compilación -------------------------------------------------------------------
# Vite 8 y Vitest 5 exigen Node >= 22.12 (o 20.19 para Vite): se usa la rama 22 LTS.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html ./
COPY build ./build
COPY public ./public
COPY src ./src

# tsc -b && vite build. El plugin SEO falla la compilación si SITE_URL es incoherente.
RUN npm run build

# --- Etapa 2: servidor web -------------------------------------------------------------------
# Rama ESTABLE de Nginx (nginx.org: 1.30.x) sobre Alpine. El tag 1.30-alpine sigue los parches de esa
# rama cada vez que se reconstruye con `docker compose build --pull`; 1.27 ya no recibe soporte.
FROM nginx:1.30-alpine

# Sustituye el sitio por defecto de la imagen por la configuración del proyecto.
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/lina-ochoa.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
