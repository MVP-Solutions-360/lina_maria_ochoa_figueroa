import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { mainNavigation } from '../content/navigation'
import { site } from '../config/site'
import { routes } from './router'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

const knownPaths = new Set(mainNavigation.map((item) => item.to))

describe('rutas', () => {
  it('no hay controles manuales de tema: el sitio sigue la preferencia del sistema', () => {
    for (const { to } of mainNavigation) {
      const { unmount } = renderAt(to)
      expect(screen.queryByRole('group', { name: /tema/i })).toBeNull()
      expect(screen.queryByRole('button', { name: /tema (claro|oscuro|sistema)/i })).toBeNull()
      unmount()
    }
  })

  it.each(mainNavigation.map((item) => item.to))('%s renderiza un único h1 y título propio', (path) => {
    renderAt(path)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(document.title).toContain(site.name)
  })

  it('cada página define un título y una descripción únicos', () => {
    const seen = new Set<string>()
    for (const { to } of mainNavigation) {
      const { unmount } = renderAt(to)
      const description = document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
      const key = `${document.title}|${description}`
      expect(description.length).toBeGreaterThan(40)
      expect(seen.has(key)).toBe(false)
      expect(new Set([...seen].map((value) => value.split('|')[0])).has(document.title)).toBe(false)
      seen.add(key)
      unmount()
    }
  })

  it('una ruta desconocida muestra la página 404 con salida al inicio', () => {
    renderAt('/no-existe')
    expect(screen.getByRole('heading', { level: 1, name: /no está disponible/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/')
  })

  it('todos los enlaces internos apuntan a rutas existentes', () => {
    const broken: string[] = []
    for (const path of [...knownPaths, '/no-existe']) {
      const { container, unmount } = renderAt(path)
      container.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href') ?? ''
        if (href.startsWith('/') && !knownPaths.has(href)) broken.push(`${path} -> ${href}`)
        if (href.startsWith('#')) {
          expect(container.ownerDocument.querySelector(href)).not.toBeNull()
        }
      })
      unmount()
    }
    expect(broken).toEqual([])
  })

  it('los enlaces externos a BMQ usan la URL oficial y rel seguro', () => {
    const { container } = renderAt('/blindaje-medico-quirurgico')
    const external = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')]
    const bmq = external.filter((anchor) => anchor.hostname.includes('blindajemedicoquirurgico'))
    expect(bmq.length).toBeGreaterThan(0)
    bmq.forEach((anchor) => expect(anchor.href).toBe('https://blindajemedicoquirurgico.com/'))
    external.forEach((anchor) => {
      expect(anchor).toHaveAttribute('rel', expect.stringContaining('noopener'))
    })
  })

  it('todas las imágenes tienen texto alternativo', () => {
    for (const { to } of mainNavigation) {
      const { container, unmount } = renderAt(to)
      container.querySelectorAll('img').forEach((img) => {
        expect(img.getAttribute('alt')?.length ?? 0).toBeGreaterThan(10)
      })
      unmount()
    }
  })

  it('no publica datos privados de la hoja de vida', () => {
    for (const { to } of mainNavigation) {
      const { container, unmount } = renderAt(to)
      const text = container.ownerDocument.documentElement.innerHTML
      // Patrones genéricos (sin incluir los datos reales): cédula con o sin puntos,
      // tarjeta profesional y teléfonos con formato "3xx xxx xxxx".
      expect(text).not.toMatch(/\b\d{1,2}[.\s]?\d{3}[.\s]?\d{3}[.\s]?\d{3}\b/)
      expect(text).not.toMatch(/tarjeta profesional|c\.\s?c\./i)
      expect(text).not.toMatch(/\b3\d{2}[\s.-]\d{3}[\s.-]?\d{4}\b/)
      expect(text).not.toMatch(/CIRUPLAN|Especialistas del Poblado/i)
      unmount()
    }
  })

  it('los botones de WhatsApp apuntan a wa.me con el número configurado y sin documentos sensibles', () => {
    renderAt('/')
    const links = screen.getAllByRole('link', { name: /whatsapp/i })
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => {
      const url = new URL(link.getAttribute('href') ?? '')
      expect(url.origin + url.pathname).toBe('https://wa.me/573164821047')
      expect(url.searchParams.get('text')).toMatch(/no enviar documentos ni historias cl/i)
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    })
    expect(screen.queryByRole('button', { name: /whatsapp/i })).toBeNull()
  })

  it('el header muestra el nombre completo de la marca personal', () => {
    renderAt('/derecho-medico')
    const home = screen.getByRole('link', { name: /Lina María Ochoa Figueroa, ir al inicio/ })
    expect(home).toHaveTextContent('Lina María Ochoa Figueroa')
    expect(document.title).not.toMatch(/Ochoa Abogados/)
    expect(document.querySelector('meta[property="og:site_name"]')).toHaveAttribute('content', 'Lina María Ochoa Figueroa')
  })

  it('no hay enlaces ni menciones a Ochoa Abogados en ninguna página', () => {
    for (const { to } of mainNavigation) {
      const { container, unmount } = renderAt(to)
      expect(container.querySelector('a[href*="ochoaabogados"]')).toBeNull()
      expect(container.textContent).not.toMatch(/Ochoa Abogados/)
      unmount()
    }
  })

  it('el ejercicio profesional se presenta desde 2010 y no desde el grado (2009)', () => {
    renderAt('/')
    const label = screen.getByText('Ejercicio profesional desde')
    expect(label.nextElementSibling).toHaveTextContent('2010')
    const years = new Date().getFullYear() - 2010
    expect(screen.getByText('Trayectoria jurídica').nextElementSibling).toHaveTextContent(String(years))
    expect(screen.queryByText('Abogada desde')).toBeNull()
  })

  it('el correo de contacto se publica como mailto', () => {
    renderAt('/')
    expect(document.querySelector('a[href="mailto:linaochoaf@gmail.com"]')).not.toBeNull()
  })
})

describe('navegación móvil', () => {
  it('se abre, navega y se cierra con Escape', async () => {
    const user = userEvent.setup()
    renderAt('/')

    const toggle = screen.getByRole('button', { name: 'Abrir menú' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: /móvil/i })).toBeNull()

    await user.click(toggle)
    const nav = screen.getByRole('navigation', { name: /móvil/i })
    expect(screen.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true')
    const pageLinks = within(nav)
      .getAllByRole('link')
      .filter((link) => !link.getAttribute('href')?.startsWith('http'))
    expect(pageLinks).toHaveLength(mainNavigation.length)

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('navigation', { name: /móvil/i })).toBeNull()
    expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveFocus()
  })

  it('se cierra al elegir una página', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: 'Abrir menú' }))
    await user.click(within(screen.getByRole('navigation', { name: /móvil/i })).getByRole('link', { name: 'Derecho médico' }))
    expect(screen.queryByRole('navigation', { name: /móvil/i })).toBeNull()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/criterio jurídico/i)
  })
})
