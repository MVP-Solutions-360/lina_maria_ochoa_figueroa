/**
 * Publicaciones de Instagram enlazadas desde el sitio. Única fuente de datos de video.
 *
 * - `shortcode` es el identificador de la URL (instagram.com/p/<shortcode>/).
 * - `title` y `description` sólo describen lo comprobado en el texto público de la publicación.
 *   Las publicaciones que no se pudieron leer llevan únicamente el título indicado por la clienta
 *   y no se publican (`featured: false`) hasta verificarlas.
 * - `thumbnail`: ruta local OPCIONAL de la miniatura real (ej. '/images/videos/C7MxVU8Rk3D.jpg').
 *   Hoy ninguna está cargada: la tarjeta muestra un póster tipográfico provisional.
 *   Para incorporarla, copia la imagen a public/images/videos/ y escribe su ruta aquí.
 */
export type VideoTopic = 'bmq-presentacion' | 'derecho-medico' | 'bmq-proteccion'

export interface InstagramVideo {
  shortcode: string
  title: string
  description?: string
  topic: VideoTopic
  /** Cuenta de Instagram que publica el contenido, sólo cuando se verificó. */
  account?: string
  /**
   * Ideas principales del texto de la publicación (resumidas, sin llamados comerciales), para
   * acompañar el video en su página temática. Si hay ideas, `ideasTitle` es obligatorio.
   */
  ideasTitle?: string
  ideas?: string[]
  thumbnail?: string
  /** Se muestra en su página temática. */
  featured: boolean
}

const BMQ_ACCOUNT = '@blindajemedicoquirurgico'

export const instagramVideos: InstagramVideo[] = [
  // Portada: presentación de BMQ
  {
    shortcode: 'C7MxVU8Rk3D',
    title: 'Protección legal en cada etapa de la atención quirúrgica',
    description:
      'Antes, durante y después de la cirugía: consentimiento informado, documentación y seguimiento, explicados por Blindaje Médico Quirúrgico.',
    topic: 'bmq-presentacion',
    account: BMQ_ACCOUNT,
    featured: true,
  },

  // Derecho médico
  {
    shortcode: 'DGeZOTlOGMZ',
    title: 'Qué regula el derecho médico',
    description:
      'Responsabilidad civil y penal de los profesionales de la salud y regulación de la relación médico-paciente.',
    ideasTitle: 'Por qué es fundamental el derecho médico',
    ideas: [
      'Aborda la responsabilidad civil y penal de los profesionales de la salud.',
      'Regula la relación médico-paciente y los procesos judiciales del sector.',
      'Ofrece estrategias legales basadas en normativas y protocolos médicos.',
    ],
    topic: 'derecho-medico',
    account: BMQ_ACCOUNT,
    featured: true,
  },
  {
    shortcode: 'DYQVlO2RNcj',
    title: 'Historia clínica: por qué importa',
    description: 'Por qué una historia clínica clara puede ser determinante ante un proceso judicial.',
    ideasTitle: 'Una demanda médica no siempre se pierde en el quirófano',
    ideas: [
      'Hechos mal documentados, información incompleta o registros ambiguos pueden convertirse en un riesgo jurídico para el profesional.',
      'La historia clínica debe ser clara para otro médico.',
      'También debe poder explicarle a un juez cada decisión tomada durante la atención.',
    ],
    topic: 'derecho-medico',
    account: BMQ_ACCOUNT,
    featured: true,
  },
  { shortcode: 'DZQHmEUR8p1', title: 'Relación médico-paciente: el médico no está obligado a recibir malos tratos', topic: 'derecho-medico', featured: false },
  { shortcode: 'DKkgFEkv3X6', title: 'Historia clínica: importancia', topic: 'derecho-medico', featured: false },
  { shortcode: 'DE5uehmJph4', title: 'Historia clínica: no tachones ni enmendaduras', topic: 'derecho-medico', featured: false },
  { shortcode: 'DL5zpLYSzXw', title: 'Tipos de daños que pueden ser reclamados judicialmente', topic: 'derecho-medico', featured: false },

  // Blindaje Médico Quirúrgico: protección profesional
  {
    shortcode: 'DWHS-dihCNn',
    title: 'Respalda tu práctica médica',
    description:
      'Revisión de consentimientos informados e historias clínicas y estrategias jurídicas preventivas para proteger la práctica médica.',
    ideasTitle: 'Anticiparse a los riesgos',
    ideas: [
      'Un diagnóstico legal preciso requiere estrategia, análisis y experiencia jurídica.',
      'Cada consentimiento informado, historia clínica y situación crítica con un paciente se evalúa con cuidado por un equipo especializado en derecho médico y responsabilidad médica.',
      'Las estrategias legales preventivas buscan proteger el ejercicio médico antes de que un conflicto llegue a los tribunales.',
    ],
    topic: 'bmq-proteccion',
    account: BMQ_ACCOUNT,
    featured: true,
  },
  { shortcode: 'DWjnIFeB6J5', title: 'Respaldo económico: si condenan al médico a pagar una multa', topic: 'bmq-proteccion', featured: false },
  { shortcode: 'DVBwYackV0t', title: 'Respalda tu práctica médica', topic: 'bmq-proteccion', featured: false },
  { shortcode: 'DVZeVlsEn95', title: 'Tipos de cobertura', topic: 'bmq-proteccion', featured: false },
]

export const instagramPostUrl = (shortcode: string) => `https://www.instagram.com/p/${shortcode}/`

/** Modalidad oficial de inserción de Instagram para una publicación pública. */
export const instagramEmbedUrl = (shortcode: string) => `${instagramPostUrl(shortcode)}embed/`

/** Videos publicados (destacados) de un tema, en el orden del arreglo. */
export function featuredVideos(topic: VideoTopic): InstagramVideo[] {
  return instagramVideos.filter((video) => video.topic === topic && video.featured)
}
