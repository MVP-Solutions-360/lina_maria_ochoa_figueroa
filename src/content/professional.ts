/**
 * Datos profesionales. Fuente: hoja de vida proporcionada.
 * Por decisión del proyecto NO se publican: cédula, correo, teléfono, tarjeta profesional
 * ni nombres de clínicas o empresas. Los títulos sin año no llevan año asignado.
 */

/** Año de grado en Derecho (hoja de vida). NO es el inicio del ejercicio profesional. */
export const GRADUATION_YEAR = 2009
/** Inicio del ejercicio profesional como abogada litigante y consultora (hoja de vida). */
export const PRACTICE_START_YEAR = 2010
/** Inicio de la experiencia directiva en instituciones de salud (hoja de vida). */
export const DIRECTIVE_START_YEAR = 2017
export const yearsOfPractice = new Date().getFullYear() - PRACTICE_START_YEAR

export type DegreeLevel = 'maestría' | 'especialización' | 'pregrado'

export interface Degree {
  program: string
  institution: string
  level: DegreeLevel
  year?: number
}

/** Orden de la hoja de vida (formación académica). */
export const education: Degree[] = [
  { program: 'Especialización en Gerencia de la Salud', institution: 'Universidad CES', level: 'especialización' },
  {
    program: 'Especialización en Derecho Médico',
    institution: 'Universidad Pontificia Bolivariana',
    level: 'especialización',
    year: 2017,
  },
  {
    program: 'Maestría en Derecho Procesal Constitucional',
    institution: 'Universidad Nacional de Lomas de Zamora, Argentina',
    level: 'maestría',
    year: 2020,
  },
  { program: 'Maestría en Derecho', institution: 'Universidad Pontificia Bolivariana', level: 'maestría', year: 2018 },
  {
    program: 'Especialización en Derecho Procesal Penal',
    institution: 'Universidad Autónoma Latinoamericana',
    level: 'especialización',
    year: 2017,
  },
  {
    program: 'Especialización en Seguridad y Salud en el Trabajo',
    institution: 'Universidad CES',
    level: 'especialización',
  },
  { program: 'Especialización en Derecho Comercial', institution: 'Universidad CES', level: 'especialización' },
  {
    program: 'Especialización en Derecho Administrativo - Contratación Estatal',
    institution: 'Universidad Autónoma Latinoamericana',
    level: 'especialización',
    year: 2010,
  },
  { program: 'Derecho', institution: 'Universidad Autónoma Latinoamericana', level: 'pregrado', year: 2009 },
]

export const educationLevels: Array<{ level: DegreeLevel; heading: string }> = [
  { level: 'maestría', heading: 'Maestrías' },
  { level: 'especialización', heading: 'Especializaciones' },
  { level: 'pregrado', heading: 'Pregrado' },
]

export interface CredentialInstitution {
  /** Nombre tal como figura en la hoja de vida (coincide con `education[].institution`) */
  name: string
  /** Resumen de lo cursado allí; debe coincidir con `education` (hay una prueba que lo verifica) */
  detail: string
  country?: string
  /**
   * Logotipo OFICIAL de la institución, cuando se tenga el archivo y autorización de uso.
   * Ej.: { src: '/images/instituciones/ual.svg', alt: 'Logotipo de la Universidad ...' }.
   * Sin logo, la franja muestra el nombre en texto.
   */
  logo?: { src: string; alt: string }
  /**
   * Sello de la institución para el hero de la portada (se muestra sobre un fondo negro).
   * Versiones WebP de 160 px generadas a partir de los originales (guardados en /originales).
   */
  emblem?: { src: string; alt: string; width: number; height: number }
  /** Logotipo a color, para el tema claro (el emblem anterior se usa en el tema oscuro). */
  emblemColor?: { src: string; width: number; height: number }
}

/** Instituciones de formación, para la franja de credenciales de la portada. */
export const credentialInstitutions: CredentialInstitution[] = [
  {
    name: 'Universidad Autónoma Latinoamericana',
    detail: 'Derecho y dos especializaciones',
    emblem: {
      src: '/images/universidades/UNAULA-160.webp',
      alt: 'Logotipo de la Universidad Autónoma Latinoamericana',
      width: 160,
      height: 160,
    },
    emblemColor: { src: '/images/universidades/UNAULA_C-160.webp', width: 160, height: 158 },
  },
  {
    name: 'Universidad CES',
    detail: 'Tres especializaciones',
    emblem: { src: '/images/universidades/CES-160.webp', alt: 'Logotipo de la Universidad CES', width: 160, height: 160 },
    emblemColor: { src: '/images/universidades/CES_C-160.webp', width: 159, height: 160 },
  },
  {
    name: 'Universidad Pontificia Bolivariana',
    detail: 'Derecho Médico y Maestría en Derecho',
    emblem: {
      src: '/images/universidades/UPB-160.webp',
      alt: 'Logotipo de la Universidad Pontificia Bolivariana',
      width: 160,
      height: 142,
    },
    emblemColor: { src: '/images/universidades/UPB_C-160.webp', width: 160, height: 142 },
  },
  {
    name: 'Universidad Nacional de Lomas de Zamora',
    detail: 'Maestría en Derecho Procesal Constitucional',
    country: 'Argentina',
    emblem: {
      src: '/images/universidades/UNLZ-160.webp',
      alt: 'Logotipo de la Universidad Nacional de Lomas de Zamora, Argentina',
      width: 160,
      height: 160,
    },
    emblemColor: { src: '/images/universidades/UNLZ_C-160.webp', width: 160, height: 160 },
  },
]

export interface ExperienceEntry {
  period: string
  title: string
  description: string
}

/** Experiencia profesional (descripciones generales, sin nombres de instituciones). */
export const experience: ExperienceEntry[] = [
  {
    period: '2017 – actualidad',
    title: 'Gerente y representante legal de instituciones del sector salud',
    description:
      'Dirección de la operación clínica, administrativa, jurídica y financiera de instituciones prestadoras de servicios de salud: habilitación, calidad, seguridad del paciente, contratación y atención de requerimientos de autoridades.',
  },
  {
    period: '2010 – actualidad',
    title: 'Abogada litigante y consultora en derecho médico y de la salud',
    description:
      'Representación, defensa y asesoría a médicos, cirujanos, clínicas, IPS y empresas del sector salud en asuntos de responsabilidad médica, así como en materia administrativa, ética, disciplinaria, civil y penal.',
  },
  {
    period: '2010 – 2013',
    title: 'Experiencia jurídica complementaria',
    description:
      'Asesoría y dirección jurídica en entidades públicas y empresas: contratación estatal, derecho laboral, comercial y civil, seguridad social, cobro coactivo y representación judicial.',
  },
]

/** Hitos de la portada. `kind` separa claramente formación de experiencia. */
export interface Milestone {
  kind: 'formación' | 'experiencia'
  label: string
  title: string
  description: string
}

export const homeMilestones: Milestone[] = [
  {
    kind: 'formación',
    label: '2009',
    title: 'Graduación en Derecho',
    description: 'Universidad Autónoma Latinoamericana.',
  },
  {
    kind: 'experiencia',
    label: 'Desde 2010',
    title: 'Abogada litigante y consultora',
    description: 'Ejercicio profesional en derecho médico y de la salud.',
  },
  {
    kind: 'formación',
    label: '2017',
    title: 'Especialización en Derecho Médico',
    description: 'Universidad Pontificia Bolivariana.',
  },
  {
    kind: 'experiencia',
    label: 'Desde 2017',
    title: 'Dirección de instituciones de salud',
    description: 'Gerencia y representación legal de clínicas e IPS.',
  },
]

export const postgraduateSummary =
  'Posgrados en Derecho Médico, Gerencia de la Salud, Derecho Procesal Constitucional (maestría), Derecho (maestría), Derecho Procesal Penal, Derecho Comercial, Derecho Administrativo – Contratación Estatal y Seguridad y Salud en el Trabajo.'

export const strengths: string[] = [
  'Gerencia estratégica, administrativa y operativa de clínicas e IPS.',
  'Habilitación de servicios de salud, gestión de calidad y preparación para visitas de verificación.',
  'Dirección de procesos asistenciales, seguridad del paciente y mejoramiento continuo.',
  'Defensa y asesoría jurídica de médicos, especialistas, clínicas e instituciones prestadoras de salud.',
  'Responsabilidad médica y procesos sancionatorios, éticos, disciplinarios, civiles, penales y administrativos.',
  'Gobierno corporativo, contratación, derecho laboral, seguridad social y gestión de crisis institucionales.',
]

export const competencies: string[] = [
  'Liderazgo institucional',
  'Toma de decisiones',
  'Negociación',
  'Manejo de crisis',
  'Planeación estratégica',
  'Dirección de equipos',
  'Comunicación ejecutiva',
  'Gestión por resultados',
  'Criterio jurídico y clínico-administrativo',
]

/* ------------------------------------------------------------------------------------------
 * Página /perfil-profesional
 * ---------------------------------------------------------------------------------------- */

export interface CareerFigure {
  /** Año de referencia (no se calcula ninguna duración: no depende de la fecha de consulta) */
  year: number
  label: string
  description: string
}

export const careerFigures: CareerFigure[] = [
  {
    year: PRACTICE_START_YEAR,
    label: 'Ejercicio profesional desde',
    description: 'Inicio de mi trayectoria como abogada litigante y consultora en derecho médico y de la salud.',
  },
  {
    year: DIRECTIVE_START_YEAR,
    label: 'Experiencia directiva desde',
    description: 'Gerencia y representación legal de instituciones prestadoras de servicios de salud.',
  },
]

export interface ProfileBlock {
  id: string
  title: string
  text: string
  /** Enlace interno hacia el área de especialidad que desarrolla el bloque */
  link?: { label: string; to: string }
}

/** Cuatro bloques narrativos: cómo se relacionan sus áreas de experiencia. */
export const profileBlocks: ProfileBlock[] = [
  {
    id: 'ejercicio-juridico',
    title: 'Ejercicio del derecho y experiencia jurídica',
    text: 'Empecé a ejercer como abogada litigante y consultora en 2010. Entre 2010 y 2013 trabajé en asuntos jurídicos de entidades públicas y empresas: contratación estatal, derecho laboral, comercial y civil, seguridad social, cobro coactivo y representación judicial. Esa base amplia es el punto de partida de todo lo demás.',
  },
  {
    id: 'derecho-medico',
    title: 'Derecho médico y responsabilidad profesional',
    text: 'Desde esa base me especialicé en derecho médico. Represento y asesoro a médicos, cirujanos, clínicas e IPS en procesos de responsabilidad médica y en actuaciones administrativas, éticas, disciplinarias, civiles y penales, y acompaño también la prevención: historia clínica, consentimiento informado y atención de PQR.',
    link: { label: 'Cómo acompaño en derecho médico', to: '/derecho-medico' },
  },
  {
    id: 'gestion-salud',
    title: 'Gestión y liderazgo en instituciones de salud',
    text: 'Desde 2017 soy gerente y representante legal de instituciones del sector salud. Dirijo su operación clínica, administrativa, jurídica y financiera, con atención a la habilitación de servicios, la calidad, la seguridad del paciente y los requerimientos de las autoridades. Esa experiencia directiva complementa mi ejercicio jurídico: permite entender las decisiones médicas y administrativas desde la operación de la institución.',
    link: { label: 'Consultoría jurídica para instituciones de salud', to: '/consultoria-en-salud' },
  },
  {
    id: 'bmq',
    title: 'Dirección de Blindaje Médico Quirúrgico',
    text: 'Soy CEO de Blindaje Médico Quirúrgico, una organización orientada a las necesidades de protección del sector médico y quirúrgico, con propuesta corporativa propia y diferenciada de mi ejercicio profesional.',
  },
]

export type CareerKind = 'formación' | 'inicio del ejercicio' | 'experiencia jurídica' | 'experiencia directiva' | 'dirección de BMQ'

export interface CareerMilestone {
  label: string
  title: string
  description: string
  kind: CareerKind
}

/** Cronología breve: sólo hitos respaldados por la hoja de vida; el cargo en BMQ no lleva fecha. */
export const careerTimeline: CareerMilestone[] = [
  {
    label: String(GRADUATION_YEAR),
    kind: 'formación',
    title: 'Graduación en Derecho',
    description: 'Universidad Autónoma Latinoamericana.',
  },
  {
    label: String(PRACTICE_START_YEAR),
    kind: 'inicio del ejercicio',
    title: 'Abogada litigante y consultora',
    description: 'Inicio del ejercicio profesional en derecho médico y de la salud.',
  },
  {
    label: '2010 – 2013',
    kind: 'experiencia jurídica',
    title: 'Asuntos jurídicos en entidades públicas y empresas',
    description: 'Contratación estatal, derecho laboral, comercial y civil, seguridad social y representación judicial.',
  },
  {
    label: '2017',
    kind: 'formación',
    title: 'Especialización en Derecho Médico',
    description: 'Universidad Pontificia Bolivariana.',
  },
  {
    label: `Desde ${DIRECTIVE_START_YEAR}`,
    kind: 'experiencia directiva',
    title: 'Gerente y representante legal de instituciones de salud',
    description: 'Dirección de la operación clínica, administrativa, jurídica y financiera.',
  },
  {
    label: 'Actualidad',
    kind: 'dirección de BMQ',
    title: 'CEO de Blindaje Médico Quirúrgico',
    description: 'Dirección de una organización con propuesta corporativa propia.',
  },
]
