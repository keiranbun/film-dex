# Task 03 — Install Dependencies

Install and configure Tailwind CSS and Shadcn.

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

## Shadcn

### 1. Initialise

```bash
npx shadcn@latest init
```

Follow the prompts — choose defaults, confirm Tailwind is already set up.

### 2. Add components as needed

Components are added individually when required, e.g.:

```bash
npx shadcn@latest add badge
```

---

## Done when

- A Tailwind utility class (e.g. `className="text-red-500"`) renders correctly
- `npx shadcn@latest add` runs without errors
