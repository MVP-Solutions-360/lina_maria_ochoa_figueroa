import type { PageMetaEntry } from '../content/pages'
import { buildHeadModel, buildTitle } from './seoModel'

export type PageMeta = PageMetaEntry

export { buildTitle }

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

/** Un único bloque JSON-LD: el estático del HTML de compilación se reutiliza, no se duplica. */
export const JSON_LD_SELECTOR = 'script[type="application/ld+json"][data-seo]'

function setJsonLd(json: string | null) {
  let el = document.head.querySelector<HTMLScriptElement>(JSON_LD_SELECTOR)
  if (json === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.setAttribute('type', 'application/ld+json')
    el.setAttribute('data-seo', '')
    document.head.appendChild(el)
  }
  el.textContent = json
}

/**
 * Aplica título, descripción, Open Graph, Twitter Cards, canónica y JSON-LD al navegar.
 * Sin dominio configurado (SITE_URL) no se generan URLs absolutas (canónica, og:url, og:image).
 * Los valores salen de `buildHeadModel`, el mismo modelo que usa el HTML estático de
 * compilación (build/seoPlugin.ts).
 */
export function applyPageMeta(page: PageMeta, siteUrl?: string) {
  const model = buildHeadModel(page, siteUrl)
  document.title = model.title
  model.metas.forEach(({ attr, key, content }) => setMeta(attr, key, content))
  setCanonical(model.canonical)
  setJsonLd(model.jsonLd)
}
