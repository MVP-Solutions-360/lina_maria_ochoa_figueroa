import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { mainNavigation } from '../../content/navigation'
import { site } from '../../config/site'
import { cx } from '../../lib/cx'
import { WhatsAppButton } from './WhatsAppButton'

interface MobileNavigationProps {
  id: string
  open: boolean
  onClose: () => void
}

/** Panel de navegación para pantallas sin espacio para el menú de escritorio. */
export function MobileNavigation({ id, open, onClose }: MobileNavigationProps) {
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <nav
      ref={panelRef}
      id={id}
      aria-label="Navegación principal (móvil)"
      className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto border-t border-line bg-bg xl:hidden"
    >
      <div className="container-editorial flex min-h-full flex-col py-8">
        <ul className="flex flex-col">
          {mainNavigation.map((item) => (
            <li key={item.to} className="border-b border-line">
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cx(
                    'flex min-h-14 items-center font-serif text-2xl transition-colors',
                    isActive ? 'text-accent' : 'text-ink hover:text-accent',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <WhatsAppButton className="w-full" />
        </div>

        <p className="mt-auto pt-10 text-sm text-muted">{site.location}</p>
      </div>
    </nav>
  )
}
