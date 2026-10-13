import type { ServiceBlock } from '../../content/services'

interface ServiceListProps {
  blocks: ServiceBlock[]
  labelledBy: string
}

/** Lista editorial de servicios: título a la izquierda, detalle a la derecha, separados por línea fina. */
export function ServiceList({ blocks, labelledBy }: ServiceListProps) {
  return (
    <ol aria-labelledby={labelledBy} className="border-b border-line-strong">
      {blocks.map((block, index) => (
        <li
          key={block.title}
          className="grid gap-6 border-t border-line-strong py-12 lg:grid-cols-12 lg:gap-12 lg:py-16"
        >
          <div className="lg:col-span-5">
            <p className="font-serif text-sm text-accent" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-4 text-2xl sm:text-[1.75rem]">{block.title}</h3>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-muted">{block.description}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {block.items.map((item) => (
                <li key={item} className="flex gap-4 text-[0.9375rem] leading-relaxed">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}
