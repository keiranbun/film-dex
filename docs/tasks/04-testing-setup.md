# Task 04 — Testing Setup

Install and configure Vitest + React Testing Library for frontend unit tests.

---

## Install

```bash
npm install -D vitest @vitest/ui jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

| Package | Purpose |
|---|---|
| `vitest` | Test runner (same config as Vite) |
| `@vitest/ui` | Optional browser UI for watching test runs |
| `jsdom` | Browser-like DOM environment |
| `@testing-library/react` | Render + query components |
| `@testing-library/jest-dom` | Custom matchers (`toBeInTheDocument`, etc) |
| `@testing-library/user-event` | Realistic user interactions (click, hover, etc) |

---

## Vitest config

Update `vite.config.ts` to include a test config block:

```ts
/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

---

## Setup file

**`src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

---

## TypeScript

Add to `tsconfig.app.json` `compilerOptions.types`:

```json
"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]
```

---

## Scripts

Add to `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:run": "vitest run"
}
```

---

## Convention

Tests live next to the component they test:

```
src/components/
├── MovieCard.tsx
├── MovieCard.test.tsx
├── MovieGrid.tsx
└── MovieGrid.test.tsx
```

---

## Done when

- `npm run test:run` exits 0 (no tests yet is fine)
- A trivial test (`expect(true).toBe(true)`) in `src/test/sanity.test.ts` passes
