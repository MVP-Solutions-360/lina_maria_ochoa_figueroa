/// <reference types="node" />
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { build } from 'vite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { indexablePages, pageMeta } from '../src/content/pages.ts'
import { buildTitle } from '../src/lib/seoModel.ts'
import { seoPlugin } from './seoPlugin.ts'

const FAKE = 'https://dominio-de-prueba.example'
const dirs: string[] = []

async function compile(siteUrl: string) {
  const outDir = mkdtempSync(join(tmpdir(), 'lina-seo-'))
  dirs.push(outDir)
  await build({
    root: process.cwd(),
    configFile: false,
    logLevel: 'silent',
    plugins: [tailwindcss(), react(), seoPlugin({ siteUrl })],
    build: { outDir, emptyOutDir: true, copyPublicDir: false },
  })
  return outDir
}
const fileFor = (dir: string, path: string) => join(dir, path === '/' ? 'index.html' : `${path.slice(1)}/index.html`)
const read = (dir: string, path: string) => readFileSync(fileFor(dir, path), 'utf8')

let withDomain = ''
let withoutDomain = ''
beforeAll(async () => {
  withDomain = await compile(FAKE)
  withoutDomain = await compile('')
}, 120_000)
afterAll(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })))

describe('HTML final generado por la compilación (con dominio)', () => {
  it('cada ruta tiene título, descripción, canonical, Open Graph y Twitter propios y únicos', () => {
    const titles = new Set<string>()
    const descriptions = new Set<string>()
    for (const page of indexablePages) {
      const html = read(withDomain, page.path)
      const title = buildTitle(page.title)
      expect(html).toContain(`<title>${title}</title>`)
      expect(html).toContain(`<meta name="description" content="${page.description}" />`)
      expect(html).toContain(`<link rel="canonical" href="${FAKE}${page.path}" />`)
      expect(html).toContain(`<meta property="og:url" content="${FAKE}${page.path}" />`)
      expect(html).toContain(`<meta property="og:title" content="${title}" />`)
      expect(html).toContain(`<meta property="og:image" content="${FAKE}/og-image.jpg" />`)
      expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />')
      expect(html).toContain(`<meta name="twitter:title" content="${title}" />`)
      expect(html.match(/<link rel="canonical"/g)).toHaveLength(1)
      expect(html.match(/<title>/g)).toHaveLength(1)
      expect(html).not.toContain('noindex')
      titles.add(title)
      descriptions.add(page.description)
    }
    expect(titles.size).toBe(indexablePages.length)
    expect(descriptions.size).toBe(indexablePages.length)
  })

  it('cada HTML trae un único JSON-LD válido; la 404 no trae JSON-LD ni canonical y es noindex', () => {
    for (const page of indexablePages) {
      const html = read(withDomain, page.path)
      const blocks = [...html.matchAll(/<script type="application\/ld\+json" data-seo>([\s\S]*?)<\/script>/g)]
      expect(blocks).toHaveLength(1)
      expect(JSON.parse(blocks[0]![1]!)['@graph'].length).toBeGreaterThan(1)
    }
    const notFound = readFileSync(join(withDomain, '404.html'), 'utf8')
    expect(notFound).toContain('name="robots" content="noindex, follow"')
    expect(notFound).not.toContain('canonical')
    expect(notFound).not.toContain('ld+json')
  })

  it('no hay URLs locales en ningún HTML, sitemap ni robots', () => {
    const files = [
      ...indexablePages.map((p) => fileFor(withDomain, p.path)),
      join(withDomain, '404.html'),
      join(withDomain, 'sitemap.xml'),
      join(withDomain, 'robots.txt'),
    ]
    files.forEach((f) => expect(readFileSync(f, 'utf8')).not.toMatch(/localhost|127\.0\.0\.1|\[::1\]|file:\/\//))
  })

  it('sitemap.xml y robots.txt se generan y sólo listan páginas canónicas', () => {
    const sitemap = readFileSync(join(withDomain, 'sitemap.xml'), 'utf8')
    expect([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])).toEqual(
      indexablePages.map((p) => `${FAKE}${p.path}`),
    )
    expect(sitemap).not.toContain('404')
    expect(readFileSync(join(withDomain, 'robots.txt'), 'utf8')).toContain(`Sitemap: ${FAKE}/sitemap.xml`)
  })
})

describe('configuración de producción incoherente', () => {
  it.each([
    ['http://dominio-de-prueba.example', /https/],
    ['https://dominio-de-prueba.example/', /barra/],
    ['https://dominio-de-prueba.example/inicio', /origen/],
    ['http://localhost:5173', /local/],
    ['no es una url', /no es una URL válida/],
  ])('la compilación falla con un mensaje claro si SITE_URL es %s', async (bad, message) => {
    await expect(compile(bad)).rejects.toThrow(message)
  }, 60_000)
})

describe('HTML final generado por la compilación (sin dominio)', () => {
  it('no inventa URLs absolutas ni sitemap/robots, pero conserva título, descripción y JSON-LD', () => {
    for (const page of indexablePages) {
      const html = read(withoutDomain, page.path)
      expect(html).toContain(`<title>${buildTitle(page.title)}</title>`)
      expect(html).not.toContain('rel="canonical"')
      expect(html).not.toContain('og:url')
      expect(html).not.toContain('og:image')
      expect(html).toContain('<meta name="twitter:card" content="summary" />')
      expect(html).toContain('application/ld+json')
    }
    expect(existsSync(join(withoutDomain, 'sitemap.xml'))).toBe(false)
    expect(existsSync(join(withoutDomain, 'robots.txt'))).toBe(false)
    expect(readFileSync(join(withoutDomain, '404.html'), 'utf8')).toContain('noindex')
    expect(pageMeta.notFound.noindex).toBe(true)
  })
})
