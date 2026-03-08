<template>
  <section class="overview-grid">
    <article class="card stat-card">
      <p class="eyebrow">Contatos normalizados</p>
      <h3>{{ totalContacts }}</h3>
      <p class="muted">Total de registros válidos com nome, e-mail e domínio.</p>
    </article>

    <article class="card stat-card">
      <p class="eyebrow">Domínios encontrados</p>
      <h3>{{ totalDomains }}</h3>
      <p class="muted">Quantidade de domínios distintos identificados nos contatos.</p>
    </article>

    <article class="card stat-card">
      <p class="eyebrow">Maior grupo</p>
      <h3>{{ topDomainLabel }}</h3>
      <p class="muted">Domínio com mais contatos agrupados.</p>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalContacts: {
    type: Number,
    default: 0,
  },
  groupedDomains: {
    type: Array,
    default: () => [],
  },
})

const totalDomains = computed(() => props.groupedDomains.length)

const topDomainLabel = computed(() => {
  if (!props.groupedDomains.length) {
    return '-'
  }

  const top = props.groupedDomains[0]
  return `${top.domain} (${top.count})`
})
</script>