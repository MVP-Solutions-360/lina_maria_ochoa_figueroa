import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  titleClassName?: string
  id?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = 'h2',
  className,
  titleClassName,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cx('max-w-3xl', className)}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <Tag
        id={id}
        className={cx(
          Tag === 'h1'
            ? 'text-[2.5rem] sm:text-6xl lg:text-7xl'
            : 'text-[1.9rem] sm:text-4xl lg:text-[2.75rem]',
          titleClassName,
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted on-band:text-band-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
