import type { CSSProperties } from 'react'
import { cx } from '../../lib/cx'

/** Entrada escalonada de los textos de una escena del hero. */
export const riseClass = (active: boolean) =>
  cx(
    'transition-[opacity,transform] duration-[1200ms] ease-out',
    active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
  )

export const riseStyle = (active: boolean, delay: number): CSSProperties => ({
  transitionDelay: active ? `${delay}ms` : '0ms',
})
