import { medicalLawBlocks } from '../content/services'
import { photos } from '../config/images'
import { usePageMeta } from '../hooks/usePageMeta'
import { ContactSection } from '../components/sections/ContactSection'
import { PageHero } from '../components/sections/PageHero'
import { ServiceList } from '../components/sections/ServiceList'
import { SectionHeading } from '../components/ui/SectionHeading'

export default function MedicalLawPage() {
  usePageMeta({
    title: 'Derecho médico',
    description:
      'Asesoría y defensa jurídica en derecho médico y responsabilidad médica para médicos, especialistas, clínicas e IPS.',
    path: '/derecho-medico',
    image: photos.desk.src,
  })

  return (
    <>
      <PageHero
        eyebrow="Derecho médico"
        title="Criterio jurídico para quienes ejercen la medicina."
        description="Asesoría, prevención y defensa para médicos, especialistas, clínicas e instituciones de salud, con una comprensión directa de la práctica clínica y de la operación institucional."
      />

      <section aria-labelledby="areas-title" className="section-y">
        <div className="container-editorial">
          <SectionHeading
            id="areas-title"
            eyebrow="Áreas de acompañamiento"
            title="Cuatro frentes de trabajo en derecho médico."
            className="mb-14"
          />
          <ServiceList blocks={medicalLawBlocks} labelledBy="areas-title" />
        </div>
      </section>

      <section aria-labelledby="scope-title" className="on-band section-y">
        <div className="container-editorial grid gap-8 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading
              id="scope-title"
              eyebrow="Alcance"
              title="Cada caso se evalúa de forma individual."
            />
          </div>
          <p className="text-base leading-relaxed text-band-muted lg:col-span-7 lg:text-lg">
            La información de este sitio es de carácter general y no reemplaza la evaluación
            individual de un caso. El acompañamiento jurídico depende de los hechos, los documentos y
            el contexto de cada situación, por lo que no se ofrecen ni se prometen resultados.
          </p>
        </div>
      </section>

      <ContactSection
        title="Si necesitas asesoría en derecho médico, podemos iniciar una conversación profesional."
        buttonLabel="Iniciar conversación por WhatsApp"
      />
    </>
  )
}
