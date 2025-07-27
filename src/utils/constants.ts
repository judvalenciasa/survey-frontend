export const QUESTION_TYPES = [
  { value: 'TEXT', label: '📝 Texto libre' },
  { value: 'SINGLE_CHOICE', label: '🔘 Opción única' },
  { value: 'MULTIPLE_CHOICE', label: '☑️ Múltiple selección' },
  { value: 'YES_NO', label: '✅ Sí/No' },
  { value: 'SCALE', label: '📊 Escala' },
  { value: 'NUMBER', label: '🔢 Número' }
] as const

// Tipos derivados para mejor tipado
export type QuestionTypeValue = typeof QUESTION_TYPES[number]['value']
export type QuestionTypeOption = typeof QUESTION_TYPES[number]


