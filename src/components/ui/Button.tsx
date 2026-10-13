import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { cx } from '../../lib/cx'

/** `bmq` es el botón corporativo (azul BMQ), reservado a los enlaces hacia BMQ. */
type Variant = 'primary' | 'secondary' | 'text' | 'bmq'
/** `band` se usa sobre superficies oscuras de contraste. */
type Tone = 'default' | 'band'

interface BaseProps {
  variant?: Variant
  tone?: Tone
  size?: 'md' | 'sm'
  className?: string
  /** Icono decorativo previo al texto */
  icon?: ReactNode
  children: ReactNode
}

type ButtonProps = BaseProps &
  (
    | { to: string; href?: never; disabled?: never; title?: never }
    | { href: string; to?: never; disabled?: never; title?: never }
    | { to?: never; href?: never; disabled: true; title?: string }
  )

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-medium tracking-wide transition-colors duration-200 select-none'

const sizes = {
  md: 'min-h-12 px-7 text-[0.9375rem]',
  sm: 'min-h-11 px-5 text-sm',
}

const variants: Record<Tone, Record<Variant, string>> = {
  default: {
    primary:
      'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)]',
    secondary:
      'border border-[var(--btn-secondary-border)] text-ink hover:bg-[var(--btn-secondary-hover-bg)] hover:text-[var(--btn-secondary-hover-text)]',
    text: 'min-h-11 px-0 text-accent hover:text-accent-strong underline-offset-8 hover:underline',
    bmq: 'bg-[var(--btn-bmq-bg)] text-white hover:bg-[var(--btn-bmq-hover)]',
  },
  band: {
    primary:
      'bg-[var(--band-btn-bg)] text-[var(--band-btn-text)] hover:bg-[var(--band-btn-hover)]',
    secondary:
      'border border-band-ink/60 text-band-ink hover:bg-band-ink hover:text-band',
    text: 'min-h-11 px-0 text-band-accent hover:text-band-ink underline-offset-8 hover:underline',
    bmq: 'bg-[var(--btn-bmq-bg)] text-white hover:bg-[var(--btn-bmq-hover)]',
  },
}

const disabledClass =
  'cursor-not-allowed bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)] border border-line'

export function Button(props: ButtonProps) {
  const { variant = 'primary', tone = 'default', size = 'md', className, icon, children } = props
  const isText = variant === 'text'
  const classes = cx(
    base,
    !isText && sizes[size],
    props.disabled ? disabledClass : variants[tone][variant],
    className,
  )

  if (props.disabled) {
    return (
      <button type="button" disabled title={props.title} className={classes}>
        {icon}
        {children}
      </button>
    )
  }

  if (props.href) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className={classes}>
        {icon}
        {children}
        <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    )
  }

  return (
    <Link to={props.to ?? '/'} className={classes}>
      {icon}
      {children}
      {isText && <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />}
    </Link>
  )
}
