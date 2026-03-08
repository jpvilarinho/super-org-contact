<template>
  <section class="card">
    <div class="card-header">
      <div>
        <p class="eyebrow">Google OAuth2</p>
        <h2>Autenticação</h2>
      </div>
      <span :class="['status-badge', isAuthenticated ? 'success' : 'neutral']">
        {{ isAuthenticated ? 'Conectado' : 'Não autenticado' }}
      </span>
    </div>

    <p class="muted">
      Faça login com sua conta Google para permitir a leitura dos seus contatos reais.
    </p>

    <div class="actions">
      <button class="btn primary" @click="$emit('login')" :disabled="loading">
        {{ loading ? 'Conectando...' : 'Entrar com Google' }}
      </button>

      <button
        v-if="isAuthenticated"
        class="btn ghost"
        @click="$emit('logout')"
        :disabled="loading"
      >
        Limpar sessão local
      </button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['login', 'logout'])
</script>