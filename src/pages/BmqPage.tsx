import { Briefcase, FileText, Stethoscope } from 'lucide-react'
import { photos } from '../config/images'
import { site } from '../config/site'
import { pageMeta } from '../content/pages'
import { usePageMeta } from '../hooks/usePageMeta'
import { ContactSection } from '../components/sections/ContactSection'
import { PageHero } from '../components/sections/PageHero'
import { Button } from '../components/ui/Button'
import { VideoShowcase } from '../components/sections/VideoShowcase'
import { TextLink } from '../components/ui/TextLink'
import { SectionHeading } from '../components/ui/SectionHeading'

const corporatePoints = [
  {
    icon: Stethoscope,
    title: 'Enfoque sectorial',
    text: 'Una propuesta orientada a las necesidades del ámbito médico y quirúrgico.',
  },
  {
    icon: Briefcase,
    title: 'Dirección corporativa',
    text: 'Una organización que dirijo como CEO, con identidad y propuesta propias.',
  },
  {
    icon: FileText,
    title: 'Información oficial',
    text: 'Consulta directamente en su web las coberturas, los servicios y sus condiciones vigentes.',
  },
]

const comparison = [
  {
    heading: 'Mi ejercicio profesional',
    items: [
      'Asesoría jurídica y estratégica a médicos, especialistas, clínicas e IPS.',
      'Defensa judicial, administrativa, ética y disciplinaria.',
      'Consultoría y gerencia en salud.',
    ],
    cta: { label: 'Ver derecho médico', to: '/derecho-medico' },
  },
  {
    heading: 'Blindaje Médico Quirúrgico',
    items: [
      'Organización que lidero como CEO, con su propia propuesta corporativa.',
      'Orientada a las necesidades de protección del sector médico y quirúrgico.',
      'La información de la organización se encuentra en su sitio oficial.',
    ],
  },
]

export default function BmqPage() {
  usePageMeta(pageMeta.bmq)

  return (
    <>
      <PageHero
        eyebrow="Liderazgo empresarial · CEO"
        title="CEO de Blindaje Médico Quirúrgico."
        description="Como CEO de Blindaje Médico Quirúrgico, participo en el liderazgo de una organización orientada a las necesidades de protección del sector médico y quirúrgico."
        photo={photos.armchair}
        photoPosition="50% 25%"
      >
        <Button href={site.bmqUrl} variant="bmq">
          Conoce Blindaje Médico Quirúrgico
        </Button>
      </PageHero>

      <section aria-labelledby="difference-title" className="section-y">
        <div className="container-editorial">
          <SectionHeading
            id="difference-title"
            eyebrow="Marca personal y organización"
            title="Propósitos relacionados, pero diferenciados."
            description="Desde mi ejercicio profesional acompaño asuntos jurídicos y estratégicos; desde BMQ, lidero una organización con su propia propuesta corporativa."
          />
          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-0">
            {comparison.map((column, index) => (
              <div
                key={column.heading}
                className={
                  index === 0
                    ? 'border-t border-line-strong pt-8 md:pr-12'
                    : 'border-t border-link pt-8 md:border-l md:border-l-line md:pl-12'
                }
              >
                <h3 className="text-2xl">{column.heading}</h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {column.items.map((item) => (
                    <li key={item} className="flex gap-4 text-[0.9375rem] leading-relaxed text-muted">
                      <span
                        aria-hidden="true"
                        className={index === 0 ? 'mt-[0.8em] h-px w-5 shrink-0 bg-accent' : 'mt-[0.8em] h-px w-5 shrink-0 bg-link'}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {column.cta && (
                  <div className="mt-6">
                    <Button to={column.cta.to} variant="text">
                      {column.cta.label}
                    </Button>
                  </div>
                )}
                {index === 1 && (
                  <div className="mt-6">
                    <Button href={site.bmqUrl} variant="bmq" size="sm">
                      Ir al sitio oficial de BMQ
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <VideoShowcase
        topic="bmq-proteccion"
        id="video-bmq"
        eyebrow="En video"
        title="Protección de la práctica médica, según BMQ."
        description="Una publicación de la organización en Instagram."
      />

      <section aria-labelledby="bmq-note" className="on-band section-y">
        <div className="container-editorial">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              <SectionHeading
                id="bmq-note"
                eyebrow="Información corporativa · BMQ"
                title="Una organización enfocada en la protección del sector médico y quirúrgico."
                description="Como CEO de Blindaje Médico Quirúrgico, lidero una organización con identidad y propuesta corporativa propias, orientada a las necesidades de protección del ejercicio médico y quirúrgico."
                wide
              />
            </div>
            <div className="flex flex-col items-start gap-8 lg:col-span-5 lg:justify-end">
              <p className="text-base leading-relaxed text-band-muted lg:text-lg">
                Conoce su enfoque, sus alternativas de protección y la información oficial sobre sus servicios.
              </p>
              <p className="text-[0.9375rem] leading-relaxed text-band-muted">
                Este sitio presenta mi marca personal; BMQ tiene su propia página web, independiente de ésta, donde
                figura su información corporativa. Mi formación en derecho médico y mi experiencia dirigiendo
                instituciones de salud están en mi{' '}
                <TextLink to="/perfil-profesional" className="text-band-accent hover:text-band-ink">
                  perfil profesional
                </TextLink>
                .
              </p>
              <Button href={site.bmqUrl} variant="bmq" tone="band">
                Consultar la web corporativa de BMQ
              </Button>
            </div>
          </div>

          <ul className="mt-14 grid gap-10 border-t border-band-line pt-10 md:grid-cols-3 md:gap-0 lg:mt-16">
            {corporatePoints.map(({ icon: Icon, title, text }, index) => (
              <li
                key={title}
                className={index === 0 ? 'md:pr-8' : 'md:border-l md:border-band-line md:px-8'}
              >
                <Icon aria-hidden="true" size={22} strokeWidth={1.5} className="text-band-accent" />
                <h3 className="mt-5 text-xl">{title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-band-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactSection
        title="¿Quieres conversar sobre mi ejercicio profesional?"
        description="Para asuntos jurídicos y estratégicos relacionados con el sector salud, podemos iniciar una conversación profesional."
      />
    </>
  )
}
