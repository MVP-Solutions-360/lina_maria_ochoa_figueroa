import { photos } from '../../config/images'
import { site } from '../../config/site'
import { EditorialImage } from '../ui/EditorialImage'
import { TextLink } from '../ui/TextLink'

/** Hero editorial de /perfil-profesional: nombre, especialidad, introducción y fotografía. */
export function ProfileHero() {
  return (
    <section aria-labelledby="perfil-title" className="border-b border-line">
      <div className="container-editorial grid items-center gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-7">Perfil profesional</p>
          <h1 id="perfil-title" className="text-[2.75rem] leading-[1.04] sm:text-6xl lg:text-[5rem]">
            Lina María{' '}
            <br />
            <span className="italic text-accent">Ochoa Figueroa</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-snug text-ink sm:text-xl">
            Abogada especializada en derecho médico, con experiencia en la gestión de instituciones de salud.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Acompaño a médicos, especialistas, clínicas e instituciones de salud con una mirada que une el
            criterio jurídico y la experiencia de haberlas dirigido. Soy además CEO de Blindaje Médico
            Quirúrgico (BMQ), organización con propuesta propia cuya información corporativa está en{' '}
            <TextLink href={site.bmqUrl}>el sitio web oficial de BMQ</TextLink>. Mi trabajo se organiza en{' '}
            <TextLink to="/derecho-medico">derecho médico</TextLink> y{' '}
            <TextLink to="/consultoria-en-salud">consultoría jurídica en salud</TextLink>.
          </p>
        </div>

        <div className="lg:col-span-5">
          <EditorialImage
            photo={photos.portrait}
            priority
            aspect="aspect-square"
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="mx-auto max-w-md lg:max-w-none"
          />
        </div>
      </div>
    </section>
  )
}
