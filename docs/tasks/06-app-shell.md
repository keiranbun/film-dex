# Task 05 — App Shell

Build the app's outer layout: a header bar with the app title and a dark/light
mode toggle, with a content area below that future tasks will populate.

---

## Theme provider

Dark mode is implemented with a small custom hook and a context provider
(no `next-themes` dependency — this is Vite, not Next).

### `src/components/theme-provider.tsx`

- React context exposing `theme` (`"light" | "dark" | "system"`) and `setTheme`
- On mount, reads stored preference from `localStorage` under key `filmdex-theme`
- If no stored preference, **defaults to `"system"`** (matches the browser's `prefers-color-scheme`)
- Applies the resolved theme by toggling the `dark` class on `<html>`
- Listens to `matchMedia('(prefers-color-scheme: dark)')` and updates live when in `"system"` mode

---

## Mode toggle

### `src/components/mode-toggle.tsx`

- Shadcn `Button` (variant `"outline"`, size `"icon"`)
- Uses Lucide icons `Sun` and `Moon` (already installed by shadcn init)
- Cycles: `light` → `dark` → `system` → `light`
- Tooltip on hover shows current mode

---

## Header

Inline in `App.tsx` (no separate component needed for MVP):

- Title: **FilmDex** (left-aligned, large, bold)
- Mode toggle (right-aligned)
- Sticky to top of viewport with a subtle border-bottom

---

## App layout

`src/App.tsx`:

```tsx
<ThemeProvider>
  <TooltipProvider>
    <div className="min-h-screen bg-background text-foreground">
      <header>...</header>
      <main className="container mx-auto px-4 py-6">
        {/* movie grid goes here in task 06 */}
      </main>
    </div>
  </TooltipProvider>
</ThemeProvider>
```

---

## Tests

**`src/components/theme-provider.test.tsx`**
- Defaults to `"system"` when no `localStorage` value is set
- Reads the stored value on mount when `localStorage` has one
- Calling `setTheme("dark")` adds the `dark` class to `<html>`
- Calling `setTheme("light")` removes the `dark` class
- Calling `setTheme("system")` applies the value of `matchMedia('(prefers-color-scheme: dark)')`
- Theme choice persists to `localStorage` under key `filmdex-theme`

**`src/components/mode-toggle.test.tsx`**
- Renders a button
- Clicking the button cycles `light → dark → system → light`
- The icon switches between `Sun` and `Moon` based on the current resolved theme

> Mock `window.matchMedia` in the setup file or per-test — jsdom doesn't implement it natively.

---

## Done when

- The page shows "FilmDex" in a header with the mode toggle on the right
- Clicking the toggle switches between light/dark/system
- On first load with no stored preference, the theme matches the browser's
  preferred colour scheme
- Refresh preserves the chosen theme
- `npm run build` passes
