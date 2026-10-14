import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routes } from '../app/router'
import { site } from '../config/site'
import { indexablePages } from '../content/pages'
import { credentialInstitutions } from '../content/professional'

const visibleAt = (path: string) => {
  const { container, unmount } = render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
  const text = container.textContent ?? ''
  const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
  unmount()
  return { text, hrefs }
}

describe('coherencia entre metadatos/JSON-LD y contenido visible', () => {
  it('lo que declara el JSON-LD de Person puede leerse en el sitio', () => {
    const home = visibleAt('/')
    const profile = visibleAt('/perfil-profesional')
    expect(home.text).toContain(site.name)
    expect(home.text).toMatch(/Abogada especialista en Derecho Médico/i)
    expect(home.text).toMatch(/CEO de\s*Blindaje Médico Quirúrgico/)
    expect(home.hrefs).toContain(site.bmqUrl)
    expect(profile.hrefs).toContain(site.bmqUrl)
    expect(profile.text).toMatch(/historia clínica/i)
    for (const i of credentialInstitutions) expect(profile.text).toContain(i.name)
  })

  it('cada página trata el tema que anuncia su descripción', () => {
    for (const page of indexablePages) {
      expect(visibleAt(page.path).text.toLowerCase()).toMatch(/derecho médico|consultoría|blindaje médico/)
    }
  })
})
