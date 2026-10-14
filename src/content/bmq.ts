/**
 * Texto de apoyo del video de presentación de BMQ en la portada.
 * Fuente: texto proporcionado por la clienta para esa publicación (resumido).
 */
export const bmqVideoIntro =
  'Blindar la práctica médica en todas sus etapas es esencial para proteger tanto a los médicos como a los pacientes, minimizando los riesgos legales y asegurando una atención de calidad.'

export interface CareStage {
  stage: string
  summary: string
}

export const bmqCareStages: CareStage[] = [
  {
    stage: 'Etapa prequirúrgica',
    summary: 'Consentimiento informado documentado y evaluaciones preoperatorias exhaustivas.',
  },
  {
    stage: 'Etapa quirúrgica',
    summary: 'Cumplimiento de protocolos, equipo en buen estado y personal capacitado para el procedimiento.',
  },
  {
    stage: 'Etapa postquirúrgica',
    summary: 'Seguimiento continuo, registro de cada tratamiento y comunicación abierta con el paciente.',
  },
]
