/// <reference types="node" />
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routes } from '../../app/router'
import { mainNavigation } from '../../content/navigation'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

const lina = {
  heading: 'Lina María Ochoa Figueroa',
  links: {
    Instagram: 'https://www.instagram.com/linaochoaf',
    Facebook: 'https://www.facebook.com/lina.ochoa.900',
    WhatsApp: 'https://wa.me/573164821047',
  },
}

const bmq = {
  heading: 'Blindaje Médico Quirúrgico',
  links: {
    Instagram: 'https://www.instagram.com/blindajemedicoquirurgico',
    Facebook: 'https://www.facebook.com/Blindajemedicoquirurgico',
    WhatsApp: 'https://wa.me/573016546268',
  },
}

function footer() {
  return within(screen.getByRole('contentinfo'))
}

describe('footer: redes sociales', () => {
  it.each([lina, bmq])('el grupo "$heading" tiene exactamente sus enlaces, con URL, target y rel correctos', (group) => {
    renderAt('/')
    const nav = footer().getByRole('navigation', { name: new RegExp(`Redes · ${group.heading}`) })
    const links = within(nav).getAllByRole('link')
    expect(links).toHaveLength(Object.keys(group.links).length)

    for (const [network, href] of Object.entries(group.links)) {
      const link = within(nav).getByRole('link', { name: new RegExp(`^${network} de ${group.heading}`) })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('los perfiles personales y los corporativos no se mezclan', () => {
    renderAt('/')
    const personal = within(footer().getByRole('navigation', { name: /Redes · Lina/ }))
    const corporate = within(footer().getByRole('navigation', { name: /Redes · Blindaje/ }))
    expect(personal.queryByRole('link', { name: /Blindaje/ })).toBeNull()
    expect(corporate.queryByRole('link', { name: /Lina/ })).toBeNull()
    // Cada marca tiene su propio WhatsApp: el de Lina y el de BMQ no se intercambian.
    expect(personal.getByRole('link', { name: /^WhatsApp de/ })).toHaveAttribute('href', 'https://wa.me/573164821047')
    expect(corporate.getByRole('link', { name: /^WhatsApp de/ })).toHaveAttribute('href', 'https://wa.me/573016546268')
  })

  it('los iconos son decorativos y el nombre accesible lo da el texto del enlace', () => {
    renderAt('/')
    footer()
      .getAllByRole('link', { name: /^(Instagram|Facebook|WhatsApp) de / })
      .forEach((link) => {
        expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
        expect(link).toHaveAccessibleName(/\(se abre en una pestaña nueva\)/)
      })
  })

  it('el enlace a la web de BMQ, el correo y la ubicación siguen en el footer', () => {
    renderAt('/')
    const bmqSite = footer()
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === 'https://blindajemedicoquirurgico.com/')
    expect(bmqSite).toBeDefined()
    expect(bmqSite).toHaveAccessibleName(/^Blindaje Médico Quirúrgico\s*\(sitio oficial/)
    expect(bmqSite).toHaveAttribute('target', '_blank')
    expect(bmqSite).toHaveAttribute('rel', 'noopener noreferrer')
    expect(footer().getByRole('link', { name: 'linaochoaf@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:linaochoaf@gmail.com',
    )
    expect(footer().getByText('Medellín, Colombia')).toBeInTheDocument()
  })

  it('el footer muestra el logo (en vez del nombre en texto), con alt, tamaño reservado y enlace al inicio', () => {
    renderAt('/derecho-medico')
    const link = footer().getByRole('link', { name: /Logotipo de Lina María Ochoa Figueroa/ })
    expect(link).toHaveAttribute('href', '/')
    const img = link.querySelector('img')!
    expect(img).toHaveAttribute('src', '/images/logo_-footer.webp')
    expect(img).toHaveAttribute('width', '420')
    expect(img).toHaveAttribute('height', '293')
    expect(img).toHaveAttribute('loading', 'lazy')
    // El nombre completo ya no se repite como título de texto en el footer (sigue en el © y en el header).
    expect(footer().queryByText('Lina María Ochoa Figueroa', { selector: 'p.font-serif' })).toBeNull()
    expect(footer().getByText(/© \d{4} Lina María Ochoa Figueroa/)).toBeInTheDocument()
  })

  it('el archivo del logo del footer existe y está optimizado (≤ 150 KB)', () => {
    const file = join(process.cwd(), 'public/images/logo_-footer.webp')
    expect(existsSync(file)).toBe(true)
    expect(statSync(file).size).toBeLessThan(150 * 1024)
    expect(existsSync(join(process.cwd(), 'public/images/logo_.png'))).toBe(false) // el original pesado no se publica
  })

  it('no reaparece ninguna referencia a ochoaabogados.com.co', () => {
    renderAt('/')
    expect(document.documentElement.innerHTML).not.toMatch(/ochoaabogados/i)
  })

  it.each(mainNavigation.map((item) => item.to))('el footer completo funciona en %s', (path) => {
    renderAt(path)
    expect(footer().getAllByRole('link', { name: /^(Instagram|Facebook|WhatsApp) de / })).toHaveLength(6)
    expect(footer().getAllByRole('link', { name: /^(Inicio|Perfil profesional|Derecho médico|Consultoría en salud|BMQ)$/ })).toHaveLength(5)
  })
})
