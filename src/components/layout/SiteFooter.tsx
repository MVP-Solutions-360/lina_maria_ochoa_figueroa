import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { mainNavigation } from '../../content/navigation'
import { privacy, site, whatsapp } from '../../config/site'
import { WhatsAppButton } from './WhatsAppButton'

const currentYear = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="on-band">
      <div className="container-editorial py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-3xl">{site.name}</p>
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-band-muted">{site.tagline}</p>
            <p className="mt-2 text-[0.9375rem] text-band-muted">{site.location}</p>
          </div>

          <nav aria-label="Páginas del sitio">
            <p className="eyebrow mb-5">Explorar</p>
            <ul className="flex flex-col">
              {mainNavigation.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex min-h-11 items-center text-[0.9375rem] text-band-muted transition-colors hover:text-band-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-5">Corporativo y contacto</p>
            <a
              href={site.bmqUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 w-fit items-center gap-2 text-[0.9375rem] text-band-link transition-colors hover:text-band-ink"
            >
              Blindaje Médico Quirúrgico
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only"> (sitio oficial, se abre en una pestaña nueva)</span>
            </a>
            {site.contactEmail && (
              <a
                href={`mailto:${site.contactEmail}`}
                className="flex min-h-11 w-fit items-center text-[0.9375rem] text-band-muted transition-colors hover:text-band-ink"
              >
                {site.contactEmail}
              </a>
            )}
            <div className="mt-4">
              <WhatsAppButton tone="band" variant="secondary" size="sm" label="WhatsApp" />
              {!whatsapp.isConfigured && (
                <p className="mt-3 max-w-xs text-xs leading-relaxed text-band-muted">{whatsapp.pendingNotice}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rule mt-14" />
        <div className="mt-6 flex flex-col gap-3 text-xs text-band-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {site.name}. Todos los derechos reservados.
          </p>
          {privacy.approved ? null : <p>{privacy.pendingLabel}</p>}
        </div>
      </div>
    </footer>
  )
}
