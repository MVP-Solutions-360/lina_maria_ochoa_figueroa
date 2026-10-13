/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8')

function tokens(selector: string): Record<string, string> {
  const start = css.indexOf(selector)
  const block = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start))
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1]!, m[2]!]))
}

function luminance(hex: string) {
  const channel = (i: number) => {
    const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2)
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

// Pares texto/fondo que deben cumplir WCAG AA (4.5:1) para texto normal.
const pairs: Array<[string, string]> = [
  ['text', 'bg'],
  ['text', 'surface'],
  ['text-muted', 'bg'],
  ['text-muted', 'surface'],
  ['text-muted', 'surface-muted'],
  ['accent', 'bg'],
  ['accent', 'surface'],
  ['accent', 'surface-muted'],
  ['accent-strong', 'bg'],
  ['link', 'bg'],
  ['link', 'surface-muted'],
  ['btn-primary-text', 'btn-primary-bg'],
  ['btn-secondary-hover-text', 'btn-secondary-hover-bg'],
  ['band-text', 'band-bg'],
  ['band-muted', 'band-bg'],
  ['band-accent', 'band-bg'],
  ['band-link', 'band-bg'],
  ['band-btn-text', 'band-btn-bg'],
]

describe('selección automática del tema', () => {
  it('el modo oscuro depende sólo de prefers-color-scheme (sin selector manual)', () => {
    expect(css).toContain('@media (prefers-color-scheme: dark)')
    expect(css).not.toContain('data-theme')
  })
})

describe.each([
  ['claro', ':root {'],
  ['oscuro', '@media (prefers-color-scheme: dark)'],
])('contraste del tema %s', (_name, selector) => {
  const t = tokens(selector)

  it.each(pairs)('%s sobre %s ≥ 4.5:1', (fg, bg) => {
    expect(t[fg], `falta --${fg}`).toBeDefined()
    expect(t[bg], `falta --${bg}`).toBeDefined()
    expect(contrast(t[fg]!, t[bg]!)).toBeGreaterThanOrEqual(4.5)
  })

  it('el botón BMQ con texto blanco ≥ 4.5:1', () => {
    expect(contrast('#ffffff', t['btn-bmq-bg']!)).toBeGreaterThanOrEqual(4.5)
  })
})
