import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { InstagramVideo } from '../../content/videos'
import { EMBED_TIMEOUT_MS, InstagramVideoCard } from './InstagramVideoCard'

const video: InstagramVideo = {
  shortcode: 'AbC123xyz_-',
  title: 'Título de prueba',
  description: 'Descripción de prueba.',
  topic: 'bmq-presentacion',
  account: '@cuenta',
  featured: true,
}

const POST = 'https://www.instagram.com/p/AbC123xyz_-/'

afterEach(() => {
  vi.useRealTimers()
})

describe('InstagramVideoCard', () => {
  it('al inicio no carga ningún reproductor externo ni reproduce nada', () => {
    const { container } = render(<InstagramVideoCard video={video} />)
    expect(container.querySelector('iframe')).toBeNull()
    expect(container.querySelector('video, audio')).toBeNull()
  })

  it('el botón de reproducir tiene nombre accesible y es operable con teclado', () => {
    render(<InstagramVideoCard video={video} />)
    const play = screen.getByRole('button', { name: 'Reproducir video: Título de prueba' })
    expect(play.tagName).toBe('BUTTON')
    expect(play).toHaveAttribute('type', 'button')
  })

  it('el enlace a la publicación original es correcto y seguro', () => {
    render(<InstagramVideoCard video={video} />)
    const link = screen.getByRole('link', { name: /Ver publicación original\s*en Instagram: Título de prueba/ })
    expect(link).toHaveAttribute('href', POST)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('al pulsar reproducir monta el reproductor oficial /embed/ de esa publicación', () => {
    const { container } = render(<InstagramVideoCard video={video} />)
    fireEvent.click(screen.getByRole('button', { name: /Reproducir video/ }))
    const iframe = container.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe).toHaveAttribute('src', `${POST}embed/`)
    expect(iframe).toHaveAttribute('title', 'Reproductor de Instagram: Título de prueba')
    expect(iframe?.getAttribute('allow')).not.toMatch(/autoplay/)
    expect(screen.getByRole('status')).toHaveTextContent(/Cargando/)
    expect(screen.queryByRole('button', { name: /Reproducir video/ })).toBeNull()
  })

  it('cuando el reproductor carga, desaparece el aviso de carga y no hay error', () => {
    const { container } = render(<InstagramVideoCard video={video} />)
    fireEvent.click(screen.getByRole('button', { name: /Reproducir video/ }))
    fireEvent.load(container.querySelector('iframe')!)
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('si el reproductor no carga a tiempo muestra el enlace alternativo a la publicación', () => {
    vi.useFakeTimers()
    const { container } = render(<InstagramVideoCard video={video} />)
    fireEvent.click(screen.getByRole('button', { name: /Reproducir video/ }))
    act(() => {
      vi.advanceTimersByTime(EMBED_TIMEOUT_MS)
    })
    expect(container.querySelector('iframe')).toBeNull()
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(/No se pudo cargar el reproductor/)
    const fallback = screen.getByRole('link', { name: /Abrir en Instagram/ })
    expect(fallback).toHaveAttribute('href', POST)
    expect(fallback).toHaveAttribute('target', '_blank')
    expect(fallback).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('tras pedir el reproductor aparece una ayuda visible con el enlace a Instagram (iframe bloqueado)', () => {
    render(<InstagramVideoCard video={video} />)
    expect(screen.queryByText(/¿No ves el video\?/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /Reproducir video/ }))
    const help = screen.getByText(/¿No ves el video\?/)
    const link = within(help).getByRole('link', { name: /Ábrelo en Instagram/ })
    expect(link).toHaveAttribute('href', POST)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('si el reproductor carga a tiempo, el temporizador no lo reemplaza por el estado de error', () => {
    vi.useFakeTimers()
    const { container } = render(<InstagramVideoCard video={video} />)
    fireEvent.click(screen.getByRole('button', { name: /Reproducir video/ }))
    fireEvent.load(container.querySelector('iframe')!)
    act(() => {
      vi.advanceTimersByTime(EMBED_TIMEOUT_MS * 2)
    })
    expect(container.querySelector('iframe')).not.toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('sin miniatura configurada muestra un póster provisional, no una tarjeta vacía', () => {
    const { container } = render(<InstagramVideoCard video={video} />)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getAllByText('Título de prueba').length).toBeGreaterThan(0)
  })

  it('con miniatura usa la imagen con texto alternativo; si falla, vuelve al póster y conserva el enlace', () => {
    const { container } = render(<InstagramVideoCard video={{ ...video, thumbnail: '/images/videos/inexistente.jpg' }} />)
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('alt', 'Miniatura del video: Título de prueba')
    expect(img).toHaveAttribute('loading', 'lazy')
    fireEvent.error(img)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByRole('link', { name: /Ver publicación original/ })).toHaveAttribute('href', POST)
    expect(screen.getByRole('button', { name: /Reproducir video/ })).toBeInTheDocument()
  })
})
