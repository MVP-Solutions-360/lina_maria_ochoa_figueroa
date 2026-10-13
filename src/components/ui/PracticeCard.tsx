import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface PracticeCardProps {
  index: number
  title: string
  description: string
  to: string
}

export function PracticeCard({ index, title, description, to }: PracticeCardProps) {
  return (
    <article className="group flex h-full flex-col border-t border-line-strong pt-8">
      <span className="font-serif text-sm text-accent" aria-hidden="true">
        {String(index).padStart(2, '0')}
      </span>
      <h3 className="mt-6 text-2xl leading-snug">{title}</h3>
      <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-muted">{description}</p>
      <Link
        to={to}
        className="mt-8 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium text-accent transition-colors hover:text-accent-strong"
      >
        <span>
          Conocer más<span className="sr-only"> sobre {title}</span>
        </span>
        <ArrowRight
          aria-hidden="true"
          size={18}
          strokeWidth={1.5}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </article>
  )
}
