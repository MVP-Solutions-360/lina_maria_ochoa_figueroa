import { cx } from '../../lib/cx'

export interface TimelineItem {
  label: string
  title: string
  description?: string
  /** Distingue formación (punto vacío) de cualquier tipo de experiencia (punto lleno) */
  kind?: string
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cx('relative border-l border-line-strong on-band:border-band-line', className)}>
      {items.map((item) => (
        <li key={`${item.label}-${item.title}`} className="relative pb-10 pl-8 last:pb-0 sm:pl-10">
          <span
            aria-hidden="true"
            className={cx(
              'absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg on-band:border-band-accent on-band:bg-band',
              item.kind && item.kind !== 'formación' && 'bg-accent on-band:bg-band-accent',
            )}
          />
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="font-serif text-xl text-accent on-band:text-band-accent">{item.label}</p>
            {item.kind && (
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted on-band:text-band-muted">
                {item.kind}
              </p>
            )}
          </div>
          <h3 className="mt-1 font-sans text-lg font-medium leading-snug">{item.title}</h3>
          {item.description && (
            <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-muted on-band:text-band-muted">
              {item.description}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}
