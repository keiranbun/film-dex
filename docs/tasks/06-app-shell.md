# Task 06 — App Shell

**Status:** Complete

Build the app's outer layout: a header bar with the app title and a dark/light
mode toggle, with a content area below that future tasks will populate.

---

## Theme provider

Dark mode is implemented with a small custom hook and a context provider
(no `next-themes` dependency — this is Vite, not Next).

### `src/components/theme-provider.tsx`

- React context exposing `theme` (`"light" | "dark"`) and `setTheme`
- On mount:
  - If `localStorage` has a stored preference under key `filmdex-theme`, use it
  - Otherwise, read the browser's `prefers-color-scheme` once and use that
- After mount, the theme is fully user-controlled — no live `matchMedia` listener
- Applies the theme by toggling the `dark` class on `<html>`
- Persists every `setTheme` call to `localStorage`

---

## Mode toggle

### `src/components/mode-toggle.tsx`

- Shadcn `Button` (variant `"outline"`, size `"icon"`)
- Uses Lucide icons `Sun` (light) and `Moon` (dark)
- Toggles between `light` and `dark` (no system option in the UI)
- Tooltip on hover shows the action (e.g. "Switch to dark mode")

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
- Defaults to system theme on first mount when no `localStorage` value is set
  - Uses `dark` when `matchMedia('(prefers-color-scheme: dark)')` matches
  - Uses `light` when it does not
- Reads the stored value on mount when `localStorage` has one (ignores system preference)
- Calling `setTheme("dark")` adds the `dark` class to `<html>`
- Calling `setTheme("light")` removes the `dark` class
- Theme choice persists to `localStorage` under key `filmdex-theme`
- Does NOT update when `matchMedia` fires a `change` event after mount

**`src/components/mode-toggle.test.tsx`**
- Renders a button
- Clicking the button toggles between `light` and `dark`
- The icon switches between `Sun` (light) and `Moon` (dark)

> Mock `window.matchMedia` in the setup file or per-test — jsdom doesn't implement it natively.

---

## Done when

- The page shows "FilmDex" in a header with the mode toggle on the right
- Clicking the toggle switches between light/dark/system
- On first load with no stored preference, the theme matches the browser's
  preferred colour scheme
- Refresh preserves the chosen theme
- `npm run build` passes
