<template>
  <section v-if="chartData.labels.length" class="card">
    <p class="eyebrow">Visualização</p>
    <h2>Distribuição de contatos por domínio</h2>

    <div class="chart-wrapper">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  groups: {
    type: Array,
    default: () => []
  }
})

const chartData = computed(() => ({
  labels: props.groups.map(g => g.domain),
  datasets: [
    {
      data: props.groups.map(g => g.count),
      backgroundColor: [
        '#7c3aed',
        '#6366f1',
        '#22c55e',
        '#06b6d4',
        '#f59e0b',
        '#ef4444',
        '#ec4899',
        '#14b8a6',
        '#a855f7',
        '#3b82f6',
        '#84cc16'
      ]
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>