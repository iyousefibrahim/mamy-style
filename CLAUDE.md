.
---

````md
# CLAUDE.md

This file provides guidance to Claude Code and AI coding assistants when working in this repository.

---

# Project Commands

```bash
pnpm dev        # start dev server on localhost:3000
pnpm build      # production build
pnpm lint       # run ESLint
````

No test runner is configured yet.

---

# Tech Stack

* Next.js 16 (App Router)
* React 19
* TypeScript 5
* Tailwind CSS v4
* Shadcn UI
* pnpm

Tailwind is configured using:

```css
@import "tailwindcss";
```

inside `globals.css`.

No `tailwind.config` file is required.

---

# Project Structure

The project follows a **feature-based architecture**.

```
app/                ← Next.js routing layer (keep pages thin)

features/           ← each feature in its own folder

components/         ← shared components (used in 2+ features)

lib/                ← external integrations (APIs, axios, supabase…)

contexts/           ← global state used by multiple features

hooks/              ← global hooks

utils/              ← global utilities

types.ts            ← global types
```

---

# AI Coding Rules

These rules apply to **every coding session**.

---

# 1. Code Quality

### Clean code always

Code must always be:

* readable
* maintainable
* predictable

Prefer **clarity over cleverness**.

Avoid “smart” solutions that reduce readability.

---

### Small files and functions

Every file and function should focus on **one responsibility**.

Avoid:

* large files
* large components
* complex logic in a single place

---

### Comments only when necessary

Do not write comments that repeat the code.

Comments must explain **WHY**, not **WHAT**.

Bad:

```ts
// increment count
count++
```

Good:

```ts
// required because the API expects a 1-based index
count++
```

---

### No duplication

Before writing new code:

1. Check if it already exists
2. Reuse it if possible

If the same logic appears in **2+ places**, extract it to shared code.

---

# 2. Feature-Based Structure

Each feature should contain everything it needs.

Example:

```
features/posts/

  components/
  hooks/
  api/
  utils/
  types.ts
```

Shared code should exist **only when used by multiple features**.

```
components/
hooks/
utils/
contexts/
```

If something is used by **only one feature**, keep it inside that feature.

---

# 3. Handling Problems

### Root cause first

Always fix the **real cause**, not the symptom.

Avoid superficial fixes or hacks.

---

### Minimal safe changes

When fixing something:

* change **only what is necessary**
* do not refactor unrelated code

---

### No breaking changes

Do not change:

* existing API shape
* component contracts
* UI behavior

unless explicitly requested.

---

# 4. Naming Conventions

Follow consistent naming conventions.

### Components

Use **PascalCase**

```
LoginForm.tsx
UserCard.tsx
```

---

### Hooks

Hooks must start with **use**

```
useAuth.ts
usePosts.ts
```

---

### Utilities

Use **camelCase**

```
formatDate.ts
calculateTotal.ts
```

---

### Folders

Use **kebab-case**

```
blog-posts/
user-settings/
```

---

### React components

Component names must use **PascalCase**

```ts
function LoginForm() {}
```

---

# 5. TypeScript Strictness

Type safety is required.

Rules:

* Avoid `any`
* Always type component props
* Prefer explicit types when helpful

Example:

```ts
type Props = {
  title: string
  count: number
}

function Counter({ title, count }: Props) {
  return <div>{title} {count}</div>
}
```

Strict TypeScript improves:

* maintainability
* refactoring safety
* developer experience

---

# 6. Component Size Rule

Components should remain **reasonably small and focused**.

Guidelines:

* Prefer components around **50–150 lines**
* Avoid large “mega components”

If a component grows too large, split it into smaller components.

Example:

```
PostPage
 ├ PostHeader
 ├ PostContent
 └ PostComments
```

---

# 7. No Premature Optimization

Do not optimize performance before it is necessary.

Avoid adding:

* useMemo
* useCallback
* complex caching
* unnecessary abstractions

unless there is a **clear performance problem**.

Prefer **simple readable code first**.

---

# 8. Error Handling & Loading States

Always handle async operations safely.

When working with:

* API requests
* async actions
* data fetching

Provide:

1. loading state
2. error handling
3. fallback UI when needed

Common UI patterns:

* spinner
* skeleton loader
* loading placeholder

Typical flow:

```
Loading → Success → Error
```

This improves:

* user experience
* UI stability
* perceived performance

---

# 9. Import Order

Maintain consistent import ordering.

Order:

1. framework imports
2. external libraries
3. internal modules
4. styles

Example:

```ts
import { useState } from "react"

import axios from "axios"

import { useAuth } from "@/features/auth/hooks/useAuth"

import "./styles.css"
```

---

# 10. Server vs Client Components

Prefer **Server Components by default**.

Use `"use client"` only when necessary.

Examples where client components are required:

* React hooks
* browser APIs
* interactive UI

Server Components should handle:

* data fetching
* heavy logic
* non-interactive UI
* But with Forms Do Not Use Server Actions use React Hook Form with ZOD for Validation
* For caching use ONLY: TanStack Query (React Query) for caching

---

# 11. Dependency Discipline

Avoid unnecessary dependencies.

Before installing a package:

1. verify it is truly needed
2. prefer built-in solutions
3. avoid dependency bloat

---

# 12. Modern Standards

Always follow modern development standards.

Rules:

* Use latest **best practices**
* Prefer **latest stable package versions**
* Avoid outdated patterns

Applies to:

* React
* Next.js
* TypeScript
* Tailwind CSS

---

# Anti-Patterns (Avoid These)

Avoid the following patterns:

* massive components
* deep prop drilling
* duplicated logic
* installing packages for trivial tasks
* premature optimization
* mixing unrelated responsibilities in the same file

```

---