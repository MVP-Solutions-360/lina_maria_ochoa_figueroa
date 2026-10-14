import { consultingBlocks } from '../content/services'
import { photos } from '../config/images'
import { pageMeta } from '../content/pages'
import { usePageMeta } from '../hooks/usePageMeta'
import { ContactSection } from '../components/sections/ContactSection'
import { PageHero } from '../components/sections/PageHero'
import { ServiceList } from '../components/sections/ServiceList'
import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'

export default function HealthcareConsultingPage() {
  usePageMeta(pageMeta.consulting)

  return (
    <>
      <PageHero
        eyebrow="Consultoría en salud"
        title="Visión directiva para instituciones de salud."
        description="Acompañamiento a clínicas e IPS desde la experiencia de haberlas dirigido: operación, cumplimiento normativo, contratación y gestión del riesgo."
        photo={photos.consulting}
        photoPosition="50% 15%"
      />

      <section aria-labelledby="consulting-title" className="section-y">
        <div className="container-editorial">
          <SectionHeading
            id="consulting-title"
            eyebrow="Áreas de acompañamiento"
            title="Gestión institucional con criterio jurídico."
            className="mb-14"
          />
          <ServiceList blocks={consultingBlocks} labelledBy="consulting-title" />
        </div>
      </section>

      <section aria-labelledby="consulting-scope" className="on-band section-y">
        <div className="container-editorial grid gap-8 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading id="consulting-scope" eyebrow="Alcance" title="Acompañamiento a la medida de cada institución." />
          </div>
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-band-muted lg:text-lg">
              Cada institución tiene una realidad distinta. El acompañamiento se define después de
              conocer su operación, sus necesidades y sus prioridades. Este sitio no ofrece
              certificaciones ni garantiza resultados operativos.
            </p>
            <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:gap-8">
              <Button to="/perfil-profesional" variant="text" tone="band">
                Mi experiencia dirigiendo instituciones
              </Button>
              <Button to="/derecho-medico" variant="text" tone="band">
                Asesoría en derecho médico
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ContactSection
        title="Conversemos sobre las necesidades de tu organización."
        buttonLabel="Conversar por WhatsApp"
      />
    </>
  )
}
