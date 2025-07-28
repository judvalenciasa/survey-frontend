<!--
/**
 * Componente de análisis avanzado de respuestas
 * @description Proporciona análisis estadísticos y métricas de respuestas
 * @component ResponseAnalitysc
 */
-->
<template>
    <div class="response-analytics">
        <div class="analytics-header">
            <h3>📊 Análisis de Respuestas</h3>
            <p v-if="survey">Análisis para: <strong>{{ survey.name }}</strong></p>
        </div>

        <div v-if="!analysis" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Cargando análisis...</p>
        </div>

        <div v-else class="analysis-content">
            <div class="analysis-summary">
                <div class="summary-card">
                    <h4>Resumen General</h4>
                    <ul>
                        <li>Total de respuestas: <strong>{{ analysis.totalResponses || 0 }}</strong></li>
                        <li>Preguntas analizadas: <strong>{{ survey?.questions?.length || 0 }}</strong></li>
                        <li>Fecha de análisis: <strong>{{ currentDate }}</strong></li>
                    </ul>
                </div>
            </div>

            <div v-if="survey?.questions" class="questions-analysis">
                <h4>Análisis por Pregunta</h4>
                <div v-for="(question, index) in survey.questions" :key="question.id" class="question-analysis-card">
                    <div class="question-header">
                        <h5>{{ index + 1 }}. {{ question.text }}</h5>
                        <span class="question-type">{{ getQuestionTypeLabel(question.type) }}</span>
                    </div>

                    <div class="analysis-placeholder">
                        <div class="placeholder-content">
                            <span class="placeholder-icon">📈</span>
                            <p>Análisis disponible para pregunta tipo <strong>{{ question.type }}</strong></p>
                            <small>La implementación específica se desarrollará según los requisitos de análisis</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    analysis: any
    survey: any
}

defineProps<Props>()

/**
 * Fecha actual formateada
 */
const currentDate = computed(() => {
    return new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
})

/**
 * Obtiene la etiqueta legible del tipo de pregunta
 * @param type - Tipo de pregunta
 * @returns Etiqueta formateada
 */
const getQuestionTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        'TEXT': '📝 Texto libre',
        'YES_NO': '✅ Sí/No',
        'SINGLE_CHOICE': '🔘 Opción única',
        'MULTIPLE_CHOICE': '☑️ Múltiple selección',
        'SCALE': '📊 Escala',
        'NUMBER': '🔢 Numérico'
    }
    return labels[type] || type
}
</script>

<style scoped>
.response-analytics {
    padding: var(--spacing-lg);
}

.analytics-header {
    margin-bottom: var(--spacing-xl);
    text-align: center;
}

.analytics-header h3 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--text-primary);
    font-size: 1.5rem;
}

.analytics-header p {
    color: var(--text-secondary);
    margin: 0;
}

.loading-state {
    text-align: center;
    padding: var(--spacing-2xl);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto var(--spacing-lg) auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.analysis-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.analysis-summary {
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
    padding: var(--spacing-lg);
}

.summary-card h4 {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--text-primary);
}

.summary-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.summary-card li {
    padding: var(--spacing-xs) 0;
    color: var(--text-secondary);
}

.questions-analysis h4 {
    margin: 0 0 var(--spacing-lg) 0;
    color: var(--text-primary);
}

.question-analysis-card {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: var(--spacing-lg);
    background: var(--bg-primary);
    margin-bottom: var(--spacing-md);
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-md);
    gap: var(--spacing-md);
}

.question-header h5 {
    margin: 0;
    color: var(--text-primary);
    flex: 1;
    line-height: 1.4;
}

.question-type {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-size: 0.8rem;
    white-space: nowrap;
}

.analysis-placeholder {
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
    padding: var(--spacing-xl);
    text-align: center;
    border: 2px dashed var(--border-color);
}

.placeholder-content {
    color: var(--text-secondary);
}

.placeholder-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: var(--spacing-md);
}

.placeholder-content p {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--text-primary);
}

.placeholder-content small {
    color: var(--text-secondary);
    font-style: italic;
}

@media (max-width: 768px) {
    .response-analytics {
        padding: var(--spacing-md);
    }

    .question-header {
        flex-direction: column;
        align-items: stretch;
    }

    .question-type {
        align-self: flex-start;
    }
}
</style>
