/// <reference types="node" />
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { logos, photos } from './images'

const publicDir = join(process.cwd(), 'public')

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  )
}

describe('imágenes publicadas', () => {
  it('todas las fotos y sus variantes srcset existen en public/ y son WebP', () => {
    for (const [name, photo] of Object.entries(photos)) {
      const urls = [photo.src, ...(('srcSet' in photo && photo.srcSet ? photo.srcSet.split(',') : []).map((s) => s.trim().split(' ')[0]!))]
      for (const url of urls) {
        expect(existsSync(join(publicDir, url)), `${name}: ${url}`).toBe(true)
        expect(url, `${name}: ${url}`).toMatch(/\.webp$/)
      }
      expect(photo.width).toBeGreaterThan(0)
      expect(photo.height).toBeGreaterThan(0)
      expect(photo.alt.length, name).toBeGreaterThan(20)
    }
    expect(existsSync(join(publicDir, logos.footer.src))).toBe(true)
  })

  it('cada foto fotográfica tiene su variante pequeña para móvil, más liviana que la completa', () => {
    for (const photo of Object.values(photos)) {
      if (!('srcSet' in photo) || !photo.srcSet) continue
      const [small, full] = photo.srcSet.split(',').map((s) => join(publicDir, s.trim().split(' ')[0]!))
      expect(statSync(small!).size).toBeLessThan(statSync(full!).size)
    }
  })

  it('public/ no contiene originales pesados ni PNG/JPEG fotográficos, y pesa menos de 1,5 MB', () => {
    const files = walk(publicDir)
    const total = files.reduce((sum, f) => sum + statSync(f).size, 0)
    expect(total).toBeLessThan(1.5 * 1024 * 1024)
    for (const file of files) {
      const kb = statSync(file).size / 1024
      expect(kb, file).toBeLessThan(200)
    }
    const heavyFormats = files.filter((f) => /\.(png|jpe?g)$/i.test(f) && !/(favicon|og-image)/.test(f))
    expect(heavyFormats, 'los PNG/JPEG originales deben vivir en /originales').toEqual([])
  })

  it('el texto alternativo de cada foto coincide con la imagen que realmente muestra', () => {
    // imagen_1 es el pasillo moderno (no una "blusa negra"); hallway y dark comparten archivo y descripción.
    expect(photos.dark.src).toBe(photos.hallway.src)
    expect(photos.dark.alt).toMatch(/pasillo/i)
    expect(photos.dark.alt).not.toMatch(/blusa negra/i)
  })
})
