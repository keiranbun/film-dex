# Task 03 — Install Dependencies

**Status:** Complete

Install and configure Tailwind CSS and Shadcn, then add the components needed
for the movie grid UI.

---

## Tailwind CSS

### 1. Install

```bash
npm install tailwindcss @tailwindcss/vite
```

### 2. Configure Vite plugin

In `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [
    tailwindcss(),
  ],
}
```

### 3. Add to CSS

In `src/index.css`, replace contents with:

```css
@import "tailwindcss";
```

---

## Path aliases (required by Shadcn)

Shadcn imports components as `@/components/ui/...`, so the `@` alias must
resolve to `src/` in both TypeScript and Vite.

### 1. Install Node types

```bash
npm install -D @types/node
```

### 2. Update `tsconfig.json`

Add to `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### 3. Update `tsconfig.app.json`

Same `baseUrl` + `paths` entries inside `compilerOptions`.

### 4. Update `vite.config.ts`

```ts
import path from 'path'

export default {
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
}
```

---

## Shadcn

### 1. Initialise

```bash
npx shadcn@latest init
```

When prompted:
- **Base colour:** `zinc`
- Accept other defaults

### 2. Add components

The MVP UI needs four components:

```bash
npx shadcn@latest add badge skeleton scroll-area tooltip
```

| Component | Used for |
|---|---|
| `badge` | Rank number + rating score on the card front |
| `skeleton` | Placeholder while poster images load |
| `scroll-area` | Card back when streaming services overflow |
| `tooltip` | Service name on hover (since card back is logos-only) |

**Note:** The flip card itself is built with custom CSS (`transform-style: preserve-3d`), not Shadcn's `card` component.

---

## Dark mode

The app will support a **light/dark toggle**. Implementation lives in task 04
(frontend build), but the dependency goes in here:

```bash
npx shadcn@latest add button
```

(Used by the toggle UI. The theme provider itself is a small custom hook —
no extra package needed for a Vite app.)

---

## Done when

- A Tailwind utility class (e.g. `className="text-red-500"`) renders correctly
- The `@/` alias resolves in both TypeScript and Vite
- All Shadcn components (`badge`, `skeleton`, `scroll-area`, `tooltip`, `button`) are added under `src/components/ui/`
