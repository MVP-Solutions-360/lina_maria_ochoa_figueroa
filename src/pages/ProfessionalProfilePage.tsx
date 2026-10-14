import { careerTimeline } from '../content/professional'
import { pageMeta } from '../content/pages'
import { usePageMeta } from '../hooks/usePageMeta'
import { CareerFigures } from '../components/sections/CareerFigures'
import { ContactSection } from '../components/sections/ContactSection'
import { EducationList } from '../components/sections/EducationList'
import { ProfileBlocks } from '../components/sections/ProfileBlocks'
import { ProfileHero } from '../components/sections/ProfileHero'
import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Timeline } from '../components/ui/Timeline'

export default function ProfessionalProfilePage() {
  usePageMeta(pageMeta.profile)

  return (
    <>
      <ProfileHero />
      <CareerFigures />
      <ProfileBlocks />
      <EducationList />

      <section aria-labelledby="cronologia-title" className="on-band section-y">
        <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <SectionHeading
              id="cronologia-title"
              eyebrow="Cronología"
              title="Formación, ejercicio y dirección, en orden."
              description="Sólo hitos documentados; cada uno indica si es formación, ejercicio o cargo directivo."
            />
          </div>
          <div className="lg:col-span-8">
            <Timeline items={careerTimeline} />
          </div>
        </div>
      </section>

      <section aria-labelledby="areas-trabajo-title" className="pt-16 lg:pt-24">
        <div className="container-editorial">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="areas-trabajo-title" className="text-2xl sm:text-3xl">
              Conoce mis áreas de trabajo
            </h2>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-8">
              <Button to="/derecho-medico" variant="text">
                Derecho médico
              </Button>
              <Button to="/consultoria-en-salud" variant="text">
                Consultoría en salud
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ContactSection
        eyebrow="Contacto"
        title="Si quieres conversar sobre tu práctica o tu institución, escríbeme."
        description="Cuéntame brevemente tu situación y exploramos el acompañamiento adecuado."
        buttonLabel="Contactar por WhatsApp"
      />
    </>
  )
}
