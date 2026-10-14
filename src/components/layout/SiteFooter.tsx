import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { logos } from '../../config/images'
import { mainNavigation } from '../../content/navigation'
import { credentialInstitutions } from '../../content/professional'
import { privacy, site, socialGroups, whatsapp, type SocialNetwork } from '../../config/site'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '../ui/BrandIcons'
import { WhatsAppButton } from './WhatsAppButton'

const currentYear = new Date().getFullYear()

const socialIcons: Record<SocialNetwork, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsAppIcon,
}

export function SiteFooter() {
  return (
    <footer className="on-band">
      <div className="container-editorial py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-block">
              <img
                src={logos.footer.src}
                alt={logos.footer.alt}
                width={logos.footer.width}
                height={logos.footer.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-44 sm:w-48 lg:w-52"
              />
            </Link>
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-band-muted">{site.tagline}</p>
            <p className="mt-2 text-[0.9375rem] text-band-muted">{site.location}</p>
            <ul aria-label="Formación académica" className="mt-6 flex gap-2.5 opacity-70">
              {credentialInstitutions.map((institution) =>
                institution.emblem ? (
                  <li key={institution.name}>
                    <span
                      title={institution.name}
                      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm bg-black p-1 ring-1 ring-band-line"
                    >
                      <img
                        src={institution.emblem.src}
                        alt={institution.emblem.alt}
                        width={institution.emblem.width}
                        height={institution.emblem.height}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain"
                      />
                    </span>
                  </li>
                ) : null,
              )}
            </ul>
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
        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          {socialGroups.map((group) => (
            <nav key={group.id} aria-labelledby={`social-${group.id}`}>
              <p id={`social-${group.id}`} className="eyebrow mb-4">
                Redes · {group.heading}
              </p>
              <ul className="flex flex-wrap gap-3">
                {group.links.map((link) => {
                  const Icon = socialIcons[link.network]
                  return (
                    <li key={link.network}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 w-12 items-center justify-center border border-band-line text-band-muted transition-colors hover:border-band-accent hover:text-band-accent"
                      >
                        <Icon size={20} />
                        <span className="sr-only">
                          {link.label} de {group.heading} (se abre en una pestaña nueva)
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="rule mt-10" />
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
