import { homeMilestones, postgraduateSummary } from '../../content/professional'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import { Timeline } from '../ui/Timeline'

/** Resumen de trayectoria para la portada. La versión completa vive en /perfil-profesional. */
export function ProfessionalProfile() {
  return (
    <section aria-labelledby="profile-title" className="on-band section-y">
      <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            id="profile-title"
            eyebrow="Trayectoria & credenciales"
            title="Experiencia jurídica con visión institucional."
            description="Mi trayectoria combina el ejercicio de la abogacía con la dirección de instituciones del sector salud, permitiéndome comprender los desafíos jurídicos y operativos desde una perspectiva integral."
          />
          <div className="mt-10">
            <Button to="/perfil-profesional" tone="band">
              Conoce mi trayectoria profesional
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Timeline items={homeMilestones} />
          <div className="mt-10 border-t border-band-line pt-8">
            <p className="eyebrow mb-3">Formación de posgrado</p>
            <p className="max-w-xl text-[0.9375rem] leading-relaxed text-band-muted">{postgraduateSummary}</p>
          </div>
          <p className="mt-6 flex gap-6 text-xs text-band-muted">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border-2 border-band-accent" />
              Formación
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-band-accent" />
              Experiencia
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
