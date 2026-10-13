/**
 * Configuración central del sitio. Es el ÚNICO lugar donde se definen el
 * dominio, el número de WhatsApp y los enlaces externos.
 */

/** Pendiente: definir el dominio final (sin barra final). Ej.: 'https://www.ejemplo.com' */
export const SITE_URL = ''

/**
 * Pendiente: número profesional de WhatsApp en formato internacional, sólo dígitos
 * (ej. '573001234567'). Mientras esté vacío, el sitio muestra los botones de contacto
 * deshabilitados y NO simula un contacto funcional.
 */
const WHATSAPP_NUMBER = '573164821047'

const WHATSAPP_MESSAGE =
  'Hola, Lina. Me gustaría conversar sobre una consulta profesional. Prefiero no enviar documentos ni historias clínicas por este primer mensaje.'

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

export const privacy = {
  /** La política de privacidad no existe todavía: no se enlaza hasta su aprobación. */
  approved: false,
  pendingLabel: 'Aviso de privacidad y tratamiento de datos (pendiente de aprobación)',
} as const
