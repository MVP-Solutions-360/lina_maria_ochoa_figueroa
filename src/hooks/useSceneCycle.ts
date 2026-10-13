import { useCallback, useEffect, useState } from 'react'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
}

/**
 * Ciclo de escenas del hero. Avanza solo, pero el usuario puede pausarlo o elegir escena.
 * Con `prefers-reduced-motion` no inicia en automático.
 */
export function useSceneCycle(durations: number[]) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const count = durations.length
  const duration = durations[index] ?? 7000

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), duration)
    return () => window.clearTimeout(timer)
  }, [playing, index, count, duration])

  const select = useCallback((next: number) => setIndex(next), [])
  const toggle = useCallback(() => setPlaying((value) => !value), [])

  return { index, select, playing, toggle, duration }
}
