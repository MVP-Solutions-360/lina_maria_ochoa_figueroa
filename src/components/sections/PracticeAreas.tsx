import { practiceAreas } from '../../content/services'
import { PracticeCard } from '../ui/PracticeCard'
import { SectionHeading } from '../ui/SectionHeading'

export function PracticeAreas() {
  return (
    <section aria-labelledby="practice-title" className="section-y">
      <div className="container-editorial">
        <SectionHeading
          id="practice-title"
          eyebrow="Especialización y enfoque"
          title="Áreas de práctica jurídica y consultoría en salud."
        />
        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-14">
          {practiceAreas.map((area, index) => (
            <PracticeCard key={area.title} index={index + 1} {...area} />
          ))}
        </div>
      </div>
    </section>
  )
}
