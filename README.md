# Super Org Contact

Aplicação web desenvolvida em Vue 3 para autenticação com Google OAuth2, leitura de contatos reais via Google People API e agrupamento por domínio de e-mail.

Deploy em produção: `https://vite-technical-challenge.web.app`

---

## Objetivo

Este projeto foi desenvolvido como resposta para um teste técnico , com foco em:

- autenticação com Google
- consumo de dados reais da Google People API
- leitura de contatos do usuário autenticado
- agrupamento de contatos por domínio de e-mail
- exibição dos resultados de forma clara e organizada

---

## Funcionalidades

- Login com Google OAuth2
- Consumo da Google People API
- Leitura de contatos reais do usuário autenticado
- Normalização de contatos com nome, e-mail e domínio
- Agrupamento de contatos por domínio de e-mail
- Estatísticas rápidas no dashboard
- Filtro por domínio, nome ou e-mail
- Gráfico de distribuição por domínio
- Interface responsiva
- Deploy em produção via Firebase Hosting

---

## Stack utilizada

- Vue 3
- Vite
- Google Identity Services
- Google People API
- Chart.js
- vue-chartjs
- Firebase Hosting

---

## Estrutura do projeto

```text
src/
  components/
    auth-section.vue
    contacts-overview.vue
    domain-chart.vue
    domain-groups.vue
    search-bar.vue
  services/
    people-api.js
  utils/
    contact-utils.js
  App.vue
  main.js
  style.css
```

---

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/jpvilarinho/super-org-contact.git
cd super-org-contact
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar o arquivo .env

Crie um arquivo .env na raiz do projeto com:

```bash
VITE_GOOGLE_CLIENT_ID=SEU_CLIENT_ID_AQUI
```

### 4. Subir o projeto localmente

```bash
npm run dev
```

A aplicação ficará disponível em: `http://localhost:5173`

---

## Configuração do Google Cloud

### 1. Criar um projeto no Google Cloud

Acesse o Google Cloud Console e crie um projeto para a aplicação.

### 2. Configurar a tela de consentimento OAuth

No menu do **Google Cloud**, vá em:

Google Auth Platform > Branding ou, dependendo da interface:
APIs e serviços > Tela de permissão OAuth

Preencha pelo menos:

- App name: nome da aplicação
- User support email: e-mail a ser utilizado
- Developer contact information: seu e-mail

Depois salve a configuração.

Se a aplicação estiver em modo de teste, adicione os e-mails permitidos em:

**Google Auth Platform** > **Audience** > **Test users**

Assim, somente esses usuários poderão autenticar durante o desenvolvimento.

### 3. Habilitar a Google People API

No Google Cloud Console, vá em:

**APIs e serviços** > **Biblioteca**

Procure por **Google People API** e clique em **Ativar**. A **People API** é a API usada para ler os contatos do usuário autenticado.

### 4. Criar a credencial OAuth

No Google Cloud Console, vá em:

Google Auth Platform > Clients
ou, dependendo da interface:
APIs e serviços > Credenciais

Clique em:

Criar credenciais > ID do cliente OAuth

Selecione:

- Application type: Web application
- Defina um nome para a credencial, por exemplo: **Super Org Contact Web Client**

Authorized JavaScript origins

Adicione os domínios/origens que podem iniciar a autenticação no navegador:

`http://localhost:5173` e `https://vite-technical-challenge.web.app`

Authorized redirect URIs

Adicione redirect URIs somente se sua implementação usar redirect/code flow.
Se o projeto estiver usando autenticação por popup/token flow no front-end, normalmente os origins acima já são o principal requisito.

Se quiser deixar configurado por segurança para um fluxo com redirect, use:

`http://localhost:5173` e `https://vite-technical-challenge.web.app`

Depois clique em Create e copie o Client ID gerado.

### 5. Configurar o .env

Crie um arquivo .env na raiz do projeto com:

```bash
VITE_GOOGLE_CLIENT_ID=SEU_CLIENT_ID_AQUI
```

---

## Configuração do Firebase Hosting

### 1. Instalar CLI

```bash
npm install -g firebase-tools
```

---

### 2. Login

```bash
firebase login
```

---

### 3. Inicializar hosting

```bash
firebase init hosting
```

Configuração utilizada:

```bash
public directory: dist
single-page app: yes
github actions: no
```

---

### 4. Build do projeto

```bash
npm run build
```

---

### 5. Deploy

```bash
firebase deploy
```

A aplicação ficará disponível em: `https://vite-technical-challenge.web.app`

---

## Conta utilizada nos testes

Durante o desenvolvimento e a homologação local, foi utilizada uma conta de teste separada: `superorgcontact.test@gmail.com`

**Importante: nenhuma senha ou dado sensível deve ser armazenado no repositório, no README ou em commits.**

Escopo OAuth utilizado

`https://www.googleapis.com/auth/contacts.readonly`

---

## Fluxo da aplicação

o usuário clica em **“Entrar com Google”**
a aplicação solicita consentimento via **Google Identity Services**
o Google retorna um access_token
a aplicação chama a **Google People API**
os contatos são normalizados
os e-mails são agrupados por domínio
os dados são exibidos em cards, gráfico e lista agrupada

Regras de tratamento dos dados

- contatos sem e-mail são ignorados
- e-mails inválidos são ignorados
- e-mails duplicados são removidos dentro do agrupamento
- um contato com múltiplos e-mails pode apare
- os domínios são ordenados por quantidade de contatos, em ordem decrescente

---

## Como testar manualmente

Cenários básicos

- autenticar com uma conta Google válida
- carregar contatos reais
- validar os cards de totalização
- validar o agrupamento por domínio
- validar a ordenação dos grupos
- validar o filtro por domínio
- validar o filtro por nome
- validar o filtro por e-mail

Cenários adicionais

- contato sem e-mail não deve aparecer
- contato com dois e-mails deve contar em dois domínios
- e-mails duplicados devem ser deduplicados
- após logout e novo login, os dados devem ser carregados novamente
