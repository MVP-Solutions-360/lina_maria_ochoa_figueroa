import { describe, expect, it } from 'vitest'
import { featuredVideos, instagramEmbedUrl, instagramPostUrl, instagramVideos } from './videos'

// URLs entregadas por la clienta, agrupadas por tema.
const expected = {
  'bmq-presentacion': ['C7MxVU8Rk3D'],
  'derecho-medico': ['DZQHmEUR8p1', 'DYQVlO2RNcj', 'DKkgFEkv3X6', 'DE5uehmJph4', 'DGeZOTlOGMZ', 'DL5zpLYSzXw'],
  'bmq-proteccion': ['DWjnIFeB6J5', 'DWHS-dihCNn', 'DVBwYackV0t', 'DVZeVlsEn95'],
} as const

describe('datos de videos', () => {
  it('cada publicación está asociada a su tema y con su URL exacta', () => {
    for (const [topic, codes] of Object.entries(expected)) {
      const actual = instagramVideos.filter((v) => v.topic === topic).map((v) => v.shortcode)
      expect(actual.sort()).toEqual([...codes].sort())
    }
    expect(instagramPostUrl('C7MxVU8Rk3D')).toBe('https://www.instagram.com/p/C7MxVU8Rk3D/')
    expect(instagramEmbedUrl('C7MxVU8Rk3D')).toBe('https://www.instagram.com/p/C7MxVU8Rk3D/embed/')
  })

  it('los identificadores son válidos y no se repiten', () => {
    const codes = instagramVideos.map((v) => v.shortcode)
    expect(new Set(codes).size).toBe(codes.length)
    codes.forEach((code) => expect(code).toMatch(/^[A-Za-z0-9_-]{8,}$/))
  })

  it('la portada tiene un único video destacado: la presentación de BMQ', () => {
    expect(featuredVideos('bmq-presentacion').map((v) => v.shortcode)).toEqual(['C7MxVU8Rk3D'])
  })

  it('las páginas temáticas publican uno o dos videos, y sólo los verificados llevan descripción', () => {
    expect(featuredVideos('derecho-medico').length).toBeLessThanOrEqual(2)
    expect(featuredVideos('bmq-proteccion').length).toBeLessThanOrEqual(2)
    instagramVideos.forEach((v) => {
      if (v.featured) expect(v.description, v.shortcode).toBeTruthy()
      else expect(v.description, v.shortcode).toBeUndefined()
    })
  })

  it('ninguna miniatura apunta a una URL externa (sólo rutas locales)', () => {
    instagramVideos.forEach((v) => {
      if (v.thumbnail) expect(v.thumbnail).toMatch(/^\/images\//)
    })
  })
})
