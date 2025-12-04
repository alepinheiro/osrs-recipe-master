# OSRS Recipe Master V2 — AI Agent Instructions

## Project Overview

This is a Nuxt 4 web application for managing OSRS (Old School RuneScape) item recipes. It uses Vue 3, Pinia for state management, Tailwind CSS for styling, and shadcn-vue/reka-ui for UI components. The architecture is modular, with UI primitives in `app/components/ui/`, business logic in `app/components/base/`, and shared types in `shared/types/`.

## Key Architectural Patterns

- **Component Organization:**
  - UI primitives (buttons, cards, dialogs, etc.) are in `app/components/ui/` and exported via `index.ts` files for easy import.
  - Business logic and recipe-specific components are in `app/components/base/`.
  - Shared types for recipes/items are in `shared/types/`.
- **State Management:**
  - Uses Pinia stores (`app/stores/useItemsStore.ts`, `app/stores/useRecipesStore.ts`).
- **Styling:**
  - Tailwind CSS is configured in `app/assets/css/tailwind.css` and referenced in `nuxt.config.ts`.
- **UI Libraries:**
  - Uses shadcn-vue and reka-ui for composable UI primitives. Component registry and aliases are defined in `components.json`.

## Developer Workflows

- **Install dependencies:**
  - `bun install` (or `npm/pnpm/yarn install`)
- **Development server:**
  - `bun run dev` (or `npm run dev`, etc.)
- **Build for production:**
  - `bun run build` (or `npm run build`, etc.)
- **Preview production build:**
  - `bun run preview` (or `npm run preview`, etc.)
- **Linting:**
  - ESLint is enabled via `@nuxt/eslint` (see `nuxt.config.ts`).

## Project-Specific Conventions

- **Component Imports:**
  - Always import UI primitives from their respective `index.ts` barrel files (e.g., `import { Button } from '@/components/ui/button'`).
- **TypeScript:**
  - All components and stores use TypeScript. Shared types are in `shared/types/`.
- **Aliases:**
  - Use Nuxt aliases as defined in `components.json` (e.g., `@/components`, `@/lib/utils`).
- **Props/Emits:**
  - Use `defineProps`/`defineEmits` and composable helpers from reka-ui for prop forwarding and event handling.
- **Data Flow:**
  - Recipe data flows from Pinia stores to components via props and v-model.
- **API Requests:**
  - Sempre consulte a documentação oficial do Nuxt para escolher a melhor abordagem de fetch/requisições (ex: useFetch, $fetch, composables, SSR/caching). Priorize métodos recomendados para SSR, reatividade e performance.

## Integration Points

- **External Libraries:**
  - shadcn-vue, reka-ui, lucide-vue-next (icons), @vueuse/core (composables).
- **Nuxt Modules:**
  - See `nuxt.config.ts` for enabled modules (e.g., `@nuxt/eslint`, `@pinia/nuxt`).

## Examples

- **UI Primitive Usage:**
  - `app/components/base/RecipeCard.vue` and `RecipeForm.vue` show how to compose UI primitives and business logic.
- **State Usage:**
  - `app/app.vue` demonstrates store usage and recipe rendering.

## Troubleshooting

- If `bun run dev` fails, check for missing dependencies or misconfigured aliases in `components.json` and `nuxt.config.ts`.
- For component registry issues, verify `components.json` and shadcn-vue configuration.

## References

- Key files: `nuxt.config.ts`, `components.json`, `app/components/ui/`, `app/components/base/`, `shared/types/`, `app/stores/`
  For more, see README.md and Nuxt documentation.
