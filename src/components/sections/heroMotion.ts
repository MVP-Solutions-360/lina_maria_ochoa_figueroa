import type { CSSProperties } from 'react'
import { cx } from '../../lib/cx'

/**
 * Entrada escalonada de los textos del hero. Las duraciones y los retrasos viven en CSS
 * (`.hero-rise` en styles/global.css): en escritorio la secuencia es pausada; en móvil se acorta
 * para que el texto principal sea visible casi de inmediato; con prefers-reduced-motion no hay
 * retraso ni transición.
 */
export const riseClass = (active: boolean) =>
  cx('hero-rise', active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')

/** Retraso (ms) de escritorio; el CSS lo reduce en pantallas pequeñas. Al salir la escena no hay retraso. */
export const riseStyle = (active: boolean, delay: number): CSSProperties =>
  ({ '--rise-delay': `${active ? delay : 0}ms` }) as CSSProperties
