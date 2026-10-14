/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { pageMeta, type PageMetaEntry } from '../src/content/pages.ts'
import { renderPage } from './seoPlugin.ts'

const template = readFileSync(join(process.cwd(), 'index.html'), 'utf8')
const compiled = `<!doctype html><html lang="es"><head><meta charset="UTF-8" />${template.match(/<title>[^<]*<\/title>/)![0]}<meta name="description" content="x" /><script type="module" src="/assets/app.js"></script></head><body><div id="root"></div></body></html>`

describe('plugin SEO: HTML estático por ruta', () => {
  it('conserva el documento completo (#root y script) y deja un único título y descripción', () => {
    for (const page of Object.values(pageMeta) as PageMetaEntry[]) {
      const html = renderPage(compiled, page)
      expect(html).toContain('<div id="root"></div>')
      expect(html).toContain('<script type="module"')
      expect((html.match(/<title>/g) ?? []).length).toBe(1)
      expect((html.match(/name="description"/g) ?? []).length).toBe(1)
      expect(html).toContain(page.description.slice(0, 30))
    }
  })

  it('un comentario que mencione <title> o <meta name="description"> no hace desaparecer HTML real', () => {
    const tricky = compiled.replace('<head>', '<head><!-- ejemplo: <title>falso</title> y <meta name="description" --> ')
    const html = renderPage(tricky, pageMeta.profile)
    expect(html).toContain('<div id="root"></div>')
    expect(html).toContain('<script type="module"')
    expect(html).not.toContain('falso')
    expect((html.match(/<title>/g) ?? []).length).toBe(1)
  })

  it('el index.html real de la plantilla no menciona etiquetas de título dentro de comentarios', () => {
    const comments = template.match(/<!--[\s\S]*?-->/g) ?? []
    comments.forEach((c) => expect(c).not.toMatch(/<title>|<\/title>/i))
  })

  it('la página 404 sale con noindex y las demás sin él', () => {
    expect(renderPage(compiled, pageMeta.notFound)).toContain('name="robots" content="noindex, follow"')
    expect(renderPage(compiled, pageMeta.home)).not.toContain('noindex')
  })

  it('el HTML estático incluye un único JSON-LD válido (salvo en la 404) y canonical sólo con dominio', () => {
    const fake = 'https://dominio-de-prueba.example'
    const html = renderPage(compiled, pageMeta.home, fake)
    const blocks = [...html.matchAll(/<script type="application\/ld\+json" data-seo>([\s\S]*?)<\/script>/g)]
    expect(blocks).toHaveLength(1)
    expect(() => JSON.parse(blocks[0]![1]!)).not.toThrow()
    expect(html).toContain(`<link rel="canonical" href="${fake}/" />`)
    expect(renderPage(compiled, pageMeta.notFound, fake)).not.toContain('ld+json')
    expect(renderPage(compiled, pageMeta.profile, '')).not.toContain('canonical')
  })

  it('falla (no publica una página en blanco) si la plantilla no tiene #root', () => {
    expect(() => renderPage(compiled.replace('id="root"', 'id="otro"'), pageMeta.home)).toThrow(/no es válido/)
  })
})
