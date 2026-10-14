/// <reference types="node" />
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const html = readFileSync(join(root, 'index.html'), 'utf8')

/** Tamaños incluidos en un .ico (la cabecera ICO guarda 0 para 256 px). */
function icoSizes(file: string) {
  const bytes = readFileSync(file)
  expect(bytes.readUInt16LE(0)).toBe(0) // reservado
  expect(bytes.readUInt16LE(2)).toBe(1) // tipo: ícono
  const count = bytes.readUInt16LE(4)
  return Array.from({ length: count }, (_, i) => {
    const offset = 6 + 16 * i
    return [bytes[offset] || 256, bytes[offset + 1] || 256] as const
  })
}

describe('ícono del sitio', () => {
  it('index.html enlaza archivos que existen en public/', () => {
    const hrefs = [...html.matchAll(/<link[^>]+rel="(?:icon|apple-touch-icon)"[^>]*href="([^"]+)"/g)].map((m) => m[1]!)
    expect(hrefs).toEqual(expect.arrayContaining(['/favicon.ico', '/favicon-192.png']))
    for (const href of hrefs) expect(existsSync(join(root, 'public', href)), href).toBe(true)
    expect(html).not.toMatch(/favicon\.svg/)
  })

  it('favicon.ico es un ícono válido, cuadrado, multitamaño y liviano', () => {
    const file = join(root, 'public/favicon.ico')
    const sizes = icoSizes(file)
    expect(sizes.length).toBeGreaterThanOrEqual(3)
    sizes.forEach(([w, h]) => expect(w).toBe(h)) // sin deformaciones
    expect(sizes.map(([w]) => w)).toEqual(expect.arrayContaining([16, 32, 48]))
    expect(statSync(file).size).toBeLessThan(50 * 1024)
  })

  it('el ícono horizontal original no se publica (vive fuera de public/)', () => {
    expect(existsSync(join(root, 'public/images/logo.ico'))).toBe(false)
  })
})
