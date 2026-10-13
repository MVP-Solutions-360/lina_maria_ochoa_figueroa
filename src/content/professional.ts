/**
 * Datos profesionales. Fuente: hoja de vida proporcionada.
 * Por decisión del proyecto NO se publican: cédula, correo, teléfono, tarjeta profesional
 * ni nombres de clínicas o empresas. Los títulos sin año no llevan año asignado.
 */

/** Año de grado en Derecho (hoja de vida). NO es el inicio del ejercicio profesional. */
export const GRADUATION_YEAR = 2009
/** Inicio del ejercicio profesional como abogada litigante y consultora (hoja de vida). */
export const PRACTICE_START_YEAR = 2010
export const yearsOfPractice = new Date().getFullYear() - PRACTICE_START_YEAR

export interface Degree {
  program: string
  institution: string
  year?: number
}

/** Orden de la hoja de vida (formación académica). */
export const education: Degree[] = [
  { program: 'Especialización en Gerencia de la Salud', institution: 'Universidad CES' },
  { program: 'Especialización en Derecho Médico', institution: 'Universidad Pontificia Bolivariana', year: 2017 },
  {
    program: 'Maestría en Derecho Procesal Constitucional',
    institution: 'Universidad Nacional de Lomas de Zamora, Argentina',
    year: 2020,
  },
  { program: 'Maestría en Derecho', institution: 'Universidad Pontificia Bolivariana', year: 2018 },
  {
    program: 'Especialización en Derecho Procesal Penal',
    institution: 'Universidad Autónoma Latinoamericana',
    year: 2017,
  },
  { program: 'Especialización en Seguridad y Salud en el Trabajo', institution: 'Universidad CES' },
  { program: 'Especialización en Derecho Comercial', institution: 'Universidad CES' },
  {
    program: 'Especialización en Derecho Administrativo - Contratación Estatal',
    institution: 'Universidad Autónoma Latinoamericana',
    year: 2010,
  },
  { program: 'Derecho', institution: 'Universidad Autónoma Latinoamericana', year: 2009 },
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
