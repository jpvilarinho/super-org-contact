<template>
  <section class="card">
    <div class="card-header">
      <div>
        <p class="eyebrow">Resultado</p>
        <h2>Contatos agrupados por domínio</h2>
      </div>

      <span class="status-badge neutral">
        {{ groups.length }} grupo(s)
      </span>
    </div>

    <div v-if="!groups.length" class="empty-state">
      Nenhum contato encontrado para o filtro atual.
    </div>

    <div v-else class="domain-groups">
      <details v-for="group in groups" :key="group.domain" class="domain-group">
        <summary>
          <div class="domain-summary-left">
            <strong>{{ group.domain }}</strong>
            <span class="muted">{{ group.count }} contato(s)</span>
          </div>
          <span class="expand-hint">Expandir</span>
        </summary>

        <ul class="contacts-list">
          <li v-for="contact in group.contacts" :key="`${group.domain}-${contact.email}`">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-email">{{ contact.email }}</div>
          </li>
        </ul>
      </details>
    </div>
  </section>
</template>

<script setup>
defineProps({
  groups: {
    type: Array,
    default: () => [],
  },
})
</script>