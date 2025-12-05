# OSRS Recipe Master V2 — Copilot Instructions

## Visão Geral do Projeto

Este é um aplicativo web Nuxt 4 para gerenciamento de receitas de itens do OSRS (Old School RuneScape). Utiliza Vue 3, Pinia para gerenciamento de estado, Tailwind CSS para estilização e shadcn-vue/reka-ui para componentes de UI. A arquitetura é modular:

- Primitivos de UI: `app/components/ui/` (exportados via `index.ts`)
- Componentes de lógica de negócio: `app/components/base/`
- Tipos compartilhados: `shared/types/`

## Padrões Arquiteturais

- **Organização de Componentes:**
  - Primitivos de UI (botões, cards, dialogs, etc.) em `app/components/ui/`, exportados por `index.ts`.
  - Lógica de negócio e componentes de receita em `app/components/base/`.
  - Tipos compartilhados em `shared/types/`.
- **Gerenciamento de Estado:**
  - Pinia stores em `app/stores/useItemsStore.ts` e `app/stores/useRecipesStore.ts`.
- **Estilização:**
  - Tailwind CSS em `app/assets/css/tailwind.css` (referenciado em `nuxt.config.ts`).
- **UI Libraries:**
  - shadcn-vue e reka-ui para UI. Registro de componentes e aliases em `components.json`.

## Fluxos de Trabalho do Desenvolvedor

- **Instalar dependências:**
  - `bun install` (ou `npm/pnpm/yarn install`)
- **Servidor de desenvolvimento:**
  - `bun run dev` (ou `npm run dev` etc.)
- **Build para produção:**
  - `bun run build` (ou `npm run build` etc.)
- **Preview da build:**
  - `bun run preview` (ou `npm run preview` etc.)
- **Lint:**
  - ESLint via `@nuxt/eslint` (ver `nuxt.config.ts`).

## Convenções do Projeto

- **Importação de Componentes:**
  - Sempre importe primitivos de UI via seus `index.ts` (ex: `import { Button } from '@/components/ui/button'`).
- **TypeScript:**
  - Todos os componentes e stores usam TypeScript. Tipos em `shared/types/`.
- **Aliases:**
  - Use aliases Nuxt conforme `components.json` (ex: `@/components`, `@/lib/utils`).
- **Props/Emits:**
  - Use `defineProps`/`defineEmits` e helpers do reka-ui para props e eventos.
- **Fluxo de Dados:**
  - Dados de receita fluem dos stores Pinia para componentes via props e v-model.
- **Requisições/API:**
  - Sempre consulte a documentação oficial do Nuxt para escolher a melhor abordagem de fetch/requisições (ex: useFetch, $fetch, composables, SSR/caching). Priorize métodos recomendados para SSR, reatividade e performance.

## Integrações

- **Bibliotecas externas:**
  - shadcn-vue, reka-ui, lucide-vue-next (ícones), @vueuse/core (composables).
- **Módulos Nuxt:**
  - Veja `nuxt.config.ts` para módulos habilitados (ex: `@nuxt/eslint`, `@pinia/nuxt`).

## Exemplos

- **Uso de UI Primitives:**
  - Veja `app/components/base/RecipeCard.vue` e `RecipeForm.vue` para composição de UI e lógica.
- **Uso de State:**
  - Veja `app/app.vue` para uso de stores e renderização de receitas.

## Troubleshooting

- Se `bun run dev` falhar, cheque dependências ou aliases em `components.json` e `nuxt.config.ts`.
- Para problemas de registro de componentes, verifique `components.json` e configuração do shadcn-vue.

## Referências

- Arquivos-chave: `nuxt.config.ts`, `components.json`, `app/components/ui/`, `app/components/base/`, `shared/types/`, `app/stores/`
- Para mais, veja README.md e a documentação do Nuxt.
