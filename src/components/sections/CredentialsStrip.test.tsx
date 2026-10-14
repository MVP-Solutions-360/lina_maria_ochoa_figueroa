/// <reference types="node" />
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routes } from '../../app/router'
import { credentialInstitutions, education } from '../../content/professional'

function renderHome() {
  return render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />)
}

describe('franja de credenciales de la portada', () => {
  it('va justo después del hero y muestra las cuatro instituciones de formación', () => {
    const { container } = renderHome()
    const sections = [...container.querySelectorAll('main > section')]
    const hero = sections.findIndex((s) => s.getAttribute('aria-roledescription') === 'carrusel')
    const strip = sections.findIndex((s) => s.getAttribute('aria-labelledby') === 'credenciales-title')
    expect(hero).toBe(0)
    expect(strip).toBe(hero + 1)

    const list = within(screen.getByRole('heading', { name: 'Formación académica en' }).closest('section')!)
    expect(list.getAllByRole('listitem').map((li) => li.querySelector('p')?.textContent)).toEqual(
      credentialInstitutions.map((i) => i.name),
    )
  })

  it('cada institución y su resumen coinciden con la formación documentada', () => {
    // En la formación el país puede ir dentro del nombre ("..., Argentina"); la franja lo muestra aparte.
    const counts = (name: string) => education.filter((d) => d.institution.startsWith(name))
    for (const institution of credentialInstitutions) {
      expect(counts(institution.name).length, institution.name).toBeGreaterThan(0)
    }
    expect(counts('Universidad Autónoma Latinoamericana')).toHaveLength(3) // Derecho + 2 especializaciones
    expect(counts('Universidad Pontificia Bolivariana')).toHaveLength(2)
    expect(counts('Universidad CES')).toHaveLength(3)
    expect(counts('Universidad Nacional de Lomas de Zamora')).toHaveLength(1)
    const detail = (name: string) => credentialInstitutions.find((i) => i.name === name)?.detail
    expect(detail('Universidad Autónoma Latinoamericana')).toBe('Derecho y dos especializaciones')
    expect(detail('Universidad Pontificia Bolivariana')).toBe('Derecho Médico y Maestría en Derecho')
    expect(detail('Universidad CES')).toBe('Tres especializaciones')
    expect(detail('Universidad Nacional de Lomas de Zamora')).toBe('Maestría en Derecho Procesal Constitucional')
  })

  it('el hero no muestra logos ni el CEO de BMQ; los 4 logos van discretos en el footer, con alt, tamaño reservado y archivos locales', () => {
    const { container } = renderHome()
    const hero = container.querySelector('section[aria-roledescription="carrusel"]')!
    expect(hero.querySelectorAll('img[src^="/images/universidades/"]')).toHaveLength(0)
    expect(hero.textContent).not.toMatch(/CEO de/)
    const footer = container.querySelector('footer')!
    const logos = [...footer.querySelectorAll<HTMLImageElement>('img[src^="/images/universidades/"]')]
    expect(logos.map((img) => img.getAttribute('src'))).toEqual([
      '/images/universidades/UNAULA-160.webp',
      '/images/universidades/CES-160.webp',
      '/images/universidades/UPB-160.webp',
      '/images/universidades/UNLZ-160.webp',
    ])
    logos.forEach((img) => {
      expect(img.getAttribute('alt')).toMatch(/^Logotipo de la Universidad/)
      expect(img).toHaveAttribute('width')
      expect(img).toHaveAttribute('height')
    })
    // Cada logo corresponde a una institución de la formación documentada.
    credentialInstitutions.forEach((institution) => {
      expect(logos.some((img) => img.getAttribute('alt')?.includes(institution.name)), institution.name).toBe(true)
    })
  })

  it('la escena 1 del hero tiene el botón "Ver perfil profesional" hacia /perfil-profesional', () => {
    const { container } = renderHome()
    const scene = container.querySelector('[aria-label^="1 de 2"]')!
    const link = within(scene as HTMLElement).getByRole('link', { name: 'Ver perfil profesional' })
    expect(link).toHaveAttribute('href', '/perfil-profesional')
    expect(link).not.toHaveAttribute('target')
  })

  it('los archivos de los logos (monocromo y color) existen en public/ y están optimizados (≤ 30 KB, ≤ 160 px, WebP)', () => {
    for (const institution of credentialInstitutions) {
      for (const emblem of [institution.emblem!, institution.emblemColor!]) {
        const file = join(process.cwd(), 'public', emblem.src)
        expect(existsSync(file), emblem.src).toBe(true)
        expect(emblem.src).toMatch(/\.webp$/)
        expect(statSync(file).size, emblem.src).toBeLessThan(30 * 1024)
        expect(Math.max(emblem.width, emblem.height), emblem.src).toBeLessThanOrEqual(160)
      }
    }
  })

  it('no inventa premios ni certificaciones y no usa imágenes externas', () => {
    const { container } = renderHome()
    const strip = container.querySelector('[aria-labelledby="credenciales-title"]')!
    expect(strip.textContent).not.toMatch(/premio|galardón|certificad|acreditad|ranking/i)
    strip.querySelectorAll('img').forEach((img) => expect(img.getAttribute('src')).toMatch(/^\/images\//))
  })
})
