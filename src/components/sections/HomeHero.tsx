import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useSceneCycle } from '../../hooks/useSceneCycle'
import { cx } from '../../lib/cx'
import { HeroIdentityScene } from './HeroIdentityScene'
import { HeroMessageScene } from './HeroMessageScene'

const scenes = [
  { id: 'identidad', label: 'Identidad', duration: 12000 },
  { id: 'propuesta', label: 'Propuesta', duration: 10000 },
]

/**
 * Hero cinemático de dos escenas. Las dos viven en el DOM (superpuestas) y la inactiva
 * queda `inert`. El avance automático se puede pausar y respeta prefers-reduced-motion.
 */
export function HomeHero() {
  const { index, select, playing, toggle, duration } = useSceneCycle(scenes.map((s) => s.duration))

  // Entrada inicial: el contenido nace oculto y se revela tras el primer pintado, para que
  // la foto y luego los textos se animen también al cargar la página (no sólo al cambiar de escena).
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Presentación"
      className="relative grid min-h-[calc(100svh-4.5rem)] overflow-hidden border-b border-line lg:min-h-[max(40rem,calc(100svh-4.5rem))]"
    >
      {[HeroIdentityScene, HeroMessageScene].map((Scene, i) => (
        <div
          key={scenes[i]!.id}
          // Patrón ARIA de carrusel: cada escena es un grupo con aria-roledescription.
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role="group"
          aria-roledescription="escena"
          aria-label={`${i + 1} de ${scenes.length}: ${scenes[i]!.label}`}
          inert={index !== i}
          className={cx(
            'col-start-1 row-start-1 min-h-[inherit] transition-opacity duration-[1100ms] ease-out',
            index === i ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0',
          )}
        >
          <Scene active={entered && index === i} />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="container-editorial pb-6">
          <div className="pointer-events-auto flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pausar presentación' : 'Reanudar presentación'}
              className="inline-flex h-11 w-11 items-center justify-center border border-line-strong bg-bg/80 text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {playing ? (
                <Pause size={16} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Play size={16} strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>

            <ul className="flex flex-1 gap-3 sm:max-w-sm">
              {scenes.map((scene, i) => (
                <li key={scene.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-current={index === i ? 'true' : undefined}
                    className="group block min-h-11 w-full text-left"
                  >
                    <span
                      className={cx(
                        'block text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors',
                        index === i ? 'text-ink' : 'text-muted group-hover:text-ink',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')} · {scene.label}
                    </span>
                    <span className="relative mt-2 block h-px w-full bg-line-strong">
                      {index === i && (
                        <span
                          key={`${index}-${playing}`}
                          className={cx('hero-progress absolute inset-y-0 left-0 w-full bg-accent', !playing && 'hero-progress-paused')}
                          style={{ animationDuration: `${duration}ms` }}
                        />
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live={playing ? 'off' : 'polite'}>
        Escena {index + 1} de {scenes.length}: {scenes[index]!.label}
      </p>
    </section>
  )
}
