import { SITE_URL, site } from '../config/site'

export interface PageMeta {
  title: string
  description: string
  /** Ruta de la página, ej. '/perfil-profesional' */
  path: string
  /** Ruta pública de la imagen para Open Graph (se vuelve absoluta sólo si hay SITE_URL) */
  image?: string
}

export function buildTitle(title: string): string {
  return title === site.name ? title : `${title} | ${site.name}`
}

function setMeta(attr: 'name' | 'property', key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (content === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (href === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Aplica título, descripción, Open Graph y canónica. Sin dominio configurado no hay URLs absolutas. */
export function applyPageMeta({ title, description, path, image }: PageMeta) {
  const fullTitle = buildTitle(title)
  const url = SITE_URL ? `${SITE_URL}${path === '/' ? '/' : path}` : null
  const imageUrl = SITE_URL && image ? `${SITE_URL}${image}` : null

  document.title = fullTitle
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', fullTitle)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:locale', site.locale)
  setMeta('property', 'og:site_name', site.name)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', imageUrl)
  setMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary')
  setCanonical(url)
}
