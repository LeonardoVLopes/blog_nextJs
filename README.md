# Blog

Blog pessoal construído com **Next.js 16** (App Router), **React 19**, **TypeScript**, **SQLite** e **Drizzle ORM**.

## Stack

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| Next.js | 16.1.6 | Framework (App Router) |
| React | 19.2.3 | UI |
| TypeScript | 5.x | Tipagem estática |
| SQLite (better-sqlite3) | 12.6.2 | Banco de dados |
| Drizzle ORM | 0.45.1 | ORM + migrations |
| Tailwind CSS | 4 | Estilização |
| JWT (jose) | 6.2.3 | Autenticação |
| bcrypt | 6.0.0 | Hash de senha |
| Zod | 4.3.6 | Validação de dados |
| react-markdown | 10.1.0 | Renderização de Markdown |

## Funcionalidades

- **Página pública** — listagem de posts com destaque (hero) e grid de resumos
- **Post individual** — renderização segura de Markdown via `rehype-sanitize`
- **Editor Markdown WYSIWYG** — painel administrativo com editor visual (`@uiw/react-md-editor`)
- **Upload de imagens** — suporte a upload com preview e validação de tipo/tamanho
- **Autenticação JWT** — login com bcrypt, cookie `httpOnly` + `secure` + `SameSite=Strict`
- **Três camadas de segurança** — middleware, layout server e server actions verificam a sessão
- **Cache estratégico** — `"use cache"` para páginas públicas, `React.cache()` para dedup no admin
- **Design responsivo** — Tailwind CSS com tipografia aprimorada via `@tailwindcss/typography`
- **Modo escuro** — suporte nativo a `prefers-color-scheme: dark`

## Arquitetura

```
src/
├── app/                    # App Router (páginas e layouts)
│   ├── layout.tsx          # Layout raiz (Header, Container, Footer, Toast)
│   ├── page.tsx            # Homepage
│   ├── post/[slug]/        # Página pública de post
│   └── admin/              # Área administrativa (login, CRUD de posts)
│
├── actions/                # Server Actions (login, CRUD, upload)
├── components/             # Componentes React (Server e Client)
├── lib/                    # Lógica de negócio (auth, validações, queries)
├── models/                 # Modelos de domínio (postModel)
├── dto/                    # Objetos de transferência (PublicPost)
├── repositories/           # Repository Pattern (interface + implementações)
├── db/                     # Conexão SQLite, schemas e seed
├── utils/                  # Utilitários (formatação, slug, hash, etc.)
└── proxy.ts                # Middleware Next.js (proteção /admin/*)
```

### Repository Pattern

A camada de dados segue o **Repository Pattern** com uma interface (`PostRepository`) e implementações trocáveis:

- `DrizzlePostRepository` — implementação principal com SQLite + Drizzle ORM
- `JsonPostRepository` — implementação alternativa com arquivo JSON

### Separação Server / Client

Componentes são propositalmente divididos:

- **Server Components** (padrão) — fazem data fetching direto, acessam BD, renderizam HTML no servidor
- **Client Components** (`"use client"`) — têm estado, efeitos, listeners, hooks de roteador

## Setup

```sh
# 1. Instalar dependências
npm i

# 2. Configurar variáveis de ambiente
cp .env.EXAMPLE .env
# Edite .env com seus valores (JWT_SECRET_KEY, LOGIN_USER, LOGIN_PASS, etc.)
# Use `npx tsx src/utils/generate-hashed-password.ts` para gerar o hash da senha

# 3. Rodar migrations
npm run migrate

# 4. (Opcional) Popular com dados de exemplo
npm run seed

# 5. Iniciar em desenvolvimento
npm run dev

# 6. Build para produção
npm run build
npm start
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `JWT_SECRET_KEY` | Chave secreta para assinar os tokens JWT |
| `LOGIN_USER` | Nome de usuário do admin |
| `LOGIN_PASS` | Hash bcrypt da senha (base64) |
| `LOGIN_EXPIRATION_SECONDS` | Tempo de expiração do login (ex: 3600 = 1h) |
| `ALLOW_LOGIN` | Habilita/desabilita login (1 ou 0) |
| `IMAGE_UPLOAD_DIRECTORY` | Pasta para upload de imagens |
| `IMAGE_SERVER_URL` | URL base do servidor de imagens |
| `NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE` | Tamanho máximo de upload (bytes) |

## Comandos

```sh
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run start     # Iniciar servidor de produção
npm run lint      # Verificar código com ESLint
npm run migrate   # Rodar migrations do Drizzle
npm run seed      # Popular banco com dados de exemplo
```

## Licença

Projeto privado.
