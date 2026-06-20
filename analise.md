# Análise do Projeto Blog

## Stack

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| Next.js | 16.1.6 | Framework (App Router) |
| React | 19.2.3 | UI |
| TypeScript | 5.x | Tipagem |
| SQLite (better-sqlite3) | 12.6.2 | Banco de dados |
| Drizzle ORM | 0.45.1 | ORM + migrations |
| Tailwind CSS | v4 | Estilização |
| JWT (jose) | 6.2.3 | Autenticação |
| bcrypt | 6.0.0 | Hash de senha |
| Zod | 4.3.6 | Validação |
| react-markdown + rehype-sanitize | - | Renderização segura de Markdown |

---

## 1. Arquitetura — Análise Detalhada

### 1.1 Mapa de Módulos e Dependências

```
src/
├── proxy.ts                          # Middleware Next.js (filtro /admin/*)
│
├── app/                              # APP ROUTER (páginas + layouts)
│   ├── layout.tsx                    # Root layout (Header, Container, Footer, Toast)
│   ├── page.tsx                      # Homepage — busca posts, rende Postfeatured + PostsList
│   ├── error.tsx                     # Error boundary global (client)
│   ├── not-found.tsx                 # Página 404 (server)
│   ├── loading.tsx                   # Loading state (server)
│   │
│   ├── post/[slug]/page.tsx          # Página pública de post individual
│   │
│   └── admin/
│       ├── login/page.tsx            # Página de login
│       └── post/
│           ├── layout.tsx            # Layout admin — requireLoginSessionOrRedirect()
│           ├── page.tsx              # Listagem admin de posts
│           ├── new/page.tsx          # Criar post
│           └── [id]/page.tsx         # Editar post
│
├── actions/                          # SERVER ACTIONS (mutação)
│   ├── login/
│   │   ├── login-action.ts           # Login — bcrypt verify + JWT sign + cookie
│   │   └── logout-action.ts          # Logout — delete cookie
│   ├── post/
│   │   ├── create-post-action.ts     # Criar post
│   │   ├── update-post-action.ts     # Atualizar post
│   │   └── delete-post-action.ts     # Deletar post
│   └── upload/
│       └── upload-image-action.ts    # Upload de imagem
│
├── components/                       # COMPONENTES REACT
│   ├── Header/                       # Server — cabeçalho do site
│   ├── Footer/                       # Client — rodapé com ano (hydration-safe)
│   ├── Container/                    # Server — wrapper de layout
│   ├── Button/                       # Server — botão reutilizável (variants, sizes)
│   ├── InputText/                    # Server — input com label + useId
│   ├── InputCheckBox/                # Server — checkbox com label + useId
│   ├── MarkdownEditor/               # Client — editor MD WYSIWYG (dynamic import, ssr:false)
│   ├── SafeMarkdown/                 # Server — renderização MD sanitizada
│   ├── PostDate/                     # Client — data formatada + tooltip relativo
│   ├── PostHeading/                  # Server — heading com link
│   ├── PostCoverImg/                 # Server — next/image com hover zoom
│   ├── PostSummary/                  # Server — card de resumo de post
│   ├── PostFeatured/                 # Server async — post em destaque (hero)
│   ├── PostsList/                    # Server async — grid de posts
│   ├── SinglePost/                   # Server async — post completo
│   ├── ErrorMessage/                 # Client — display de erro/empty
│   ├── Dialog/                       # Client — modal de confirmação (ARIA)
│   ├── SpinLoader/                   # Server — loader CSS
│   ├── ToastifyContainer/            # Client — container de toast
│   │
│   └── Admin/
│       ├── MenuAdmin/                # Client — navegação admin responsiva
│       ├── LoginForm/                # Client — formulário de login (useActionState)
│       ├── ImageUploader/            # Client — upload com preview
│       ├── ManagePostForm/           # Client — form CRUD de posts
│       ├── PostsListAdmin/           # Server async — listagem admin
│       └── DeletePostButton/         # Client — botão deletar com confirmação
│
├── lib/                              # LÓGICA DE NEGÓCIO
│   ├── constants.ts                  # Constantes default (simul delay, upload config)
│   ├── login/
│   │   └── manage-login.ts           # Auth: hash, JWT sign/verify, cookie management
│   └── post/
│       ├── validations.ts            # Schemas Zod (PostCreateSchema, PostUpdateSchema)
│       └── queries/
│           ├── public.ts             # Queries públicas com "use cache" + cacheTag
│           └── admin.ts              # Queries admin com React cache()
│
├── models/
│   └── post/post-model.ts            # Tipo postModel (11 campos)
│
├── dto/
│   └── dto.ts                        # PublicPost DTO + factories
│
├── repositories/                     # REPOSITORY PATTERN
│   └── post/
│       ├── post-repository.ts        # Interface (7 métodos)
│       ├── drizzle-post-repository.ts # Implementação SQLite/Drizzle
│       ├── json-post-repository.ts   # Implementação JSON file
│       └── index.ts                  # Singleton: new DrizzlePostRepository()
│
├── db/
│   └── drizzle/
│       ├── index.ts                  # Conexão better-sqlite3 + Drizzle
│       ├── schemas.ts                # Schema da tabela posts
│       └── seed.ts                   # Script de seed (lê de posts.json)
│
└── utils/
    ├── format-datetime.ts            # date-fns pt-BR
    ├── generate-hashed-password.ts   # CLI para gerar hash bcrypt
    ├── make-slug-from-text.ts        # slugify + random suffix
    ├── make-random-string.ts         # [BUG] sempre retorna undefined
    ├── get-zod-error-messages.ts     # Extrai mensagens de erro do Zod
    ├── is-url-or-relative-path.ts    # Validador URL + safe relative path
    ├── async-daley.ts                # Delay artificial (dev + anti-brute-force)
    └── log-color.ts                  # Console log colorido
```

### 1.2 Árvore de Componentes (Renderização)

```
RootLayout (server) ─── <html> → <body>
  ├── Container (server)
  │   ├── Header (server)
  │   ├── [children]
  │   │   │
  │   │   ├── HomePage (server async)
  │   │   │   └── Suspense
  │   │   │       ├── Postfeatured (server async)
  │   │   │       │   ├── PostCoverImg (server)
  │   │   │       │   └── PostSummary (server)
  │   │   │       └── PostsList (server async)
  │   │   │           └── PostCoverImg + PostSummary (por post)
  │   │   │
  │   │   ├── PostSlugPage (server async)
  │   │   │   └── Suspense
  │   │   │       └── SinglePost (server async)
  │   │   │           ├── PostHeading (server)
  │   │   │           └── SafeMarkdown (server)
  │   │   │
  │   │   ├── AdminLoginPage (server)
  │   │   │   └── LoginForm (client) ← useActionState(loginAction)
  │   │   │
  │   │   └── AdminPostLayout (server async) ← requireLoginSessionOrRedirect()
  │   │       ├── MenuAdmin (client) ← logoutAction via useTransition
  │   │       └── [children]
  │   │           ├── AdminPostPage (server async)
  │   │           │   └── PostsListAdmin (server async)
  │   │           │       └── DeletePostButton (client) ← useTransition
  │   │           │
  │   │           ├── AdminPostNewPage (server)
  │   │           │   └── ManagePostForm (client) ← useActionState(createPostAction)
  │   │           │
  │   │           └── AdminPostIdPage (server async)
  │   │               └── ManagePostForm (client) ← useActionState(updatePostAction)
  │   │
  │   └── Footer (client) ← useEffect para ano atual
  │
  └── ToastifyContainer (client)
```

### 1.3 Request Lifecycle Completo

```
                    ┌──────────────────────────────────────────────────────┐
                    │                  REQUEST                            │
                    │  Browser → Next.js Server → Matcher (/admin/:path*) │
                    └──────────────────────┬───────────────────────────────┘
                                           │
                                    ┌──────▼──────┐
                                    │  MIDDLEWARE  │
                                    │  (proxy.ts)  │
                                    │              │
                                    │ GET /admin/* │
                                    │  (exc login) │
                                    │      ↓       │
                                    │ verifyJwt()  │
                                    │      ↓       │
                                    │ válido?      │──Não──→ redirect /admin/login
                                    │ sim          │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │  SERVER COMP. │
                                    │  (async)      │
                                    │               │
                                    │ requireLogin  │──Não──→ redirect
                                    │ SessionOrRedir│
                                    │               │
                                    │ postRepo.     │
                                    │ findAll()     │──────→ SQLite (better-sqlite3)
                                    │               │
                                    │ cacheTag()    │
                                    │  (se público) │
                                    │               │
                                    │ Render HTML   │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │  CLIENT COMP. │
                                    │  (hidratação) │
                                    │               │
                                    │ useActionState│
                                    │  ↓            │
                                    │ Server Action │──→ verifyLoginSession → Repo → SQLite
                                    │  ↓            │
                                    │ revalidateTag │──→ Limpa cache "posts"
                                    │  ↓            │
                                    │ redirect() ou │
                                    │ return state  │
                                    └──────────────┘
```

### 1.4 Fluxo de Cache

```
                    ┌─────────────────────┐
                    │   2 ESTRATÉGIAS     │
                    └─────────────────────┘

  ┌─────────────────────────────────┐   ┌──────────────────────────────────┐
  │ PÚBLICO (Next.js "use cache")  │   │ ADMIN (React cache())            │
  │                                 │   │                                  │
  │ findAllPublicPostsCached()     │   │ findPostByIdAdmin(id)            │
  │ findPublicPostBySlugCached()   │   │ findAllPostAdmin()               │
  │                                 │   │                                  │
  │ cacheTag("posts")              │   │ cache() → dedup dentro           │
  │ cacheTag("post-{slug}")        │   │   do mesmo render pass           │
  │                                 │   │                                  │
  │ Revalidado por:                │   │ SEM cache entre requests         │
  │ createPostAction → reval("posts")│ │ (cada request roda de novo)      │
  │ updatePostAction → reval("posts")│ │                                  │
  │ deletePostAction → reval("posts")│ │                                  │
  └─────────────────────────────────┘   └──────────────────────────────────┘
```

### 1.5 Fluxo de Autenticação (Defesa em Profundidade)

```
                    ┌─────────────────────────────────────────────────────┐
                    │              3 CAMADAS DE PROTEÇÃO                 │
                    ├─────────────────────────────────────────────────────┤
                    │                                                    │
                    │  1. MIDDLEWARE (proxy.ts)                          │
                    │     ├── Intercepta GET /admin/*                    │
                    │     ├── Verifica JWT no cookie                     │
                    │     └── Redireciona para /admin/login se inválido  │
                    │                                                    │
                    │  2. LAYOUT SERVER (admin/post/layout.tsx)          │
                    │     ├── requireLoginSessionOrRedirect()            │
                    │     ├── Verifica JWT + username no payload         │
                    │     └── redirect("/admin/login") se inválido       │
                    │                                                    │
                    │  3. CADA SERVER ACTION                             │
                    │     ├── verifyLoginSession()                       │
                    │     ├── Verifica JWT + username === LOGIN_USER     │
                    │     └── Retorna erro se inválido                   │
                    │                                                    │
                    │  FLUXO DE LOGIN:                                   │
                    │  POST /admin/login → loginAction                   │
                    │    1. Checa ALLOW_LOGIN                            │
                    │    2. asyncDelay(5000) ← anti brute-force          │
                    │    3. Valida username + password                   │
                    │    4. bcrypt.compare(password, LOGIN_PASS hash)    │
                    │    5. signJwt({ username, expiresAt })             │
                    │    6. cookieStore.set(httpOnly, secure, strict)    │
                    │    7. redirect(/admin/post)                        │
                    └─────────────────────────────────────────────────────┘
```

### 1.6 Rotas e Proteção

| Rota | Tipo | Proteção | Cache | Função |
|------|------|----------|-------|--------|
| `/` | Server | Nenhuma | `"use cache"` tags: `posts` | Homepage com posts públicos |
| `/post/[slug]` | Server | Nenhuma | `"use cache"` tags: `post-{slug}` | Post individual |
| `/admin/login` | Server | `ALLOW_LOGIN` env gate | Nenhum | Formulário de login |
| `/admin/post` | Layout + Page | Middleware + Layout Auth | React `cache()` | CRUD admin |
| `/admin/post/new` | Layout + Page | Middleware + Layout Auth | Nenhum | Criar post |
| `/admin/post/[id]` | Layout + Page | Middleware + Layout Auth | React `cache()` | Editar post |

### 1.7 Database Schema

```
posts table (SQLite)
┌─────────────────────────┬──────────────┬─────────────────────────────────┐
│ Coluna (TS)             │ Coluna (DB)  │ Tipo Drizzle                    │
├─────────────────────────┼──────────────┼─────────────────────────────────┤
│ id                      │ id           │ text PK                         │
│ slug                    │ slug         │ text NOT NULL UNIQUE            │
│ title                   │ title        │ text NOT NULL                   │
│ author                  │ author       │ text NOT NULL                   │
│ excerpt                 │ excerpt      │ text NOT NULL                   │
│ content                 │ content      │ text NOT NULL                   │
│ coverImageUrl           │ cover_Image_Url │ text NOT NULL               │
│ published               │ published    │ integer (mode: boolean) NOT NULL│
│ createdAt               │ created_At   │ text NOT NULL                   │
│ updatedAt               │ updated_At   │ text NOT NULL                   │
└─────────────────────────┴──────────────┴─────────────────────────────────┘
```

O schema usa **snake_case** nas colunas do banco e **camelCase** no TypeScript (mapeamento via Drizzle ORM). Não há chaves estrangeiras, índices secundários ou constraints além das indicadas.

### 1.8 Modelo de Domínio vs DTO vs Schema

```
postModel (domínio completo)           PublicPost (DTO público)
┌────────────────────────┐            ┌────────────────────────┐
│ id: string             │            │ id: string             │
│ slug: string           │            │ slug: string           │
│ title: string          │            │ title: string          │
│ author: string         │            │ author: string         │
│ excerpt: string        │            │ excerpt: string        │
│ content: string        │            │ content: string        │
│ coverImageUrl: string  │            │ coverImageUrl: string  │
│ published: boolean     │            │ published: boolean     │
│ createdAt: string      │            │ createdAt: string      │
│ updatedAt: string      │  omit      │                        │
└────────────────────────┘            └────────────────────────┘

Tabela posts (DB)
┌────────────────────────┐
│ id (text)              │
│ slug (text, unique)    │
│ title (text)           │
│ author (text)          │
│ excerpt (text)         │
│ content (text)         │
│ cover_Image_Url (text) │
│ published (integer)    │
│ created_At (text)      │
│ updated_At (text)      │
└────────────────────────┘
```

### 1.9 Padrão de Server Actions (Estrutura Interna)

Toda Server Action segue este fluxo interno:

```
1. "use server"                       ← Diretiva Next.js
2. verifyLoginSession()               ← Auth check (retorna cedo se falhar)
3. Validação de tipo (instanceof)     ← Proteção contra chamadas malformadas
4. Object.fromEntries(formData)       ← Converte FormData para objeto
5. ZodSchema.safeParse(obj)           ← Validação + transformação
6. Operação no repositório (try/catch)← Persistência
7. revalidateTag("posts")             ← Invalida cache
8. redirect() ou return state         ← Resposta
```

### 1.10 Separação Server vs Client Component

```
SERVER COMPONENTS (default)           CLIENT COMPONENTS ("use client")
├── Fazem data fetching direto        ├── Têm estado (useState)
├── Acessam BD / repositório          ├── Têm efeitos (useEffect)
├── Renderizam HTML no servidor       ├── Listeners de evento
├── Podem ser async                   ├── useActionState, useTransition
├── Header, Container, Button         ├── usePathname, useSearchParams
├── InputText, InputCheckBox          ├── LoginForm, ManagePostForm
├── PostFeatured, PostsList           ├── MenuAdmin, ImageUploader
├── SinglePost, SafeMarkdown          ├── DeletePostButton, Dialog
├── PostSummary, PostCoverImg         ├── Footer, ErrorMessage
└── PostsListAdmin                    └── ToastifyContainer

REGRAS:
- Server Components NUNCA usam hooks (useState, useEffect, etc.)
- Client Components são marcados com "use client" no topo
- Server Actions têm "use server" e são importadas pelos client
- next/image funciona em server components
- dynamic(() => import(), { ssr: false }) para libs de browser (MD editor)
```

### 1.11 Boundaries Arquiteturais

```
                   ┌──────────────────────────────────┐
                   │        ENTRADA (HTTP)             │
                   │  Middleware → App Router → Pages   │
                   └────────────┬─────────────────────┘
                                │
                   ┌────────────▼─────────────────────┐
                   │     SERVER ACTIONS BOUNDARY       │
                   │  Validação de autenticação        │
                   │  Validação de tipo (FormData)     │
                   │  Zod schema validation            │
                   └────────────┬─────────────────────┘
                                │
                   ┌────────────▼─────────────────────┐
                   │     REPOSITORY BOUNDARY           │
                   │  Interface PostRepository         │
                   │  DrizzlePostRepository            │
                   │  JsonPostRepository               │
                   └────────────┬─────────────────────┘
                                │
                   ┌────────────▼─────────────────────┐
                   │        DB BOUNDARY                │
                   │  Drizzle ORM → better-sqlite3     │
                   │  SQLite file (db.sqlite3)         │
                   └──────────────────────────────────┘
```

### 1.12 Diagrama de Estados (Server Action)

```
┌─────────┐    chamada     ┌──────────┐    auth fail    ┌────────┐
│  IDLE   │ ─────────────→ │ CHECKING │ ─────────────→ │ RETURN │
│         │                │   AUTH   │                 │ ERROR  │
└─────────┘                └────┬─────┘                 └────────┘
                                │ auth ok
                                ▼
                         ┌──────────────┐
                         │  VALIDATING  │ zod fail ──→ ┌────────┐
                         │    (Zod)     │ ───────────→ │ RETURN │
                         └──────┬───────┘              │ ERROR  │
                                │ zod ok                └────────┘
                                ▼
                         ┌──────────────┐
                         │ REPOSITORY   │ exception ──→ ┌────────┐
                         │  OPERATION   │ ───────────→ │ RETURN │
                         └──────┬───────┘              │ ERROR  │
                                │ success               └────────┘
                                ▼
                         ┌──────────────┐
                         │ REVALIDATE   │
                         │ CACHE +      │
                         │ REDIRECT/RET │
                         └──────────────┘
```

### 1.13 Tratamento de Erros (Stack Completa)

```
                    ┌─────────────────────────────────┐
                    │        CAMADAS DE ERRO          │
                    ├─────────────────────────────────┤
                    │                                 │
                    │  1. error.tsx (root)            │
                    │     ├── Client Component        │
                    │     ├── Error Boundary global   │
                    │     └── Exibe 501 genérico      │
                    │                                 │
                    │  2. not-found.tsx               │
                    │     ├── Server Component        │
                    │     ├── Página 404 customizada  │
                    │     └── Disparada por notFound()│
                    │                                 │
                    │  3. try/catch nas Server Actions │
                    │     ├── Captura erros do repo   │
                    │     ├── e instanceof Error      │
                    │     └── Retorna { errors: [] }  │
                    │                                 │
                    │  4. Toast notifications         │
                    │     ├── react-toastify          │
                    │     ├── Disparado por useEffect │
                    │     └── state.errors.forEach()  │
                    │                                 │
                    │  5. Erro não tratado no BD      │
                    │     ├── Drizzle lança exceptions│
                    │     └── Propagam para o caller  │
                    └─────────────────────────────────┘
```

### 1.14 Gerenciamento de Estado

| Escopo | Mecanismo | Onde |
|--------|-----------|------|
| **Formulário** | `useActionState` | LoginForm, ManagePostForm |
| **Transição assíncrona** | `useTransition` | MenuAdmin (logout), ImageUploader, DeletePostButton |
| **Estado local** | `useState` | MarkdownEditor (content), MenuAdmin (isOpen), ImageUploader (imgUrl), DeletePostButton (showDialog) |
| **Cache servidor** | `"use cache"` + `cacheTag` | Queries públicas |
| **Dedup render** | React `cache()` | Queries admin |
| **Toast** | `react-toastify` (singleton) | Global |
| **Navegação** | `useRouter` + `usePathname` + `useSearchParams` | MenuAdmin, ManagePostForm |
| **URL state** | `searchParams` (`?created=1`) | ManagePostForm |

### 1.15 Configuração por Ambiente

```
┌──────────────────────────────────────┐
│         ENV VARS (12 variáveis)       │
├──────────────────────────────────────┤
│  SERVIDOR (server-side apenas)        │
│  ├── SIMULATE_WAIT_IN_MS             │
│  ├── IMAGE_UPLOAD_DIRECTORY          │
│  ├── IMAGE_SERVER_URL                │
│  ├── JWT_SECRET_KEY                  │ ← Crítico
│  ├── LOGIN_EXPIRATION_SECONDS        │
│  ├── LOGIN_EXPIRATION_STRING         │
│  ├── LOGIN_COOKIE_NAME               │
│  ├── LOGIN_USER                      │ ← Sensível
│  ├── LOGIN_PASS (bcrypt hash base64) │ ← Sensível
│  └── ALLOW_LOGIN                     │
│                                      │
│  PÚBLICO (NEXT_PUBLIC_ prefix)       │
│  └── NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE│
└──────────────────────────────────────┘
```

### 1.16 Padrões de Design Identificados

| Padrão | Onde | Descrição |
|--------|------|-----------|
| **Repository** | `repositories/post/` | Interface + implementações trocáveis |
| **DTO** | `dto/dto.ts` | Objeto de transferência com dados mínimos |
| **Server Action** | `actions/` | Padrão consistente para mutações |
| **Discriminated Union** | `ManagePostForm` | Props type-safe para modos create/update |
| **Singleton** | `repositories/post/index.ts` | Instância única do repositório |
| **Factory** | `dto/dto.ts` | Funções `make*` para criar DTOs |
| **Strategy de Cache** | `lib/post/queries/` | Cache público vs admin com estratégias diferentes |
| **Defense in Depth** | Auth | 3 camadas de verificação de autenticação |
| **Hydration Safety** | `Footer` | useState + useEffect para evitar mismatch SSR |
| **Dynamic Import** | `MarkdownEditor` | `dynamic(() => import(), { ssr: false })` |
| **Error Boundary** | `error.tsx` | Next.js error boundary global |
| **Composição com Suspense** | Várias páginas | `Suspense fallback={<SpinLoader/>}` |

---

## 2. Padrões de Código

### Repository Pattern

```typescript
// Interface (post-repository.ts)
interface PostRepository {
  findAllPublic(): Promise<postModel[]>
  findAll(): Promise<postModel[]>
  findById(id: string): Promise<postModel>
  findBySlugPublic(id: string): Promise<postModel>
  create(post: postModel): Promise<postModel>
  delete(id: string): Promise<postModel>
  update(id: string, data: Omit<postModel, "id" | "slug" | "createdAt" | "updatedAt">): Promise<postModel>
}

// Implementação concreta (drizzle-post-repository.ts)
class DrizzlePostRepository implements PostRepository { ... }

// Implementação alternativa (json-post-repository.ts)
class JsonPostRepository implements PostRepository { ... }

// Singleton (index.ts)
export const postRepository: PostRepository = new DrizzlePostRepository()
```

**Problema:** O `update` no DrizzlePostRepository tem um typo no Omit: usa `"creatdAt"` ao invés de `"createdAt"`, o que significa que o TypeScript não está protegendo contra atualização do `createdAt`.

### Server Actions - Padrão Consistente

```typescript
"use server"

export async function xAction(prevState, formData) {
  // 1. Auth check (retorno antecipado)
  if (!await verifyLoginSession()) return { errors: ["..."] }

  // 2. Type guard
  if (!(formData instanceof FormData)) return { errors: ["Dados invalidos"] }

  // 3. Parse + validate
  const parsed = Schema.safeParse(Object.fromEntries(formData))

  // 4. Repository operation
  try { result = await repo.method(data) } catch (e) { return { errors: [e.message] } }

  // 5. Cache invalidation
  revalidateTag("posts")

  // 6. Response
  return { formState, errors, success }
}
```

**Inconsistências:**
- `deletePostAction` recebe `id: string` diretamente (não segue o padrão `(prevState, formData)`)
- `deletePostAction` retorna `{ error }` (singular) enquanto as outras retornam `{ errors }` (plural)
- `createPostAction` faz double insert (linha 63 + linha 78)
- `revalidateTag` é chamado com 2 argumentos em vários lugares (só aceita 1)

### DTO Pattern

```typescript
// Domínio completo (11 campos)
type postModel = { id, slug, title, author, excerpt, content, coverImageUrl, published, createdAt, updatedAt }

// Público (10 campos — omit updatedAt)
type PublicPost = Omit<postModel, "updatedAt">

// Factory com defaults seguros
makePartialPublicPost(post?) → PublicPost  // usado para estado inicial do form
makePublicPostFromDb(post) → PublicPost    // usado ao carregar post para edição
```

### Component Patterns

**Server Component (data fetching):**
```typescript
export default async function PostsList() {
  const posts = await findAllPublicPostsCached()
  return <div>{posts.map(post => <PostSummary key={post.id} ... />)}</div>
}
```

**Client Component (interatividade):**
```typescript
"use client"
export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, initialState)
  // ...
}
```

**Dynamic Import (biblioteca browser):**
```typescript
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })
```

### Validação Zod

```typescript
const PostBaseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  content: z.string().trim().min(3),
  author: z.string().trim().min(4).max(100),
  excerpt: z.string().trim().min(3).max(200),
  coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, { ... }),
  published: z.union([z.literal("on"), z.literal("true"), ...])
    .default(false)
    .transform(val => val === "on" || val === "true" || val === true),
})

export const PostCreateSchema = PostBaseSchema
export const PostUpdateSchema = PostBaseSchema.extend({})  // vazio — usa os mesmos campos
```

---

## 3. Qualidade

### 3.1 Bugs Confirmados

| # | Arquivo | Linha | Problema | Causa Raiz | Impacto |
|---|---------|-------|----------|------------|---------|
| 1 | `src/actions/post/create-post-action.ts` | 63 + 78 | **Double insert** — `postRepository.create()` já insere no BD, e na linha 78 `drizzleDb.insert()` insere novamente | Código residual não removido após refatoração | Duplicata no BD ou erro de UNIQUE constraint |
| 2 | `src/utils/make-random-string.ts` | 2 | **Missing `return`** — função sem `return` sempre retorna `undefined` | Erro de digitação | Todos os slugs viram `titulo-undefined` |
| 3 | `src/app/layout.tsx` | 23 + 27 | **Nested `<body>`** — segundo `<body>` dentro do primeiro | Engano ao editar o layout | HTML inválido, possíveis problemas de renderização |
| 4 | `src/actions/post/delete-post-action.ts` | 38 | `revalidateTag("posts", "max")` — 2º argumento inválido | Copiado de API diferente ou erro | Segundo arg ignorado (funciona, mas confunde) |
| 5 | `src/repositories/post/drizzle-post-repository.ts` | 93 | Typo no Omit: `"creatdAt"` ao invés de `"createdAt"` | Digitação | TypeScript não protege campo `createdAt` |
| 6 | `src/repositories/post/json-post-repository.ts` | 92 | `slice()` em vez de `splice()` — não modifica o array original | Confusão entre slice/splice | Delete não funciona no repositório JSON |
| 7 | `src/repositories/post/json-post-repository.ts` | 47 | `findById()` filtra por `findAllPublic()` em vez de `findAll()` | Copiar/colar | Não encontra posts não publicados por ID |
| 8 | `src/actions/post/update-post-action.ts` | 83-84 | `revalidateTag` com 2 argumentos (mesmo bug do delete) | Padrão copiado | Código confuso, segundo arg ignorado |

### 3.2 Code Smells

| Smell | Local | Descrição |
|-------|-------|-----------|
| **Dead code** | `src/repositories/post/drizzle-post-repository.ts:125-130` | IIFE solta no final do arquivo que nunca é chamada |
| **Dead dependency** | `package.json` | `bcryptjs` e `sanitize-html` estão listados mas não são usados |
| **Unused components** | `src/components/ServerComponent/`, `src/components/ClientComponent/` | Componentes placeholder não utilizados |
| **Inconsistência de retorno** | `deletePostAction` vs outras actions | Uso de `error` (singular) vs `errors` (plural) |
| **CSS no JSX** | `ManagePostForm/index.tsx` | `min-w-[600]` sem unidade — deveria ser `min-w-[600px]` |
| **Unused imports** | `src/app/post/[slug]/page.tsx:9` | `import { title } from "process"` — não utilizado |
| **Unused imports** | `src/actions/login/login-action.ts:5` | `import { error } from "console"` — não utilizado |
| **Import inline** | `src/lib/post/validations.ts:2` | `import { title } from "process"` — não utilizado |
| **Side effect em module** | `src/lib/post/queries/public.ts:1` | `"use cache"` no topo do arquivo coloca cache em TODAS as funções |
| **Mistura de idiomas** | Vários arquivos | Mensagens de erro em português, nomes de variáveis em inglês |
| **Função no escopo errado** | `src/app/post/[slug]/page.tsx:16` | `generateMetaData` — dígito extra, deveria ser `generateMetadata` (não afeta execução pois não é export padrão, mas é confuso) |

### 3.3 Testes

O projeto não possui testes automatizados. Não há:
- Testes unitários (jest, vitest)
- Testes de integração
- Testes E2E (Playwright, Cypress)
- Testes de Server Actions
- Testes de componentes

### 3.4 Lint e TypeScript

- ESLint configurado com `eslint-config-next` (core-web-vitals)
- TypeScript em modo `strict: true`
- `skipLibCheck: true` — não verifica libs de terceiros
- Path alias `@/*` configurado

A build atual (`npm run build`) não foi verificada — pode falhar devido aos bugs identificados.

---

## 4. Segurança — Análise Detalhada

### 4.1 Mapa de Ameaças

```
┌──────────────────────────────────────────────────────────────────┐
│                     SUPERFÍCIE DE ATAQUE                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Ameaça                    | Proteção Atual       | Status      │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Injeção SQL               │ Drizzle ORM           │ ✅ OK      │
│                            │ (queries parametriz.) │             │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  XSS via Markdown          │ rehype-sanitize       │ ✅ OK      │
│                            │ (SafeMarkdown +       │             │
│                            │  preview do editor)   │             │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Acesso não autorizado     │ 3 camadas auth        │ ✅ OK      │
│  (admin)                   │ (middleware + layout   │             │
│                            │  + server action)     │             │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Força bruta (login)       │ delay 5s fixo         │ ⚠️  Parcial │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  CSRF                      │ Server Actions        │ ✅ OK      │
│                            │ (Next.js inato)       │             │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Session Hijacking         │ httpOnly + secure     │ ✅ OK      │
│                            │ + sameSite:strict     │             │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  JWT tampering             │ HS256 + jose verify   │ ✅ OK      │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Upload malicioso          │ type check + size     │ ⚠️  Parcial │
│                            │ limit                 │             │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Path traversal (upload)   │ resolve() + write     │ ⚠️  Parcial │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Clickjacking              │ Sem headers           │ ❌ Ausente │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Content Security Policy   │ Não configurado       │ ❌ Ausente │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Rate limiting             │ Inexistente           │ ❌ Ausente │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Helmet / Security headers │ Não configurado       │ ❌ Ausente │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Enumeração de usuário     │ Delay 5s (mesmo       │ ✅ OK      │
│                            │ se credenciais        │             │
│                            │ inválidas)            │             │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  JWT secret fraco          │ Configurável via env  │ ⚠️  Parcial │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  JWT sem refresh token     │ Expiração fixa        │ ⚠️  Parcial │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Acesso a /uploads/        │ Pasta em /public/     │ ⚠️  Parcial │
│  ──────────────────────────┼──────────────────────┼─────────────│
│  Timestamp previsível      │ Nome de arquivo usa   │ ⚠️  Parcial │
│  (upload)                  │ Date.now()            │             │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Análise de Cada Camada de Defesa

**Autenticação:**
- bcrypt com 10 rounds — padrão seguro
- Hash armazenado como base64 no .env (boa prática para evitar problemas com caracteres especiais)
- Delay de 5s fixo é melhor que nada, mas rate limiting exponencial seria mais eficaz
- Sem proteção contra reuse de JWT (sem refresh token, sem blacklist)

**Cookies:**
- `httpOnly: true` — inacessível via JS do browser ✅
- `secure: true` — apenas HTTPS ✅
- `sameSite: "strict"` — prevenção CSRF ✅
- `deleteLoginSession` chama `cookieStore.set()` e depois `cookieStore.delete()` — redundante mas seguro

**JWT:**
- HS256 com `jose` — biblioteca respeitada e segura ✅
- Secret key via env var ✅
- Payload inclui `username` e `expiresAt` + `iat` (issued at) via `setIssuedAt()` ✅
- Sem `aud` (audience) ou `iss` (issuer) — aceitável para app single-domain
- `verifyJwt` usa `algorithms: ["HS256"]` — evita algorithm confusion ✅

**Markdown/XSS:**
- `rehype-sanitize` no `SafeMarkdown` e no preview do editor ✅
- `react-markdown` por padrão não renderiza HTML bruto (safe by default) ✅
- Tabelas responsivas com `overflow-x-auto` ✅

**Upload de Imagens:**
- Valida `file.type.startsWith("image/")` ✅
- Valida `file.size` contra limite configurável ✅
- Nome de arquivo: `Date.now() + extname` — previsível ⚠️
- Salva em `public/uploads/` — acessível diretamente via URL ⚠️
- Sem validação de conteúdo real do arquivo (apenas MIME type) ⚠️

**Validação de Entrada:**
- Zod com `.trim()` em todos os campos ✅
- `coverImageUrl` validado via `isUrlOrRelativePath` + regex restritiva ✅
- Campo `published` normalizado de múltiplos formatos para boolean ✅
- Campos de login: apenas `.trim()` — sem sanitização adicional ⚠️

### 4.3 Recomendações de Segurança

| Prioridade | Recomendação | Esforço | Benefício |
|-----------|-------------|---------|-----------|
| 🔴 Alta | Configurar CSP (Content-Security-Policy) | Baixo | Mitiga XSS, data exfiltration |
| 🔴 Alta | Adicionar security headers (helmet ou manual) | Baixo | Clickjacking, MIME sniffing |
| 🟡 Média | Rate limiting no login (exponencial, não fixo) | Médio | Anti brute-force mais eficaz |
| 🟡 Média | Validar conteúdo real do upload (magic bytes) | Baixo | Evita upload de arquivos maliciosos |
| 🟡 Média | Nomes de arquivo aleatórios (UUID v4) no upload | Baixo | Previne adivinhação de URLs |
| 🟢 Baixa | Refresh token ou sliding session para JWT | Médio | Melhora UX sem sacrificar segurança |
| 🟢 Baixa | Mover uploads para fora de `/public/` | Médio | Previne acesso direto não controlado |
| 🟢 Baixa | Adicionar `aud` e `iss` ao JWT | Baixo | Boa prática |

---

## 5. Observações Finais

### Pontos Fortes

1. **Arquitetura limpa** — Repository Pattern, DTO, Server Actions, separação server/client
2. **Defesa em profundidade** — 3 camadas de autenticação
3. **Segurança de Markdown** — sanitização em camada de apresentação e editor
4. **Validação robusta** — Zod em todos os boundaries
5. **Cookies seguros** — httpOnly + secure + strict
6. **Caching estratégico** — cache público (entre requests) vs admin (só dedup no render)
7. **Componentização** — componentes pequenos e focados

### Pontos Fracos

1. **6+ bugs** — incluindo 2 de gravidade alta (double insert, slug undefined)
2. **Zero testes** — sem testes unitários, integração ou E2E
3. **Sem CSP ou security headers** — vulnerável a clickjacking e XSS em cenários não cobertos pelo sanitize
4. **Rate limiting frágil** — delay fixo de 5s, sem exponential backoff
5. **Inconsistências** — retorno de erros, nomenclatura, `revalidateTag`, idiomas misturados
6. **Repositório JSON quebrado** — `slice` em vez de `splice`
7. **Typo no Omit** — `creatdAt` em vez de `createdAt` (proteção TS quebrada)
