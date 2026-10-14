import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const classes = 'font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent-strong'

type TextLinkProps = { children: ReactNode; className?: string } & ({ to: string; href?: never } | { href: string; to?: never })

/** Enlace dentro de un párrafo: el texto describe el destino. Los externos se abren en pestaña nueva. */
export function TextLink({ children, to, href, className }: TextLinkProps) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={[classes, className].filter(Boolean).join(' ')}>
        {children}
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    )
  }
  return (
    <Link to={to ?? '/'} className={[classes, className].filter(Boolean).join(' ')}>
      {children}
    </Link>
  )
}
