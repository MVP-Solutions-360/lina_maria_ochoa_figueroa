/**
 * Configuración central del sitio. Es el ÚNICO lugar donde se definen el
 * dominio, el número de WhatsApp y los enlaces externos.
 */

/**
 * Dominio de producción configurado y confirmado (https, SIN barra final). Con él se generan
 * canonical, og:url, og:image, sitemap.xml y robots.txt al compilar. Si cambia, actualizarlo aquí
 * y recompilar; build/seoPlugin.ts rechaza valores incoherentes (http, barra final, rutas, localhost).
 */
export const SITE_URL = 'https://linamariaochoafigueroa.wellezyhub.com'

/** Imagen de vista previa al compartir enlaces (1200×630, logo propio sobre el carbón de la marca). */
export const OG_IMAGE = {
  src: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Logotipo de Lina María Ochoa Figueroa, Derecho médico',
} as const

/**
 * Pendiente: número profesional de WhatsApp en formato internacional, sólo dígitos
 * (ej. '573001234567'). Mientras esté vacío, el sitio muestra los botones de contacto
 * deshabilitados y NO simula un contacto funcional.
 */
const WHATSAPP_NUMBER = '573164821047'

/**
 * WhatsApp corporativo de Blindaje Médico Quirúrgico (grupo de redes de BMQ en el footer).
 * Número entregado: 3016546268 (celular de Colombia); se antepone el indicativo 57 para wa.me.
 */
const BMQ_WHATSAPP_NUMBER = '573016546268'

const WHATSAPP_MESSAGE =
  'Hola, Lina. Me gustaría conversar sobre una consulta profesional.'

export const site = {
  name: 'Lina María Ochoa Figueroa',
  tagline: 'Abogada · Derecho Médico · Dirección y consultoría en salud',
  location: 'Medellín, Colombia',
  /** Correo de contacto, autorizado para publicarse. Dejar vacío ('') para ocultarlo en todo el sitio. */
  contactEmail: 'linaochoaf@gmail.com',
  locale: 'es_CO',
  bmqUrl: 'https://blindajemedicoquirurgico.com/',
} as const

export const whatsapp = {
  isConfigured: /^\d{8,15}$/.test(WHATSAPP_NUMBER),
  href: /^\d{8,15}$/.test(WHATSAPP_NUMBER)
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : null,
  pendingNotice: 'El contacto por WhatsApp se activará cuando se configure el número profesional.',
} as const

export type SocialNetwork = 'instagram' | 'facebook' | 'whatsapp'

export interface SocialLink {
  network: SocialNetwork
  label: string
  href: string
}

export interface SocialGroup {
  id: 'lina' | 'bmq'
  /** Nombre visible de la marca a la que pertenecen los perfiles */
  heading: string
  links: SocialLink[]
}

/**
 * Perfiles oficiales, agrupados por marca para no confundir la marca personal con la corporativa.
 * Único lugar donde se definen estas URLs.
 */
export const socialGroups: SocialGroup[] = [
  {
    id: 'lina',
    heading: site.name,
    links: [
      { network: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/linaochoaf' },
      { network: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/lina.ochoa.900' },
      // Si el número no está configurado, el enlace de WhatsApp simplemente no se muestra.
      ...(whatsapp.isConfigured
        ? [{ network: 'whatsapp' as const, label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}` }]
        : []),
    ],
  },
  {
    id: 'bmq',
    heading: 'Blindaje Médico Quirúrgico',
    links: [
      {
        network: 'instagram',
        label: 'Instagram',
        href: 'https://www.instagram.com/blindajemedicoquirurgico',
      },
      { network: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/Blindajemedicoquirurgico' },
      { network: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${BMQ_WHATSAPP_NUMBER}` },
    ],
  },
]

export const privacy = {
  /** La política de privacidad no existe todavía: no se enlaza hasta su aprobación. */
  approved: false,
  pendingLabel: 'Aviso de privacidad y tratamiento de datos (pendiente de aprobación)',
} as const
