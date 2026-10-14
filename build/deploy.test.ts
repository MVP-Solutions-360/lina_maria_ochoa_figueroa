/// <reference types="node" />
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SITE_URL } from '../src/config/site.ts'
import { indexablePages } from '../src/content/pages.ts'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('archivos de despliegue (Docker + Nginx)', () => {
  it('Dockerfile: compila con npm ci + npm run build y la imagen final sólo recibe dist/ y la configuración', () => {
    const dockerfile = read('Dockerfile')
    expect(dockerfile).toMatch(/FROM node:22\S* AS build/)
    expect(dockerfile).toMatch(/RUN npm ci\b/)
    expect(dockerfile).toMatch(/RUN npm run build\b/)
    expect(dockerfile).toMatch(/FROM nginx:\S+/)
    const copies = dockerfile.split('\n').filter((l) => /^COPY /.test(l) && l.includes('--from=build'))
    expect(copies).toEqual(['COPY --from=build /app/dist /usr/share/nginx/html'])
    expect(dockerfile).toContain('COPY deploy/nginx.conf')
    expect(dockerfile).not.toMatch(/ENV\s+\w*(KEY|TOKEN|SECRET|PASSWORD)/i)
  })

  it('.dockerignore excluye historial, dependencias, originales, secretos y archivos locales', () => {
    const ignored = read('.dockerignore').split('\n').map((l) => l.trim())
    for (const entry of ['.git', 'node_modules', 'dist', 'originales', '.claude', '.env']) {
      expect(ignored).toContain(entry)
    }
    // Lo que el build necesita no puede estar excluido
    for (const needed of ['src', 'public', 'build', 'deploy', 'package.json', 'package-lock.json', 'index.html']) {
      expect(ignored).not.toContain(needed)
      expect(existsSync(join(process.cwd(), needed))).toBe(true)
    }
  })

  it('compose.yaml: servicio propio, reinicio unless-stopped, puerto interno 80 y IP/puerto configurables', () => {
    const compose = read('compose.yaml')
    expect(compose).toMatch(/^name: lina-ochoa-web$/m)
    expect(compose).toMatch(/^ {2}lina-ochoa-web:$/m)
    expect(compose).toMatch(/restart: unless-stopped/)
    expect(compose).toContain('"${LINA_BIND_IP:-172.17.0.1}:${LINA_HOST_PORT:-3005}:80"')
    // Nunca se publica en todas las interfaces por defecto (se ignoran los comentarios)
    const code = compose
      .split('\n')
      .filter((l) => !l.trim().startsWith('#'))
      .join('\n')
    expect(code).not.toMatch(/0\.0\.0\.0/)
    expect(code).not.toMatch(/^\s*-\s*["']?\d+:80["']?\s*$/m)
  })

  it('.env.example documenta las variables, sin secretos, y los .env reales no se versionan', () => {
    const example = read('.env.example')
    expect(example).toMatch(/^LINA_BIND_IP=172\.17\.0\.1$/m)
    expect(example).toMatch(/^LINA_HOST_PORT=3005$/m)
    expect(example).not.toMatch(/(password|token|secret|key)\s*=/i)
    const gitignore = read('.gitignore').split('\n')
    expect(gitignore).toContain('.env')
    expect(gitignore).toContain('.env.*')
    expect(gitignore).toContain('!.env.example')
    let tracked = ''
    try {
      tracked = execFileSync('git', ['ls-files', '.env', '.env.local', '.env.production'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      })
    } catch {
      // Sin repositorio Git (por ejemplo, en una extracción con `git archive`): no hay nada que comprobar.
    }
    expect(tracked.trim()).toBe('')
  })

  it('nginx.conf: rutas sin redirecciones, 404 personalizada con estado 404, /healthz y caché sólo larga en /assets/', () => {
    const conf = read('deploy/nginx.conf')
    expect(conf).toMatch(/location = \/healthz \{[^}]*return 200/)
    expect(conf).toMatch(/location \/ \{\s*try_files \$uri \$uri\/index\.html =404;/)
    // Con "$uri/" Nginx redirigiría (301) a la versión con barra usando host y puerto internos
    expect(conf).not.toMatch(/try_files[^;]*\$uri\/[^i]/)
    expect(conf).toContain('absolute_redirect off;')
    expect(conf).toMatch(/error_page 404 \/404\.html;/)
    expect(conf).not.toMatch(/error_page 404 =/)
    expect(conf).toMatch(/location = \/404\.html \{\s*internal;/)
    // Caché inmutable únicamente para /assets/
    const immutable = conf.split('\n').filter((l) => l.includes('immutable'))
    expect(immutable).toHaveLength(1)
    expect(immutable[0]).toContain('^/assets/')
    expect(conf).toMatch(/default\s+"no-cache"/)
    // Sin redirecciones ni dominios propios: el dominio sólo lo conoce la aplicación compilada
    expect(conf).not.toMatch(/return 30[1278]|rewrite |https?:\/\/(?!127\.0\.0\.1)/)
    expect(conf).not.toContain('wellezyhub')
  })

  it('cada ruta pública se resuelve con try_files a un index.html que el build genera', () => {
    // El build produce dist/<ruta>/index.html (build/builtHtml.test.ts lo comprueba compilando);
    // aquí se fija el contrato con Nginx: ninguna ruta pública necesita un fallback de SPA.
    const conf = read('deploy/nginx.conf')
    expect(conf).not.toMatch(/try_files[^;]*\/index\.html\s*;/)
    expect(indexablePages.map((p) => p.path)).toEqual([
      '/',
      '/perfil-profesional',
      '/derecho-medico',
      '/consultoria-en-salud',
      '/blindaje-medico-quirurgico',
    ])
  })

  it('el dominio de producción de la aplicación coincide con la documentación de despliegue', () => {
    const doc = read('docs/deployment.md')
    expect(doc).toContain(SITE_URL)
    expect(doc).toContain('172.17.0.1:3005')
    expect(read('docs/seo.md')).toContain(SITE_URL)
  })
})
