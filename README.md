# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Commit Message Convention

Este projeto exige que todos os commits sigam o padrão [Conventional Commits](https://www.conventionalcommits.org/pt/v1.0.0/).

**Exemplo de mensagem de commit:**

```
feat: adiciona busca por itens na tela principal
fix: corrige erro ao salvar receita
chore: atualiza dependências do projeto
```

**Tipos comuns:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudança na documentação
- `style`: Formatação, sem alteração de código
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção

Consulte [Conventional Commits](https://www.conventionalcommits.org/pt/v1.0.0/) para detalhes e exemplos.

## Reutilização de Componentes

Antes de implementar um novo componente, **sempre verifique** se já existe algo reutilizável nas pastas `app/components/ui/` ou `app/components/base/`. Priorize a reutilização e extensão de componentes existentes para manter o projeto consistente e evitar duplicidade.

- Consulte os arquivos `index.ts` das pastas de componentes para saber o que está disponível para importação.
- Caso não exista um componente adequado, siga os padrões do projeto para criar um novo.
