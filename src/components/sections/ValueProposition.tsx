import { pillars } from '../../content/services'
import { SectionHeading } from '../ui/SectionHeading'

export function ValueProposition() {
  return (
    <section aria-labelledby="value-title" className="section-y border-y border-line bg-surface">
      <div className="container-editorial">
        <SectionHeading
          id="value-title"
          eyebrow="Enfoque diferencial & visión"
          title="Una visión jurídica que comprende la realidad del sector salud."
          description="Los desafíos del sector salud requieren más que conocimiento normativo. Exigen comprender la práctica médica, la operación institucional y las decisiones que pueden tener consecuencias jurídicas, administrativas y humanas."
        />

        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0">
          {pillars.map((pillar, index) => (
            <li
              key={pillar.title}
              className="md:border-l md:border-line md:px-8 md:first:border-l-0 md:first:pl-0 md:last:pr-0 lg:px-12"
            >
              <p className="font-serif text-sm text-accent" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-5 text-2xl">{pillar.title}</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{pillar.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
