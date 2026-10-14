import { careerFigures } from '../../content/professional'
import { SectionHeading } from '../ui/SectionHeading'

/** Dos hitos con año de referencia. No se calculan duraciones, para que ninguna cifra dependa de la fecha de consulta. */
export function CareerFigures() {
  return (
    <section aria-labelledby="cifras-title" className="on-band section-y">
      <div className="container-editorial">
        <SectionHeading id="cifras-title" eyebrow="Trayectoria" title="Dos fechas que marcan mi recorrido." />

        <dl className="mt-14 grid gap-14 md:grid-cols-2 md:gap-0">
          {careerFigures.map((figure, index) => (
            <div
              key={figure.year}
              className={index === 0 ? 'md:pr-12 lg:pr-20' : 'border-t border-band-line pt-14 md:border-l md:border-t-0 md:pl-12 md:pt-0 lg:pl-20'}
            >
              <dt className="eyebrow">{figure.label}</dt>
              <dd className="mt-4">
                <span className="block font-serif text-[4.5rem] leading-none text-band-accent sm:text-[6rem] lg:text-[7.5rem]">
                  {figure.year}
                </span>
                <span className="mt-5 block max-w-sm text-base leading-relaxed text-band-muted">
                  {figure.description}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
