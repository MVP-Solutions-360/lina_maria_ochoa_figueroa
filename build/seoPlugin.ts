import type { Plugin } from 'vite'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { OG_IMAGE, SITE_URL } from '../src/config/site.ts'
import { indexablePages, pageMeta, type PageMetaEntry } from '../src/content/pages.ts'
import { buildHeadModel, buildRobots, buildSitemap, validateSiteUrl } from '../src/lib/seoModel.ts'

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headTags(page: PageMetaEntry, siteUrl: string): string {
  const model = buildHeadModel(page, siteUrl)
  const tags = [
    ...model.metas
      .filter((m) => m.content !== null)
      .map((m) => `<meta ${m.attr}="${m.key}" content="${escapeAttr(m.content!)}" />`),
    model.canonical ? `<link rel="canonical" href="${escapeAttr(model.canonical)}" />` : '',
    // Mismo selector que usa el navegador (src/lib/seo.ts): React lo actualiza, no lo duplica.
    model.jsonLd ? `<script type="application/ld+json" data-seo>${model.jsonLd}</script>` : '',
  ]
  return `<title>${escapeAttr(model.title)}</title>\n    ${tags.filter(Boolean).join('\n    ')}`
}

/**
 * Sustituye el título y la descripción genéricos de index.html por las etiquetas de la página.
 * Las expresiones no pueden cruzar etiquetas (`[^<]*`, `[^>]*`): un comentario que mencione "<title>"
 * no debe provocar que se elimine HTML real. Si el resultado no es un documento válido, la
 * compilación falla en lugar de publicar una página en blanco.
 */
export function renderPage(template: string, page: PageMetaEntry, siteUrl: string = SITE_URL): string {
  const withoutDefaults = template
    .replace(/<!--[\s\S]*?-->\s*/g, '') // los comentarios de la plantilla no se publican ni interfieren
    .replace(/<title>[^<]*<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/i, '')
  const html = withoutDefaults.replace('</head>', `    ${headTags(page, siteUrl)}\n  </head>`)
  if (!html.includes('id="root"') || !html.includes('<script type="module"') || (html.match(/<title>/gi) ?? []).length !== 1) {
    throw new Error(`seoPlugin: el HTML generado para ${page.path} no es válido (falta #root, el script o el título es ambiguo).`)
  }
  return html
}

/**
 * Genera, al compilar, un HTML estático por ruta (dist/<ruta>/index.html) con título, descripción,
 * canonical y Open Graph/Twitter propios, además de dist/404.html (noindex), sitemap.xml y
 * robots.txt (estos dos sólo si SITE_URL está definido). Así los rastreadores y las vistas
 * previas de WhatsApp o Facebook, que no ejecutan JavaScript, ven los metadatos correctos.
 */
export function seoPlugin(options: { siteUrl?: string } = {}): Plugin {
  const siteUrl = options.siteUrl ?? SITE_URL
  return {
    name: 'lina-seo-static-pages',
    apply: 'build',
    // Debe ejecutarse después del plugin interno de Vite que emite index.html.
    enforce: 'post',
    generateBundle(_options, bundle) {
      const problems = validateSiteUrl(siteUrl)
      if (siteUrl && !existsSync(join(process.cwd(), 'public', OG_IMAGE.src))) {
        problems.push(`La imagen para compartir public${OG_IMAGE.src} no existe.`)
      }
      if (problems.length) {
        throw new Error(`seoPlugin: configuración SEO incoherente. ${problems.join(' ')}`)
      }
      const index = bundle['index.html']
      if (!index || index.type !== 'asset') return
      const template = String(index.source)

      index.source = renderPage(template, pageMeta.home, siteUrl)
      for (const page of indexablePages) {
        if (page.path === '/') continue
        this.emitFile({
          type: 'asset',
          fileName: `${page.path.slice(1)}/index.html`,
          source: renderPage(template, page, siteUrl),
        })
      }
      this.emitFile({ type: 'asset', fileName: '404.html', source: renderPage(template, pageMeta.notFound, siteUrl) })

      if (!siteUrl) {
        this.warn('SITE_URL está vacío: no se generan canonical, og:url, og:image, sitemap.xml ni robots.txt.')
        return
      }
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(indexablePages, siteUrl) })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(siteUrl) })
    },
  }
}
