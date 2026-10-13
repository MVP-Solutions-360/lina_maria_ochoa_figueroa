import { photos } from '../config/images'
import { site } from '../config/site'
import { usePageMeta } from '../hooks/usePageMeta'
import { ContactSection } from '../components/sections/ContactSection'
import { PageHero } from '../components/sections/PageHero'
import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'

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
  usePageMeta({
    title: 'Blindaje Médico Quirúrgico',
    description:
      'Lina María Ochoa Figueroa es CEO de Blindaje Médico Quirúrgico (BMQ), una organización con propuesta corporativa propia. Conoce su sitio oficial.',
    path: '/blindaje-medico-quirurgico',
    image: photos.armchair.src,
  })

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

      <section aria-labelledby="bmq-note" className="on-band section-y">
        <div className="container-editorial grid gap-8 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading id="bmq-note" eyebrow="Información corporativa" title="Los detalles viven en el sitio oficial." />
          </div>
          <p className="text-base leading-relaxed text-band-muted lg:col-span-7 lg:text-lg">
            Esta página es un puente. Para conocer la propuesta, los servicios y las condiciones de
            Blindaje Médico Quirúrgico, consulta directamente su sitio oficial.
          </p>
        </div>
      </section>

      <ContactSection
        title="¿Quieres conversar sobre mi ejercicio profesional?"
        description="Para asuntos jurídicos y estratégicos relacionados con el sector salud, podemos iniciar una conversación profesional."
      />
    </>
  )
}
