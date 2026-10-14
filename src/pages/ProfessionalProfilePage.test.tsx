import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routes } from '../app/router'
import { photos } from '../config/images'
import { careerTimeline, education } from '../content/professional'

function renderProfile() {
  const router = createMemoryRouter(routes, { initialEntries: ['/perfil-profesional'] })
  return render(<RouterProvider router={router} />)
}

function section(name: RegExp) {
  return within(screen.getByRole('heading', { name }).closest('section')!)
}

describe('/perfil-profesional', () => {
  it('el hero presenta a Lina con su especialidad y una fotografía real con texto alternativo', () => {
    const { container } = renderProfile()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lina María Ochoa Figueroa')
    expect(screen.getByText(/Abogada especializada en derecho médico/)).toBeInTheDocument()
    const hero = container.querySelector('img[src="/images/imagen_8.webp"]')
    expect(hero?.getAttribute('alt')).toMatch(/vestido rojo/)
    expect(hero).toHaveAttribute('fetchpriority', 'high')
  })

  it('muestra dos hitos con año de referencia (2010 y 2017) y sin duraciones calculadas', () => {
    renderProfile()
    const figures = section(/Dos fechas que marcan mi recorrido/)
    expect(figures.getByText('Ejercicio profesional desde').nextElementSibling).toHaveTextContent('2010')
    expect(figures.getByText('Experiencia directiva desde').nextElementSibling).toHaveTextContent('2017')
    expect(figures.queryByText(/\b\d+\s*años\b/)).toBeNull()
  })

  it('no incluye la galería fotográfica; las imágenes restantes son locales y tienen texto alternativo', () => {
    const { container } = renderProfile()
    expect(screen.queryByRole('heading', { name: /en imágenes/ })).toBeNull()
    expect(screen.queryByText('Galería')).toBeNull()
    const imgs = [...container.querySelectorAll('img')]
    expect(imgs.length).toBeGreaterThan(0)
    imgs.forEach((img) => {
      expect(img.getAttribute('src')).toMatch(/^\/images\//)
      expect(img.getAttribute('alt')?.length ?? 0).toBeGreaterThan(20)
    })
  })

  it('los cuatro bloques narrativos y el enlace discreto a la web oficial de BMQ', () => {
    renderProfile()
    const blocks = section(/Del ejercicio jurídico a la dirección/)
    const titles = blocks.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titles).toEqual([
      'Ejercicio del derecho y experiencia jurídica',
      'Derecho médico y responsabilidad profesional',
      'Gestión y liderazgo en instituciones de salud',
      'Dirección de Blindaje Médico Quirúrgico',
    ])
    const bmq = blocks.getByRole('link', { name: /Conocer la propuesta de BMQ/ })
    expect(bmq).toHaveAttribute('href', 'https://blindajemedicoquirurgico.com/')
    expect(bmq).toHaveAttribute('target', '_blank')
    expect(bmq).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('la formación académica incluye todos los títulos agrupados por nivel y sólo con años documentados', () => {
    renderProfile()
    const edu = section(/Formación jurídica y en gerencia de la salud/)
    expect(edu.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Maestrías',
      'Especializaciones',
      'Pregrado',
    ])
    for (const degree of education) {
      const row = edu.getByText(degree.program).closest('li')!
      expect(row).toHaveTextContent(degree.institution)
      if (degree.year) expect(row).toHaveTextContent(String(degree.year))
      else expect(row.textContent).not.toMatch(/\b(19|20)\d{2}\b/)
    }
    const masters = within(edu.getByRole('heading', { name: 'Maestrías' }).parentElement!)
    expect(masters.getByText('Maestría en Derecho Procesal Constitucional')).toBeInTheDocument()
  })

  it('la cronología distingue formación, ejercicio, experiencia jurídica, directiva y BMQ', () => {
    renderProfile()
    const timeline = section(/Formación, ejercicio y dirección, en orden/)
    expect(timeline.getAllByRole('listitem')).toHaveLength(careerTimeline.length)
    for (const kind of ['formación', 'inicio del ejercicio', 'experiencia jurídica', 'experiencia directiva', 'dirección de BMQ']) {
      expect(timeline.getAllByText(kind).length).toBeGreaterThan(0)
    }
    // El cargo en BMQ no lleva una fecha de inicio inventada.
    const bmq = timeline.getByText('CEO de Blindaje Médico Quirúrgico').closest('li')!
    expect(bmq.textContent).not.toMatch(/\b(19|20)\d{2}\b/)
    // 2009 sólo aparece como graduación, no como inicio del ejercicio.
    expect(timeline.getByText('2009').closest('li')).toHaveTextContent('Graduación en Derecho')
    expect(timeline.getByText('2010').closest('li')).toHaveTextContent('Inicio del ejercicio profesional')
  })

  it('el cierre enlaza a las áreas de trabajo y conserva WhatsApp y correo', () => {
    const { container } = renderProfile()
    const areas = section(/Conoce mis áreas de trabajo/)
    expect(areas.getByRole('link', { name: 'Derecho médico' })).toHaveAttribute('href', '/derecho-medico')
    expect(areas.getByRole('link', { name: 'Consultoría en salud' })).toHaveAttribute('href', '/consultoria-en-salud')
    const wa = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/573164821047"]')]
    expect(wa.length).toBeGreaterThan(0)
    expect(container.querySelector('a[href="mailto:linaochoaf@gmail.com"]')).not.toBeNull()
  })

  it('consultoría usa su propia entrada de foto (imagen_3) y el home sigue usando la suya', () => {
    const consulting = render(
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/consultoria-en-salud'] })} />,
    )
    const img = consulting.container.querySelector(`img[src="${photos.consulting.src}"]`)
    expect(photos.consulting.src).toBe('/images/imagen_3.webp')
    expect(img).toHaveAttribute('alt', photos.consulting.alt)
    consulting.unmount()

    const home = render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />)
    expect(home.container.querySelector(`img[src="${photos.hallway.src}"]`)).not.toBeNull()
  })

  it('no incluye premios, publicaciones ni datos privados', () => {
    const { container } = renderProfile()
    expect(container.textContent).not.toMatch(/premio|galardón|publicaci[oó]n cient|membres[ií]a|congreso/i)
    expect(container.textContent).not.toMatch(/tarjeta profesional|c\.\s?c\./i)
  })
})
