/**
 * Metadatos por ruta (SEO y vista previa al compartir). Única fuente: la leen las páginas en
 * tiempo de ejecución (usePageMeta) y el plugin de compilación (build/seoPlugin.ts), que genera
 * un HTML estático por ruta para los rastreadores que no ejecutan JavaScript.
 * Este módulo no debe importar nada del navegador (DOM) ni de React.
 */
export interface PageMetaEntry {
  title: string
  description: string
  /** Ruta de la página, ej. '/perfil-profesional' */
  path: string
  /** No indexar (p. ej. la página 404) */
  noindex?: boolean
}

export const pageMeta = {
  home: {
    title: 'Lina María Ochoa Figueroa, abogada en derecho médico',
    description:
      'Abogada especializada en derecho médico, con ejercicio desde 2010 y experiencia en la gestión de instituciones de salud. CEO de Blindaje Médico Quirúrgico (BMQ).',
    path: '/',
  },
  profile: {
    title: 'Perfil profesional y trayectoria',
    description:
      'Formación, ejercicio como abogada desde 2010 y dirección de instituciones de salud desde 2017: la trayectoria de Lina María Ochoa Figueroa en derecho médico.',
    path: '/perfil-profesional',
  },
  medicalLaw: {
    title: 'Derecho médico en Colombia',
    description:
      'Asesoría, prevención y defensa jurídica en derecho médico y responsabilidad médica para médicos, especialistas, clínicas e instituciones de salud en Colombia.',
    path: '/derecho-medico',
  },
  consulting: {
    title: 'Consultoría jurídica en salud',
    description:
      'Consultoría jurídica y de gestión para clínicas e IPS: habilitación, contratación, calidad y gestión del riesgo, desde la experiencia de haberlas dirigido.',
    path: '/consultoria-en-salud',
  },
  bmq: {
    title: 'CEO de Blindaje Médico Quirúrgico',
    description:
      'Lina María Ochoa Figueroa es CEO de Blindaje Médico Quirúrgico (BMQ), una organización con propuesta propia orientada a la protección del sector médico y quirúrgico.',
    path: '/blindaje-medico-quirurgico',
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o fue movida.',
    path: '/404',
    noindex: true,
  },
} satisfies Record<string, PageMetaEntry>

/** Páginas que se indexan y van al sitemap. */
export const indexablePages: PageMetaEntry[] = Object.values(pageMeta).filter(
  (page): page is PageMetaEntry & { noindex?: undefined } => !('noindex' in page && page.noindex),
)
