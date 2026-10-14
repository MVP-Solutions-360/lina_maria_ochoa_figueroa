import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routes } from '../../app/router'
import { mainNavigation } from '../../content/navigation'
import { instagramVideos } from '../../content/videos'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

/** Códigos de publicaciones (/p/<código>/) enlazadas en la página, sin repetidos. */
function postCodes(container: HTMLElement) {
  const codes = [...container.querySelectorAll<HTMLAnchorElement>('a[href*="instagram.com/p/"]')].map(
    (a) => /\/p\/([^/]+)\//.exec(a.getAttribute('href') ?? '')?.[1] ?? '',
  )
  return [...new Set(codes)]
}

describe('videos en las páginas', () => {
  it('la portada presenta sólo el video de BMQ, sin reproductor cargado', () => {
    const { container } = renderAt('/')
    expect(postCodes(container)).toEqual(['C7MxVU8Rk3D'])
    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getAllByRole('button', { name: /Reproducir video/ })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 2, name: /protección legal en el sector salud/i })).toBeInTheDocument()
  })

  it('la portada resume las tres etapas del texto proporcionado junto al video', () => {
    renderAt('/')
    const section = screen.getByRole('heading', { level: 2, name: /protección legal en el sector salud/i }).closest('section')!
    const stages = [...section.querySelectorAll('ol > li h3')].map((h) => h.textContent)
    expect(stages).toEqual(['Etapa prequirúrgica', 'Etapa quirúrgica', 'Etapa postquirúrgica'])
    expect(section.textContent).toMatch(/Blindar la práctica médica en todas sus etapas/)
  })

  it('la portada coloca el video después de la sección de BMQ y antes del contacto', () => {
    const { container } = renderAt('/')
    const sections = [...container.querySelectorAll('main > section')].map((s) => s.getAttribute('aria-labelledby'))
    const bmq = sections.indexOf('bmq-title')
    const video = sections.indexOf('bmq-video-title')
    const contact = sections.indexOf('contact-title')
    expect(bmq).toBeGreaterThan(-1)
    expect(video).toBe(bmq + 1)
    expect(contact).toBe(video + 1)
  })

  it('derecho médico muestra sus dos videos y ninguno de BMQ', () => {
    const { container } = renderAt('/derecho-medico')
    expect(postCodes(container).sort()).toEqual(['DGeZOTlOGMZ', 'DYQVlO2RNcj'])
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('derecho médico resume las ideas principales de cada video junto al encabezado, sin llamados comerciales', () => {
    renderAt('/derecho-medico')
    const section = screen.getByRole('heading', { level: 2, name: /Dos temas del derecho médico/ }).closest('section')!
    const blocks = [...section.querySelectorAll('h3')].filter((h) => !h.closest('article')).map((h) => h.textContent)
    expect(blocks).toEqual([
      'Por qué es fundamental el derecho médico',
      'Una demanda médica no siempre se pierde en el quirófano',
    ])
    expect(section.textContent).toMatch(/responsabilidad civil y penal de los profesionales de la salud/i)
    expect(section.textContent).toMatch(/explicarle a un juez cada decisión/i)
    // Sólo ideas del contenido: nada de "contáctanos", "blinda tu carrera" ni promesas.
    expect(section.textContent).not.toMatch(/contáctanos|blinda tu carrera|garantiz|tranquilidad/i)
  })

  it('derecho médico: título y texto arriba, y debajo dos columnas con cada video y sus ideas', () => {
    renderAt('/derecho-medico')
    const heading = screen.getByRole('heading', { level: 2, name: /Dos temas del derecho médico/ })
    const section = heading.closest('section')!
    const columns = [...section.querySelectorAll('article')].map((card) => card.parentElement!)
    expect(columns).toHaveLength(2)
    columns.forEach((column) => {
      // Cada columna: la tarjeta del video y, debajo, su bloque de ideas.
      expect(column.querySelector('article')).not.toBeNull()
      expect(column.querySelector(':scope > div h3')).not.toBeNull()
      // Las dos columnas quedan después del encabezado y de su descripción.
      expect(heading.compareDocumentPosition(column) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
    expect(columns[0]!.parentElement).toBe(columns[1]!.parentElement)
    const description = screen.getByText(/Publicaciones de Blindaje Médico Quirúrgico en Instagram/)
    expect(description.compareDocumentPosition(columns[0]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(description.className).not.toMatch(/max-w-2xl/)
  })

  it('la página de BMQ acompaña su video con las ideas principales del texto, junto al encabezado', () => {
    renderAt('/blindaje-medico-quirurgico')
    const section = screen.getByRole('heading', { level: 2, name: /Protección de la práctica médica/ }).closest('section')!
    const block = [...section.querySelectorAll('h3')].find((h) => !h.closest('article'))!
    expect(block).toHaveTextContent('Anticiparse a los riesgos')
    const text = section.textContent ?? ''
    expect(text).toMatch(/diagnóstico legal preciso requiere estrategia, análisis y experiencia jurídica/i)
    expect(text).toMatch(/antes de que un conflicto llegue a los tribunales/i)
    // Nada de promesas ni llamados comerciales del texto original.
    expect(text).not.toMatch(/tranquilidad|prestigio|patrimonio|nada se deja al azar|garantiz/i)
  })

  it('las ideas de los videos sólo existen en los videos publicados y tienen título', () => {
    for (const video of instagramVideos) {
      if (video.ideas) {
        expect(video.featured, video.shortcode).toBe(true)
        expect(video.ideasTitle, video.shortcode).toBeTruthy()
      }
    }
  })

  it('la página de BMQ muestra su video de protección profesional', () => {
    const { container } = renderAt('/blindaje-medico-quirurgico')
    expect(postCodes(container)).toEqual(['DWHS-dihCNn'])
    expect(container.querySelector('iframe')).toBeNull()
  })

  it.each(['/perfil-profesional', '/consultoria-en-salud', '/xyz'])('%s no incluye videos', (path) => {
    const { container } = renderAt(path)
    expect(postCodes(container)).toEqual([])
    expect(screen.queryByRole('button', { name: /Reproducir video/ })).toBeNull()
  })

  it('todos los enlaces externos de video usan target _blank y rel seguro', () => {
    for (const { to } of mainNavigation) {
      const { container, unmount } = renderAt(to)
      container.querySelectorAll<HTMLAnchorElement>('a[href*="instagram.com/p/"]').forEach((a) => {
        expect(a).toHaveAttribute('target', '_blank')
        expect(a).toHaveAttribute('rel', 'noopener noreferrer')
      })
      unmount()
    }
  })

  it('no hay secciones vacías ni marcadores de contenido pendiente', () => {
    for (const { to } of mainNavigation) {
      const { container, unmount } = renderAt(to)
      expect(container.textContent).not.toMatch(/próximamente|pendiente de (video|contenido)|lorem/i)
      unmount()
    }
  })
})
