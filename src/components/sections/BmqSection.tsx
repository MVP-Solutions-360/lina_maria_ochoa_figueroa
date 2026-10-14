import { photos } from '../../config/images'
import { site } from '../../config/site'
import { Button } from '../ui/Button'
import { TextLink } from '../ui/TextLink'
import { EditorialImage } from '../ui/EditorialImage'

export function BmqSection() {
  return (
    <section aria-labelledby="bmq-title" className="section-y bg-surface-muted">
      <div className="container-editorial grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <EditorialImage
            photo={photos.dark}
            aspect="aspect-[4/5]"
            sizes="(min-width: 1024px) 36vw, 90vw"
            className="mx-auto max-w-sm lg:max-w-none"
          />
        </div>

        <div className="lg:col-span-7">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-link">
            Liderazgo empresarial · CEO
          </p>
          <h2 id="bmq-title" className="text-[1.9rem] sm:text-4xl lg:text-[2.75rem]">
            Liderazgo con visión del sector salud.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink sm:text-lg">
            Como CEO de Blindaje Médico Quirúrgico, participo en el liderazgo de una organización
            orientada a las necesidades de protección del sector médico y quirúrgico.
          </p>
          <p className="mt-5 max-w-2xl border-l-2 border-link pl-5 text-[0.9375rem] leading-relaxed text-muted">
            Mi marca personal y BMQ tienen propósitos relacionados, pero diferenciados: desde mi
            ejercicio profesional acompaño asuntos jurídicos y estratégicos; desde BMQ, lidero una
            organización con su propia propuesta corporativa, que mantiene su{' '}
            <TextLink href={site.bmqUrl}>sitio web corporativo</TextLink>.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href={site.bmqUrl} variant="bmq">
              Visitar el sitio oficial de BMQ
            </Button>
            <Button to="/blindaje-medico-quirurgico" variant="text">
              Mi rol como CEO
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
