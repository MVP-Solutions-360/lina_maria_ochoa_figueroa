export interface NavItem {
  label: string
  to: string
}

export const mainNavigation: NavItem[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Perfil profesional', to: '/perfil-profesional' },
  { label: 'Derecho médico', to: '/derecho-medico' },
  { label: 'Consultoría en salud', to: '/consultoria-en-salud' },
  { label: 'BMQ', to: '/blindaje-medico-quirurgico' },
]
