<template>
  <div class="page-shell">
    <header class="hero">
      <p class="eyebrow">Teste Técnico</p>
      <h1>Super Org Contact</h1>
      <p class="hero-text">
        Aplicação Vue para autenticar com Google, consumir contatos reais via People API
        e agrupá-los por domínio de e-mail.
      </p>
    </header>

    <main class="content-grid">
      <AuthSection
        :is-authenticated="isAuthenticated"
        :loading="authLoading || contactsLoading"
        @login="handleGoogleLogin"
        @logout="handleLogout"
      />

      <section v-if="errorMessage" class="card error-card">
        <p class="eyebrow">Erro</p>
        <h2>Não foi possível concluir a operação</h2>
        <p>{{ errorMessage }}</p>
      </section>

      <section v-if="contactsLoading" class="card">
        <p class="eyebrow">Processando</p>
        <h2>Buscando contatos...</h2>
        <p class="muted">Aguarde enquanto os dados são carregados da Google People API.</p>
      </section>

      <template v-if="isAuthenticated && !contactsLoading">
        <ContactsOverview
          :total-contacts="normalizedContacts.length"
          :grouped-domains="filteredGroupedDomains"
        />

        <DomainChart :groups="filteredGroupedDomains" />

        <SearchBar v-model="searchTerm" />

        <DomainGroups :groups="filteredGroupedDomains" />
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AuthSection from './components/auth-section.vue'
import ContactsOverview from './components/contacts-overview.vue'
import DomainGroups from './components/domain-groups.vue'
import DomainChart from './components/domain-chart.vue'
import SearchBar from './components/search-bar.vue'
import { fetchAllContacts } from './services/people-api'
import {
  filterGroupedDomains,
  groupContactsByDomain,
  normalizeContacts,
} from './utils/contact-utils'

const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/contacts.readonly'
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

const rawContacts = ref([])
const searchTerm = ref('')
const authLoading = ref(false)
const contactsLoading = ref(false)
const errorMessage = ref('')
const accessToken = ref('')
const tokenClient = ref(null)
const googleLoaded = ref(false)

const isAuthenticated = computed(() => !!accessToken.value)

const normalizedContacts = computed(() => normalizeContacts(rawContacts.value))
const groupedDomains = computed(() => groupContactsByDomain(normalizedContacts.value))
const filteredGroupedDomains = computed(() =>
  filterGroupedDomains(groupedDomains.value, searchTerm.value)
)

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (globalThis.google?.accounts?.oauth2) {
      googleLoaded.value = true
      resolve()
      return
    }

    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`)

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        googleLoaded.value = true
        resolve()
      })
      existingScript.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.src = GOOGLE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => {
      googleLoaded.value = true
      resolve()
    }
    script.onerror = () => reject(new Error('Falha ao carregar Google Identity Services'))
    document.head.appendChild(script)
  })
}

function initializeGoogleTokenClient() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    throw new Error('A variável VITE_GOOGLE_CLIENT_ID não foi configurada.')
  }

  if (!globalThis.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services não está disponível.')
  }

  tokenClient.value = globalThis.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: GOOGLE_SCOPE,
    callback: async (response) => {
      if (response?.error) {
        errorMessage.value = `Erro na autenticação Google: ${response.error}`
        authLoading.value = false
        return
      }

      accessToken.value = response.access_token
      authLoading.value = false

      await loadContacts()
    },
  })
}

async function loadContacts() {
  try {
    contactsLoading.value = true
    errorMessage.value = ''

    const contacts = await fetchAllContacts(accessToken.value)
    rawContacts.value = contacts
  } catch (error) {
    rawContacts.value = []
    errorMessage.value = error?.message || 'Erro inesperado ao buscar contatos.'
  } finally {
    contactsLoading.value = false
  }
}

async function handleGoogleLogin() {
  try {
    errorMessage.value = ''
    authLoading.value = true

    if (!googleLoaded.value) {
      await loadGoogleScript()
    }

    if (!tokenClient.value) {
      initializeGoogleTokenClient()
    }

    tokenClient.value.requestAccessToken({
      prompt: 'consent',
    })
  } catch (error) {
    errorMessage.value = error?.message || 'Erro ao iniciar autenticação Google.'
    authLoading.value = false
  }
}

function handleLogout() {
  accessToken.value = ''
  rawContacts.value = []
  searchTerm.value = ''
  errorMessage.value = ''

  if (globalThis.google?.accounts?.oauth2 && accessToken.value) {
    globalThis.google.accounts.oauth2.revoke(accessToken.value)
  }
}

onMounted(async () => {
  try {
    await loadGoogleScript()
    initializeGoogleTokenClient()
  } catch (error) {
    errorMessage.value =
      error?.message || 'Não foi possível inicializar o Google Identity Services.'
  }
})
</script>