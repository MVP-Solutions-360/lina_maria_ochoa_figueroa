/// <reference types="node" />
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { OG_IMAGE } from '../config/site'
import { indexablePages, pageMeta } from '../content/pages'
import { applyPageMeta } from './seo'

const meta = (sel: string) => document.head.querySelector(sel)

afterEach(() => {
  document.head.innerHTML = ''
})

describe('metadatos por ruta', () => {
  it('cada página tiene título y descripción propios y la 404 es noindex', () => {
    const entries = Object.values(pageMeta)
    expect(new Set(entries.map((p) => p.title)).size).toBe(entries.length)
    expect(new Set(entries.map((p) => p.description)).size).toBe(entries.length)
    entries.forEach((p) => expect(p.description.length).toBeGreaterThan(40))
    expect(pageMeta.notFound.noindex).toBe(true)
    expect(indexablePages.map((p) => p.path)).toEqual([
      '/',
      '/perfil-profesional',
      '/derecho-medico',
      '/consultoria-en-salud',
      '/blindaje-medico-quirurgico',
    ])
  })

  it('una página normal no lleva robots noindex y define Open Graph y Twitter', () => {
    applyPageMeta(pageMeta.profile)
    expect(document.title).toBe('Perfil profesional y trayectoria | Lina María Ochoa Figueroa')
    expect(meta('meta[name="robots"]')).toBeNull()
    expect(meta('meta[property="og:title"]')).toHaveAttribute('content', document.title)
    expect(meta('meta[name="twitter:title"]')).toHaveAttribute('content', document.title)
    expect(meta('meta[property="og:site_name"]')).toHaveAttribute('content', 'Lina María Ochoa Figueroa')
  })

  it('la página 404 se marca noindex y al navegar a otra página se retira la marca', () => {
    applyPageMeta(pageMeta.notFound)
    expect(meta('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
    applyPageMeta(pageMeta.home)
    expect(meta('meta[name="robots"]')).toBeNull()
  })

  it('sin dominio configurado no hay URLs absolutas (canonical, og:url, og:image) ni se inventa ninguna', () => {
    applyPageMeta(pageMeta.home)
    expect(meta('link[rel="canonical"]')).toBeNull()
    expect(meta('meta[property="og:url"]')).toBeNull()
    expect(meta('meta[property="og:image"]')).toBeNull()
    expect(meta('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary')
    expect(document.head.innerHTML).not.toMatch(/localhost/)
  })

  it('la imagen para compartir existe en public/ y mide 1200×630', () => {
    expect(existsSync(join(process.cwd(), 'public', OG_IMAGE.src))).toBe(true)
    expect([OG_IMAGE.width, OG_IMAGE.height]).toEqual([1200, 630])
  })
})
