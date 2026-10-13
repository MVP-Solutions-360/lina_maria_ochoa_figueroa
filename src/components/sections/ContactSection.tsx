import type { ReactNode } from 'react'
import { site, whatsapp } from '../../config/site'
import { WhatsAppButton } from '../layout/WhatsAppButton'
import { SectionHeading } from '../ui/SectionHeading'

interface ContactSectionProps {
  title?: ReactNode
  description?: ReactNode
  eyebrow?: string
  buttonLabel?: string
}

export function ContactSection({
  eyebrow = 'Contacto',
  title = 'Los desafíos del sector salud merecen una mirada integral.',
  description = 'Si eres médico, especialista o haces parte de una clínica, IPS u organización del sector salud, podemos conversar sobre tus necesidades y explorar el acompañamiento profesional adecuado.',
  buttonLabel = 'Contactar por WhatsApp',
}: ContactSectionProps) {
  return (
    <section aria-labelledby="contact-title" className="section-y">
      <div className="container-editorial">
        <div className="border-t border-line-strong pt-14 lg:grid lg:grid-cols-12 lg:gap-16 lg:pt-20">
          <div className="lg:col-span-8">
            <SectionHeading id="contact-title" eyebrow={eyebrow} title={title} description={description} />
          </div>
          <div className="mt-10 lg:col-span-4 lg:mt-0 lg:self-end">
            <WhatsAppButton label={buttonLabel} className="w-full sm:w-auto" />
            {!whatsapp.isConfigured && (
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted">{whatsapp.pendingNotice}</p>
            )}
            {site.contactEmail && (
              <p className="mt-5 text-sm text-muted">
                También por correo:{' '}
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="inline-flex min-h-11 items-center text-link underline underline-offset-4 hover:text-link-hover"
                >
                  {site.contactEmail}
                </a>
              </p>
            )}
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted">
              En este primer mensaje, por favor no envíes historias clínicas ni documentos sensibles.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
