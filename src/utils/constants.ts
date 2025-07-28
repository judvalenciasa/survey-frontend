/**
 * Constantes globales de utilidad para la aplicación
 * @description Define configuraciones y tipos estáticos para uso en componentes
 * @module Utils Constants
 */

/**
 * Configuración de tipos de preguntas con iconos y etiquetas
 * @constant QUESTION_TYPES
 */
export const QUESTION_TYPES = [
  { value: 'TEXT', label: '📝 Texto libre' },
  { value: 'SINGLE_CHOICE', label: '🔘 Opción única' },
  { value: 'MULTIPLE_CHOICE', label: '☑️ Múltiple selección' },
  { value: 'YES_NO', label: '✅ Sí/No' },
  { value: 'SCALE', label: '📊 Escala' },
  { value: 'NUMBER', label: '🔢 Número' }
] as const

/**
 * Tipo derivado que extrae los valores posibles de tipos de pregunta
 * @type QuestionTypeValue
 */
export type QuestionTypeValue = typeof QUESTION_TYPES[number]['value']

/**
 * Tipo derivado que representa una opción completa de tipo de pregunta
 * @type QuestionTypeOption
 */
export type QuestionTypeOption = typeof QUESTION_TYPES[number]


