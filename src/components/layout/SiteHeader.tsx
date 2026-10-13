import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { mainNavigation } from '../../content/navigation'
import { site } from '../../config/site'
import { cx } from '../../lib/cx'
import { MobileNavigation } from './MobileNavigation'
import { WhatsAppButton } from './WhatsAppButton'

const MOBILE_NAV_ID = 'mobile-navigation'

export function SiteHeader() {
  const { pathname } = useLocation()
  // El menú queda abierto sólo en la ruta donde se abrió: al navegar se cierra solo.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null)
  const menuOpen = openOnPath === pathname
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Único comportamiento al desplazarse: el borde inferior se hace visible.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => {
    setOpenOnPath(null)
    toggleRef.current?.focus()
  }, [])

  return (
    <header
      className={cx(
        'sticky top-0 z-50 h-[4.5rem] bg-[var(--nav-bg)] transition-[border-color] duration-200',
        'border-b',
        scrolled || menuOpen ? 'border-line' : 'border-transparent',
      )}
    >
      <div className="container-editorial flex h-full items-center justify-between gap-6">
        <Link
          to="/"
          className="flex shrink-0 flex-col whitespace-nowrap leading-none"
          aria-label={`${site.name}, ir al inicio`}
        >
          <span className="font-serif text-[1.0625rem] tracking-tight min-[380px]:text-xl sm:text-[1.375rem]">{site.name}</span>
          <span className="mt-1.5 hidden text-[0.625rem] font-medium uppercase tracking-[0.24em] text-accent sm:block">
            Derecho médico · Salud
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden xl:block">
          <ul className="flex items-center gap-5 2xl:gap-8">
            {mainNavigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cx(
                      'relative inline-flex min-h-11 items-center whitespace-nowrap text-[0.8125rem] tracking-wide transition-colors 2xl:text-sm',
                      'after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-200',
                      isActive
                        ? 'text-ink after:scale-x-100'
                        : 'text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <WhatsAppButton label="WhatsApp" size="sm" />
          </div>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls={MOBILE_NAV_ID}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpenOnPath(menuOpen ? null : pathname)}
            className="inline-flex h-11 w-11 items-center justify-center border border-line text-ink xl:hidden"
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={20} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <MobileNavigation id={MOBILE_NAV_ID} open={menuOpen} onClose={closeMenu} />
    </header>
  )
}
