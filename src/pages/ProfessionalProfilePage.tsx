import { photos } from '../config/images'
import { competencies, education, experience, strengths } from '../content/professional'
import { usePageMeta } from '../hooks/usePageMeta'
import { ContactSection } from '../components/sections/ContactSection'
import { PageHero } from '../components/sections/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Timeline } from '../components/ui/Timeline'

export default function ProfessionalProfilePage() {
  usePageMeta({
    title: 'Perfil profesional',
    description:
      'Trayectoria de Lina María Ochoa Figueroa: abogada litigante y consultora en derecho médico, con experiencia directiva en instituciones del sector salud.',
    path: '/perfil-profesional',
    image: photos.desk.src,
  })

  return (
    <>
      <PageHero
        eyebrow="Perfil profesional"
        title="Abogada y directiva del sector salud."
        description="Trayectoria jurídica desde 2010, entre el derecho médico y la dirección de instituciones de salud."
        photo={photos.desk}
        photoAspect="aspect-square"
        photoPosition="50% 100%"
      />

      <section aria-labelledby="bio-title" className="section-y">
        <div className="container-editorial grid gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <SectionHeading id="bio-title" eyebrow="Biografía" title="Una mirada que une el derecho y la gestión." />
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted lg:col-span-8 lg:text-lg">
            <p>
              Soy abogada y gerente de clínicas, con una trayectoria directiva consolidada en el sector
              salud. Mi experiencia abarca la dirección integral de IPS y clínicas, la gestión
              hospitalaria, la habilitación de servicios, la calidad asistencial, la seguridad del
              paciente, la contratación y la atención de requerimientos de inspección, vigilancia y control.
            </p>
            <p>
              Soy especialista en Derecho Médico y asesora de médicos, clínicas e IPS. Cuento con
              experiencia en defensa judicial, administrativa, ética y disciplinaria; responsabilidad
              médica; contratación sanitaria; consentimiento informado; historia clínica; PQR; relaciones
              laborales y gestión del riesgo jurídico en la prestación de servicios de salud.
            </p>
            <p>
              Hoy, además, lidero como CEO a Blindaje Médico Quirúrgico, una organización con su propia
              propuesta corporativa, diferenciada de mi ejercicio profesional.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="exp-title" className="on-band section-y">
        <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <SectionHeading
              id="exp-title"
              eyebrow="Experiencia"
              title="Experiencia directiva y jurídica."
              description="Descripción general de la trayectoria profesional."
            />
          </div>
          <div className="lg:col-span-8">
            <Timeline
              items={experience.map((entry) => ({
                label: entry.period,
                title: entry.title,
                description: entry.description,
                kind: 'experiencia' as const,
              }))}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="edu-title" className="section-y">
        <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <SectionHeading id="edu-title" eyebrow="Formación académica" title="Formación jurídica y en gerencia de la salud." />
          </div>
          <ul className="border-b border-line-strong lg:col-span-8">
            {education.map((degree) => (
              <li
                key={degree.program}
                className="flex flex-col gap-1 border-t border-line-strong py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div>
                  <h3 className="font-sans text-base font-medium leading-snug">{degree.program}</h3>
                  <p className="mt-1 text-sm text-muted">{degree.institution}</p>
                </div>
                {degree.year && (
                  <p className="font-serif text-lg text-accent sm:shrink-0">{degree.year}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="strengths-title" className="section-y border-t border-line bg-surface">
        <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <SectionHeading id="strengths-title" eyebrow="Áreas de mayor fortaleza" title="Dónde puedo aportar más." />
          </div>
          <div className="lg:col-span-8">
            <ul className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
              {strengths.map((item) => (
                <li key={item} className="flex gap-4 text-[0.9375rem] leading-relaxed">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="eyebrow mb-4 mt-14">Competencias directivas</p>
            <ul className="flex flex-wrap gap-3">
              {competencies.map((item) => (
                <li key={item} className="border border-line px-4 py-2 text-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ContactSection
        title="Conversemos sobre el acompañamiento que tu práctica o tu institución necesita."
        buttonLabel="Contactar por WhatsApp"
      />
    </>
  )
}
