import { photos } from '../../config/images'
import { PRACTICE_START_YEAR, yearsOfPractice } from '../../content/professional'
import { cx } from '../../lib/cx'
import { riseClass, riseStyle } from './heroMotion'

interface HeroIdentitySceneProps {
  active: boolean
}

/** Escena 1: identidad. Medio rostro en blanco y negro, nombre y título profesional. */
export function HeroIdentityScene({ active }: HeroIdentitySceneProps) {
  const photo = photos.halfFace

  return (
    <div className="relative flex h-full min-h-[inherit] flex-col lg:block">
      <div className="container-editorial relative z-10 pb-6 pt-12 lg:flex lg:h-full lg:items-center lg:pb-24 lg:pt-8">
        <div className="max-w-2xl lg:w-[58%]">
          <p className={cx('eyebrow mb-7', riseClass(active))} style={riseStyle(active, 150)}>
            Abogada · Derecho médico
          </p>

          <h1
            className={cx('text-[3rem] leading-[1.02] sm:text-7xl lg:text-[5.75rem]', riseClass(active))}
            style={riseStyle(active, 300)}
          >
            Lina María
            <br />
            <span className="italic text-accent">Ochoa Figueroa</span>
          </h1>

          <p
            className={cx('mt-7 max-w-md text-lg leading-snug text-ink sm:text-xl', riseClass(active))}
            style={riseStyle(active, 500)}
          >
            Abogada especialista en Derecho Médico y directiva del sector salud.
          </p>

          <dl
            className={cx('mt-10 flex gap-10 border-t border-line-strong pt-6 sm:gap-14', riseClass(active))}
            style={riseStyle(active, 700)}
          >
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Ejercicio profesional desde</dt>
              <dd className="mt-1 font-serif text-4xl text-accent sm:text-5xl">{PRACTICE_START_YEAR}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Trayectoria jurídica</dt>
              <dd className="mt-1 font-serif text-4xl text-accent sm:text-5xl">
                {yearsOfPractice}
                <span className="ml-2 font-sans text-base text-ink sm:text-lg">años</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Medio rostro: anclado al borde derecho; el texto nunca se superpone al rostro. */}
      <div
        className={cx(
          'relative mt-2 h-[24rem] overflow-hidden sm:h-[30rem] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[42%]',
          'transition-[opacity,transform] duration-[1600ms] ease-out',
          active ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0',
        )}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="fade-edges absolute right-0 top-0 h-[118%] w-auto max-w-none lg:-top-[2%] lg:h-[122%]"
        />
      </div>
    </div>
  )
}
