/**
 * Modelo SEO único: a partir de los metadatos de una ruta calcula todo lo que va en <head>
 * (título, meta, canonical y JSON-LD). Lo consumen DOS capas que sólo cambian la forma de
 * escribirlo: `applyPageMeta` (src/lib/seo.ts, en el navegador) y `renderPage`
 * (build/seoPlugin.ts, HTML estático). Así no hay dos implementaciones paralelas.
 *
 * Este módulo no debe importar nada del navegador (DOM) ni de React. Sus importaciones llevan
 * extensión .ts porque el plugin de compilación se comprueba con `module: nodenext`.
 */
import { OG_IMAGE, SITE_URL, site, socialGroups } from '../config/site.ts'
import type { PageMetaEntry } from '../content/pages.ts'
import { credentialInstitutions } from '../content/professional.ts'

export interface HeadMeta {
  attr: 'name' | 'property'
  key: string
  /** `null` = la etiqueta no debe existir (el navegador la retira al cambiar de ruta) */
  content: string | null
}

export interface HeadModel {
  title: string
  metas: HeadMeta[]
  canonical: string | null
  /** JSON-LD ya serializado y seguro para incrustar en <script>, o null */
  jsonLd: string | null
}

/** El título ya puede incluir el nombre (portada); si no, se añade como sufijo. */
export function buildTitle(title: string): string {
  return title.includes(site.name) ? title : `${title} | ${site.name}`
}

type Json = Record<string, unknown>

const BMQ_NAME = 'Blindaje Médico Quirúrgico'

function officialProfiles(groupId: 'lina' | 'bmq'): string[] {
  const group = socialGroups.find((g) => g.id === groupId)
  // WhatsApp es un canal de contacto, no un perfil: no va en sameAs.
  return (group?.links ?? []).filter((l) => l.network !== 'whatsapp').map((l) => l.href)
}

/**
 * Grafo JSON-LD de la página. Sólo describe lo que el visitante puede leer en el sitio:
 * nombre, especialidad (derecho médico), cargo de CEO de BMQ, instituciones de formación y perfiles
 * oficiales. No hay calificaciones, reseñas, premios, direcciones ni teléfonos, ni tipos
 * especializados (LegalService, Attorney...) ni FAQPage.
 *
 * Sin dominio (SITE_URL vacío) sólo se emiten las entidades que no necesitan URL propia
 * (Person y la Organization de BMQ, que tiene su URL oficial); WebSite y WebPage se agregan al
 * confirmar el dominio, con identificadores estables `${dominio}/#...`.
 */
export function buildStructuredData(page: PageMetaEntry, siteUrl: string = SITE_URL): Json | null {
  if (page.noindex) return null

  const id = (fragment: string) => (siteUrl ? { '@id': `${siteUrl}/#${fragment}` } : {})
  const ref = (fragment: string) => (siteUrl ? { '@id': `${siteUrl}/#${fragment}` } : undefined)

  const organization: Json = {
    '@type': 'Organization',
    ...id('bmq'),
    name: BMQ_NAME,
    alternateName: 'BMQ',
    url: site.bmqUrl,
    sameAs: officialProfiles('bmq'),
  }

  const person: Json = {
    '@type': 'Person',
    ...id('lina-ochoa'),
    name: site.name,
    alternateName: 'Lina Ochoa',
    ...(siteUrl ? { url: `${siteUrl}/` } : {}),
    jobTitle: ['Abogada especialista en derecho médico', `CEO de ${BMQ_NAME}`],
    worksFor: ref('bmq') ?? organization,
    knowsAbout: [
      'Derecho médico',
      'Responsabilidad médica',
      'Historia clínica',
      'Gestión de instituciones de salud',
      'Consultoría jurídica en salud',
    ],
    alumniOf: credentialInstitutions.map((i) => ({ '@type': 'EducationalOrganization', name: i.name })),
    sameAs: officialProfiles('lina'),
  }

  const graph: Json[] = []

  if (siteUrl) {
    const pageType = page.path === '/perfil-profesional' ? 'ProfilePage' : 'WebPage'
    const about =
      page.path === '/blindaje-medico-quirurgico'
        ? { about: ref('bmq'), author: ref('lina-ochoa') }
        : page.path === '/' || page.path === '/perfil-profesional'
          ? { about: ref('lina-ochoa'), ...(pageType === 'ProfilePage' ? { mainEntity: ref('lina-ochoa') } : {}) }
          : { author: ref('lina-ochoa') }
    graph.push(
      {
        '@type': 'WebSite',
        ...id('website'),
        url: `${siteUrl}/`,
        name: site.name,
        inLanguage: 'es-CO',
        publisher: ref('lina-ochoa'),
      },
      {
        '@type': pageType,
        '@id': `${siteUrl}${page.path === '/' ? '/' : page.path}#webpage`,
        url: `${siteUrl}${page.path}`,
        name: buildTitle(page.title),
        description: page.description,
        inLanguage: 'es-CO',
        isPartOf: ref('website'),
        ...about,
      },
    )
  }
  graph.push(person)
  if (siteUrl) graph.push(organization)

  return { '@context': 'https://schema.org', '@graph': graph }
}

/** Serializa JSON-LD evitando que un "</script>" dentro de un texto cierre la etiqueta. */
export function serializeJsonLd(data: Json): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function buildHeadModel(page: PageMetaEntry, siteUrl: string = SITE_URL): HeadModel {
  const title = buildTitle(page.title)
  const url = siteUrl && !page.noindex ? `${siteUrl}${page.path}` : null
  const image = siteUrl ? `${siteUrl}${OG_IMAGE.src}` : null
  const structured = buildStructuredData(page, siteUrl)

  return {
    title,
    canonical: url,
    jsonLd: structured ? serializeJsonLd(structured) : null,
    metas: [
      { attr: 'name', key: 'description', content: page.description },
      { attr: 'name', key: 'robots', content: page.noindex ? 'noindex, follow' : null },
      { attr: 'property', key: 'og:title', content: title },
      { attr: 'property', key: 'og:description', content: page.description },
      { attr: 'property', key: 'og:type', content: 'website' },
      { attr: 'property', key: 'og:locale', content: site.locale },
      { attr: 'property', key: 'og:site_name', content: site.name },
      { attr: 'property', key: 'og:url', content: url },
      { attr: 'property', key: 'og:image', content: image },
      { attr: 'property', key: 'og:image:width', content: image ? String(OG_IMAGE.width) : null },
      { attr: 'property', key: 'og:image:height', content: image ? String(OG_IMAGE.height) : null },
      { attr: 'property', key: 'og:image:alt', content: image ? OG_IMAGE.alt : null },
      { attr: 'name', key: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
      { attr: 'name', key: 'twitter:title', content: title },
      { attr: 'name', key: 'twitter:description', content: page.description },
      { attr: 'name', key: 'twitter:image', content: image },
    ],
  }
}

/**
 * Valida el dominio configurado. Vacío es válido (aún sin confirmar). Si hay un valor debe ser un
 * origen https público: sin barra final, ruta, parámetros ni direcciones locales. Devuelve la lista
 * de problemas (vacía si es coherente) para que la compilación falle con un mensaje claro.
 */
export function validateSiteUrl(siteUrl: string): string[] {
  if (!siteUrl) return []
  const problems: string[] = []
  let url: URL | null = null
  try {
    url = new URL(siteUrl)
  } catch {
    return [`SITE_URL no es una URL válida: "${siteUrl}".`]
  }
  if (url.protocol !== 'https:') problems.push('SITE_URL debe usar https.')
  if (/^(localhost|127\.|10\.|192\.168\.|\[::1\]|0\.0\.0\.0)/.test(url.hostname) || url.hostname.endsWith('.localhost') || url.hostname.endsWith('.test')) {
    problems.push('SITE_URL apunta a una dirección local o reservada, no a un dominio público.')
  }
  if (siteUrl.endsWith('/')) problems.push('SITE_URL no debe terminar en barra (/).')
  if (url.pathname.replace(/\/$/, '') !== '' || url.search || url.hash) {
    problems.push('SITE_URL debe ser sólo el origen (sin ruta, parámetros ni fragmento).')
  }
  return problems
}

/** Rutas canónicas públicas para el sitemap (sin 404 ni recursos que no sean páginas). */
export function buildSitemap(pages: PageMetaEntry[], siteUrl: string): string {
  const escape = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const urls = pages
    .filter((p) => !p.noindex)
    .map((p) => `  <url><loc>${escape(siteUrl + (p.path === '/' ? '/' : p.path))}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function buildRobots(siteUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
}
