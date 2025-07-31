<!--
/**
 * Renderizador de gráficos genérico
 * @description Componente que detecta automáticamente el tipo de pregunta y renderiza el gráfico apropiado
 * @component ChartRenderer
 */
-->
<template>
  <div class="chart-renderer">
    <!-- Título de la pregunta -->
    <div class="question-header">
      <h3 class="question-text">{{ questionData.questionText }}</h3>
      <div class="question-meta">
        <span class="question-type">{{ getQuestionTypeLabel(questionData.questionType) }}</span>
        <span class="total-answers">{{ questionData.totalAnswers }} respuestas</span>
      </div>
    </div>

    <!-- Gráfico -->
    <div class="chart-container">
      <!-- Gráfico de barras horizontales para TEXT -->
      <div v-if="questionData.questionType === 'TEXT'" class="chart-wrapper">
        <apexchart type="bar" :options="horizontalBarOptions" :series="horizontalBarSeries" height="200" />
      </div>

      <!-- Gráfico donut para SINGLE_CHOICE y MULTIPLE_CHOICE -->
      <div v-else-if="isChoiceType" class="chart-wrapper">
        <apexchart type="donut" :options="donutOptions" :series="donutSeries" height="300" />
      </div>

      <!-- Gráfico de barras simples para YES_NO -->
      <div v-else-if="questionData.questionType === 'YES_NO'" class="chart-wrapper">
        <apexchart type="bar" :options="yesNoBarOptions" :series="yesNoBarSeries" height="200" />
      </div>

      <!-- Gráfico de barras para SCALE y NUMBER -->
      <div v-else-if="isNumericType" class="chart-wrapper">
        <apexchart type="bar" :options="statisticsBarOptions" :series="statisticsBarSeries" height="250" />

        <!-- Tabla de estadísticas -->
        <div class="statistics-table">
          <h4 class="stats-title">Estadísticas Detalladas</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Promedio</span>
              <span class="stat-value">{{ formatNumber(questionData.analysis.average) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Mediana</span>
              <span class="stat-value">{{ formatNumber(questionData.analysis.median) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Moda</span>
              <span class="stat-value">{{ formatNumber(questionData.analysis.mode) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Mínimo</span>
              <span class="stat-value">{{ formatNumber(questionData.analysis.minimum) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Máximo</span>
              <span class="stat-value">{{ formatNumber(questionData.analysis.maximum) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Desv. Estándar</span>
              <span class="stat-value">{{ formatNumber(questionData.analysis.standardDeviation) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { QuestionAnalysis } from '../../types/question'

// Carga dinámica - solo se carga cuando se usa
const apexchart = defineAsyncComponent(() => import('vue3-apexcharts'))



const props = defineProps<{
  questionData: QuestionAnalysis
}>()

// Colores del sistema
const primaryColor = '#f2994a' // --primary-color
const secondaryColor = '#6fcf97' // --secondary-color
const colorPalette = [primaryColor, secondaryColor, '#e74c3c', '#3498db', '#9b59b6', '#1abc9c', '#f39c12']

// Computed properties para tipos
const isChoiceType = computed(() =>
  ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(props.questionData.questionType)
)

const isNumericType = computed(() =>
  ['SCALE', 'NUMBER'].includes(props.questionData.questionType)
)

// Configuración para gráfico de barras horizontales (TEXT)
const horizontalBarSeries = computed(() => {
  if (!props.questionData.analysis.topWords) return []

  return [{
    name: 'Frecuencia',
    data: props.questionData.analysis.topWords.map(item => ({
      x: item.word,
      y: item.count
    }))
  }]
})

const horizontalBarOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: true },
    animations: { enabled: true }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      distributed: true
    }
  },
  colors: colorPalette,
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val} veces`
  },
  xaxis: {
    title: { text: 'Frecuencia de uso' }
  },
  yaxis: {
    title: { text: 'Palabras' }
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} veces mencionada`
    }
  },
  legend: { show: false }
}))

// Configuración para gráfico donut (CHOICE)
const donutSeries = computed(() => {
  if (!props.questionData.analysis.optionCounts) return []
  return Object.values(props.questionData.analysis.optionCounts)
})

const donutOptions = computed(() => ({
  chart: {
    type: 'donut',
    animations: { enabled: true }
  },
  labels: props.questionData.analysis.optionCounts ? Object.keys(props.questionData.analysis.optionCounts) : [],
  colors: colorPalette,
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: () => `${props.questionData.totalAnswers}`
          }
        }
      }
    }
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center'
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} respuestas`
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      legend: { position: 'bottom' }
    }
  }]
}))

// Configuración para gráfico de barras YES_NO
const yesNoBarSeries = computed(() => {
  if (!props.questionData.analysis.optionCounts) return []

  const data = Object.entries(props.questionData.analysis.optionCounts).map(([key, value]) => ({
    x: key === 'true' ? 'Sí' : 'No',
    y: value
  }))

  return [{
    name: 'Respuestas',
    data
  }]
})

const yesNoBarOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: true },
    animations: { enabled: true }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      distributed: true,
      columnWidth: '50%'
    }
  },
  colors: [primaryColor, secondaryColor],
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val}`
  },
  xaxis: {
    title: { text: 'Opciones' }
  },
  yaxis: {
    title: { text: 'Cantidad de respuestas' }
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} respuestas`
    }
  },
  legend: { show: false }
}))

// Configuración para gráfico de estadísticas (SCALE/NUMBER)
const statisticsBarSeries = computed(() => {
  const analysis = props.questionData.analysis
  return [{
    name: 'Valor',
    data: [
      { x: 'Promedio', y: analysis.average || 0 },
      { x: 'Mediana', y: analysis.median || 0 },
      { x: 'Moda', y: analysis.mode || 0 }
    ]
  }]
})

const statisticsBarOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: true },
    animations: { enabled: true }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      distributed: true,
      columnWidth: '70%'
    }
  },
  colors: colorPalette,
  dataLabels: {
    enabled: true,
    formatter: (val: number) => formatNumber(val)
  },
  xaxis: {
    title: { text: 'Estadísticas' }
  },
  yaxis: {
    title: { text: 'Valor' }
  },
  tooltip: {
    y: {
      formatter: (val: number) => formatNumber(val)
    }
  },
  legend: { show: false }
}))

// Funciones auxiliares
const getQuestionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'TEXT': 'Texto',
    'SINGLE_CHOICE': 'Opción única',
    'MULTIPLE_CHOICE': 'Opción múltiple',
    'YES_NO': 'Sí/No',
    'SCALE': 'Escala',
    'NUMBER': 'Numérico'
  }
  return labels[type] || type
}

const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return '0'
  return num.toFixed(2)
}
</script>

<style scoped>
.chart-renderer {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.question-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.question-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  box-shadow: var(--shadow);
}

.question-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.question-type {
  background: var(--primary-color, #f2994a);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.total-answers {
  color: var(--text-secondary, #64748b);
  font-size: 0.9rem;
  font-weight: 500;
}

.chart-container {
  margin-top: 1rem;
}

.chart-wrapper {
  margin-bottom: 1rem;
}

/* Tabla de estadísticas */
.statistics-table {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f1f5f9;
}

.stats-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0 0 1rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary, #64748b);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.stat-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color, #f2994a);
}

/* Responsive */
@media (max-width: 768px) {
  .chart-renderer {
    padding: 1rem;
  }

  .question-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
