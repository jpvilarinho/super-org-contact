<template>
  <section class="card">
    <div class="search-wrapper">
      <div>
        <p class="eyebrow">Filtro</p>
        <h2>Pesquisar domínio, nome ou e-mail</h2>
      </div>

      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="search-input"
        type="text"
        placeholder="Ex.: gmail.com, João ou contato@empresa.com"
      />
    </div>
  </section>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>