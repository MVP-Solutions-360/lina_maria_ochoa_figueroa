export interface PracticeArea {
  title: string
  description: string
  to: string
}

/** Tarjetas de la portada. */
export const practiceAreas: PracticeArea[] = [
  {
    title: 'Derecho médico y responsabilidad médica',
    description:
      'Asesoría jurídica para médicos, especialistas y organizaciones de salud en asuntos relacionados con el ejercicio profesional, la responsabilidad médica y la gestión del riesgo jurídico.',
    to: '/derecho-medico',
  },
  {
    title: 'Defensa judicial, administrativa y disciplinaria',
    description:
      'Acompañamiento y representación jurídica en actuaciones y procesos que requieren análisis riguroso, estrategia y comprensión de las particularidades del sector salud.',
    to: '/derecho-medico',
  },
  {
    title: 'Consultoría y gerencia en salud',
    description:
      'Acompañamiento a clínicas e IPS en asuntos relacionados con gestión institucional, habilitación de servicios, contratación, cumplimiento y fortalecimiento de sus procesos.',
    to: '/consultoria-en-salud',
  },
]

export interface Pillar {
  title: string
  description: string
}

export const pillars: Pillar[] = [
  {
    title: 'Autoridad jurídica',
    description:
      'Asesoría y defensa en asuntos relacionados con el ejercicio médico, la responsabilidad profesional y los desafíos jurídicos de los profesionales e instituciones de salud.',
  },
  {
    title: 'Visión directiva',
    description:
      'Experiencia en la dirección de clínicas e IPS, con comprensión de sus procesos administrativos, operativos y regulatorios.',
  },
  {
    title: 'Enfoque estratégico',
    description:
      'Acompañamiento orientado a comprender los riesgos, evaluar alternativas y tomar decisiones con criterio jurídico y conocimiento del contexto institucional.',
  },
]

export interface ServiceBlock {
  title: string
  description: string
  items: string[]
}

export const medicalLawBlocks: ServiceBlock[] = [
  {
    title: 'Derecho médico y responsabilidad médica',
    description:
      'Análisis jurídico del ejercicio profesional en salud y de los riesgos que se derivan de la práctica clínica y quirúrgica.',
    items: [
      'Responsabilidad médica en los ámbitos civil, penal, administrativo y ético.',
      'Evaluación jurídica de situaciones derivadas de la atención al paciente.',
      'Gestión del riesgo jurídico en la práctica de médicos y especialistas.',
    ],
  },
  {
    title: 'Defensa judicial, administrativa, ética y disciplinaria',
    description:
      'Representación y estrategia en actuaciones donde la comprensión del contexto médico es determinante.',
    items: [
      'Procesos de responsabilidad médica e investigaciones penales y civiles.',
      'Actuaciones administrativas, procesos éticos y disciplinarios.',
      'Preparación y acompañamiento del profesional durante el proceso.',
    ],
  },
  {
    title: 'Asesoría preventiva para médicos y especialistas',
    description:
      'Orientación para reducir riesgos antes de que se conviertan en conflictos.',
    items: [
      'Historia clínica y consentimiento informado.',
      'Peticiones, quejas y reclamos (PQR) y comunicación con pacientes.',
      'Conflictos con pacientes y continuidad asistencial.',
    ],
  },
  {
    title: 'Acompañamiento jurídico institucional',
    description:
      'Asesoría a clínicas, IPS y empresas del sector salud en su operación jurídica.',
    items: [
      'Contratación de servicios de salud y relaciones con aseguradores.',
      'Requerimientos regulatorios y visitas de inspección.',
      'Asesoría corporativa y laboral, procesos disciplinarios y seguridad social.',
    ],
  },
]

export const consultingBlocks: ServiceBlock[] = [
  {
    title: 'Gerencia y dirección de clínicas e IPS',
    description:
      'Una mirada directiva construida desde la dirección de instituciones prestadoras de servicios de salud.',
    items: [
      'Planeación y supervisión de la operación clínica y administrativa.',
      'Gobierno corporativo y toma de decisiones institucionales.',
      'Gestión de crisis y relación con autoridades y organismos de control.',
    ],
  },
  {
    title: 'Habilitación y cumplimiento sanitario',
    description:
      'Acompañamiento para comprender y atender las exigencias regulatorias de la prestación de servicios de salud.',
    items: [
      'Procesos de habilitación de servicios de salud.',
      'Preparación para visitas de verificación e inspección.',
      'Atención de requerimientos de autoridades sanitarias.',
    ],
  },
  {
    title: 'Contratación y gestión institucional',
    description:
      'Apoyo jurídico y administrativo en la relación de la institución con terceros y con su talento humano.',
    items: [
      'Contratación de servicios de salud y relaciones con proveedores y aseguradores.',
      'Relaciones laborales, seguridad social y SG-SST.',
      'Diseño de contratos, políticas y protocolos.',
    ],
  },
  {
    title: 'Calidad y gestión del riesgo',
    description:
      'Integración de la perspectiva jurídica con la gestión de calidad y la seguridad del paciente.',
    items: [
      'Seguridad del paciente y mejoramiento continuo.',
      'Gestión de PQR, eventos adversos y comités institucionales.',
      'Prevención del riesgo clínico y jurídico.',
    ],
  },
  {
    title: 'Asesoría estratégica',
    description:
      'Acompañamiento a directivos para evaluar alternativas y decidir con criterio.',
    items: [
      'Lectura integral de riesgos jurídicos, operativos y regulatorios.',
      'Fortalecimiento de procesos institucionales.',
      'Acompañamiento a la dirección en decisiones relevantes.',
    ],
  },
]
