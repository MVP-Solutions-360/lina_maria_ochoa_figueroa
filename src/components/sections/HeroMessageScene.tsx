import { photos } from '../../config/images'
import { cx } from '../../lib/cx'
import { WhatsAppButton } from '../layout/WhatsAppButton'
import { Button } from '../ui/Button'
import { EditorialImage } from '../ui/EditorialImage'
import { riseClass, riseStyle } from './heroMotion'

interface HeroMessageSceneProps {
  active: boolean
}

/** Escena 2: propuesta. Titular editorial junto a fotografía en color. */
export function HeroMessageScene({ active }: HeroMessageSceneProps) {
  return (
    <div className="container-editorial grid h-full min-h-[inherit] items-center gap-12 pb-24 pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-8">
      <div className="lg:col-span-7">
        <p className={cx('eyebrow mb-8', riseClass(active))} style={riseStyle(active, 150)}>
          Derecho médico · Liderazgo · Visión estratégica
        </p>

        <h2
          className={cx('text-[2.75rem] leading-[1.04] sm:text-6xl lg:text-[5rem]', riseClass(active))}
          style={riseStyle(active, 300)}
        >
          Derecho médico.
          <br />
          Liderazgo.
          <br />
          <span className="italic text-accent">Visión estratégica.</span>
        </h2>

        <p
          className={cx('mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg', riseClass(active))}
          style={riseStyle(active, 500)}
        >
          Acompaño a médicos, especialistas, clínicas e instituciones de salud en sus desafíos
          jurídicos y estratégicos, con una perspectiva que integra experiencia legal, conocimiento
          institucional y visión directiva.
        </p>

        <div
          className={cx('mt-10 flex flex-col gap-4 sm:flex-row sm:items-center', riseClass(active))}
          style={riseStyle(active, 700)}
        >
          <WhatsAppButton label="Conversemos por WhatsApp" />
          <Button to="/perfil-profesional" variant="secondary">
            Conoce mi trayectoria
          </Button>
        </div>
      </div>

      <div
        className={cx(
          'hidden lg:col-span-5 lg:block',
          'transition-[opacity,transform] duration-[1600ms] ease-out',
          active ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0',
        )}
      >
        <EditorialImage
          photo={photos.hallway}
          aspect="aspect-[4/5]"
          sizes="40vw"
          className="mx-auto max-h-[calc(100svh-12rem)] max-w-md lg:max-w-none"
        />
      </div>
    </div>
  )
}
