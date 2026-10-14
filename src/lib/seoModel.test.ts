/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { OG_IMAGE, SITE_URL, site, socialGroups } from '../config/site'
import { indexablePages, pageMeta } from '../content/pages'
import { PRACTICE_START_YEAR, credentialInstitutions } from '../content/professional'
import { applyPageMeta, JSON_LD_SELECTOR } from './seo'
import { buildHeadModel, buildRobots, buildSitemap, buildStructuredData, buildTitle } from './seoModel'

const FAKE = 'https://dominio-de-prueba.example'
const FORBIDDEN = /aggregateRating|"Review"|"Rating"|FAQPage|LegalService|Attorney|"award"|address|telephone|email|localhost/

const graphOf = (page = pageMeta.home, url = FAKE) =>
  buildStructuredData(page, url)!['@graph'] as Array<Record<string, unknown>>

const profilesOf = (id: 'lina' | 'bmq') =>
  socialGroups.find((g) => g.id === id)!.links.filter((l) => l.network !== 'whatsapp').map((l) => l.href)

describe('títulos y descripciones', () => {
  it('son naturales, de longitud razonable y la portada contiene el nombre completo', () => {
    for (const page of indexablePages) {
      expect(buildTitle(page.title).length).toBeLessThanOrEqual(65)
      expect(page.description.length).toBeGreaterThanOrEqual(80)
      expect(page.description.length).toBeLessThanOrEqual(170)
    }
    expect(buildTitle(pageMeta.home.title)).toBe(pageMeta.home.title)
    expect(pageMeta.home.title).toContain(site.name)
    expect(pageMeta.bmq.title).toMatch(/Blindaje Médico Quirúrgico/)
    expect(pageMeta.bmq.description).toMatch(/\(BMQ\)/)
  })

  it('el año de inicio citado en las descripciones coincide con la hoja de vida', () => {
    expect(pageMeta.home.description).toContain(`desde ${PRACTICE_START_YEAR}`)
    expect(pageMeta.profile.description).toContain(`desde ${PRACTICE_START_YEAR}`)
  })

  it('ninguna descripción promete resultados ni posiciones', () => {
    for (const page of indexablePages) {
      expect(page.description).not.toMatch(/garantiz|n[úu]mero 1|primer(a|o) (lugar|posici)|100 ?%/i)
    }
  })

  it('index.html (valor por defecto en desarrollo) coincide con la portada', () => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8')
    expect(html).toContain(`<title>${buildTitle(pageMeta.home.title)}</title>`)
    expect(html).toContain(pageMeta.home.description)
  })
})

describe('modelo de <head>', () => {
  it('sin dominio no hay URLs absolutas, WebSite ni WebPage, pero sí Person con la Organization de BMQ', () => {
    expect(SITE_URL).toBe('') // se conserva vacío hasta confirmar el dominio de producción
    const model = buildHeadModel(pageMeta.home, '')
    expect(model.canonical).toBeNull()
    expect(model.metas.find((m) => m.key === 'og:image')!.content).toBeNull()
    const graph = graphOf(pageMeta.home, '')
    expect(graph.map((n) => n['@type'])).toEqual(['Person'])
    expect((graph[0]!.worksFor as { url: string }).url).toBe(site.bmqUrl)
    expect(model.jsonLd).not.toMatch(/"@id"/)
  })

  it('con dominio: canonical, og:url y og:image absolutos y coherentes en cada página', () => {
    for (const page of indexablePages) {
      const model = buildHeadModel(page, FAKE)
      const get = (key: string) => model.metas.find((m) => m.key === key)!.content
      expect(model.canonical).toBe(`${FAKE}${page.path}`)
      expect(get('og:url')).toBe(model.canonical)
      expect(get('og:image')).toBe(`${FAKE}${OG_IMAGE.src}`)
      expect(get('twitter:image')).toBe(get('og:image'))
      expect(get('og:title')).toBe(model.title)
      expect(get('twitter:title')).toBe(model.title)
      expect(get('og:description')).toBe(page.description)
      expect(get('twitter:description')).toBe(page.description)
      expect(get('og:image:width')).toBe('1200')
      expect(get('og:image:height')).toBe('630')
    }
  })

  it('la 404 no tiene canonical ni JSON-LD y lleva noindex', () => {
    const model = buildHeadModel(pageMeta.notFound, FAKE)
    expect(model.canonical).toBeNull()
    expect(model.jsonLd).toBeNull()
    expect(model.metas.find((m) => m.key === 'robots')!.content).toBe('noindex, follow')
  })

  it('el archivo de la imagen para compartir mide realmente 1200×630', () => {
    const buf = readFileSync(join(process.cwd(), 'public', OG_IMAGE.src))
    let i = 2
    let size: [number, number] | null = null
    while (i < buf.length) {
      const marker = buf[i + 1]!
      if (marker >= 0xc0 && marker <= 0xc3) {
        size = [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]
        break
      }
      i += 2 + buf.readUInt16BE(i + 2)
    }
    expect(size).toEqual([OG_IMAGE.width, OG_IMAGE.height])
  })
})

describe('JSON-LD', () => {
  it('es JSON válido en todas las páginas indexables, con y sin dominio, y sin tipos ni datos no verificados', () => {
    for (const url of ['', FAKE]) {
      for (const page of indexablePages) {
        const json = buildHeadModel(page, url).jsonLd!
        const parsed = JSON.parse(json)
        expect(parsed['@context']).toBe('https://schema.org')
        expect(Array.isArray(parsed['@graph'])).toBe(true)
        expect(json).not.toMatch(FORBIDDEN)
        expect(json).not.toContain('<')
      }
    }
  })

  it('escapa "<" para que ningún texto pueda cerrar la etiqueta <script>', () => {
    const json = buildHeadModel({ ...pageMeta.home, description: 'a </script><b>' }, FAKE).jsonLd!
    expect(json).not.toContain('</script>')
    const page = JSON.parse(json)['@graph'].find((n: { '@type': string }) => n['@type'] === 'WebPage')
    expect(page.description).toBe('a </script><b>')
  })

  it('Person: nombre, especialidad, cargo en BMQ, formación documentada y perfiles oficiales', () => {
    const person = graphOf().find((n) => n['@type'] === 'Person')!
    expect(person.name).toBe('Lina María Ochoa Figueroa')
    expect(person.jobTitle).toEqual(['Abogada especialista en derecho médico', 'CEO de Blindaje Médico Quirúrgico'])
    expect((person.alumniOf as Array<{ name: string }>).map((a) => a.name)).toEqual(
      credentialInstitutions.map((i) => i.name),
    )
    expect(person.sameAs).toEqual(profilesOf('lina'))
    ;[...profilesOf('lina'), ...profilesOf('bmq')].forEach((u) => expect(new URL(u).search).toBe(''))
    expect(person).not.toHaveProperty('birthDate')
    expect(person).not.toHaveProperty('image')
  })

  it('Organization BMQ: su URL oficial y sus perfiles; no se presenta como este sitio', () => {
    const org = graphOf().find((n) => n['@type'] === 'Organization')!
    expect(org.name).toBe('Blindaje Médico Quirúrgico')
    expect(org.url).toBe(site.bmqUrl)
    expect(org.sameAs).toEqual(profilesOf('bmq'))
  })

  it('los identificadores son estables entre páginas y toda referencia apunta a una entidad existente', () => {
    const idsByPage = indexablePages.map((page) => {
      const graph = graphOf(page)
      const ids = graph.map((n) => n['@id'] as string)
      expect(new Set(ids).size).toBe(ids.length)
      ids.forEach((id) => expect(id.startsWith(`${FAKE}/`)).toBe(true))
      const refs = [...JSON.stringify(graph).matchAll(/"@id":"([^"]+)"/g)].map((m) => m[1]!)
      refs.forEach((ref) => expect(ids).toContain(ref))
      return ids.filter((id) => !id.endsWith('#webpage')).sort()
    })
    idsByPage.forEach((ids) => expect(ids).toEqual(idsByPage[0]))
  })

  it('WebPage: tipo por ruta y concordancia con los metadatos visibles', () => {
    for (const page of indexablePages) {
      const node = graphOf(page).find((n) => String(n['@id']).endsWith('#webpage'))!
      expect(node['@type']).toBe(page.path === '/perfil-profesional' ? 'ProfilePage' : 'WebPage')
      expect(node.url).toBe(`${FAKE}${page.path}`)
      expect(node.name).toBe(buildTitle(page.title))
      expect(node.description).toBe(page.description)
      expect(node.inLanguage).toBe('es-CO')
    }
    const bmq = graphOf(pageMeta.bmq).find((n) => n['@type'] === 'WebPage')!
    expect(bmq.about).toEqual({ '@id': `${FAKE}/#bmq` })
  })
})

describe('JSON-LD en el navegador', () => {
  it('se mantiene un único bloque al navegar y la 404 lo retira', () => {
    document.head.innerHTML = ''
    applyPageMeta(pageMeta.home, FAKE)
    applyPageMeta(pageMeta.profile, FAKE)
    expect(document.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1)
    const data = JSON.parse(document.head.querySelector(JSON_LD_SELECTOR)!.textContent!)
    expect(JSON.stringify(data)).toContain('ProfilePage')
    applyPageMeta(pageMeta.notFound, FAKE)
    expect(document.head.querySelector(JSON_LD_SELECTOR)).toBeNull()
    document.head.innerHTML = ''
  })
})

describe('sitemap y robots', () => {
  it('el sitemap sólo contiene las rutas canónicas públicas', () => {
    const xml = buildSitemap([...indexablePages, pageMeta.notFound], FAKE)
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    expect(locs).toEqual([
      `${FAKE}/`,
      `${FAKE}/perfil-profesional`,
      `${FAKE}/derecho-medico`,
      `${FAKE}/consultoria-en-salud`,
      `${FAKE}/blindaje-medico-quirurgico`,
    ])
    expect(xml).not.toMatch(/404|localhost/)
  })

  it('robots.txt permite el rastreo y apunta al sitemap', () => {
    expect(buildRobots(FAKE)).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${FAKE}/sitemap.xml\n`)
  })
})
