# Task 12 — Watched

Status: Complete

Let users mark movies as watched. State persists in `localStorage`. Watched
cards are dimmed with a green tick. A "Hide watched" switch in the FilterBar
removes them from the grid entirely.

---

## New shadcn component

```sh
npx shadcn@latest add switch
```

`lucide-react` is already a transitive shadcn dep — use `CheckCircle2` from there.

---

## Files

### `src/hooks/useWatched.ts` (new)

```ts
export function useWatched(): {
  watchedIds: Set<number>
  toggle: (id: number) => void
  isWatched: (id: number) => boolean
}
```

- Storage key: `filmdex-watched`
- Initial state: read array from localStorage on mount, fall back to `[]`
- On change: write `Array.from(watchedIds)` back to localStorage
- `toggle(id)`: returns a new Set with `id` added or removed
- All localStorage access wrapped in try/catch (private mode etc.)

### `src/components/MovieCard.tsx` (modify)

Add two new props:

```ts
type MovieCardProps = {
  movie: Movie
  isWatched: boolean
  onToggleWatched: () => void
}
```

**Front face additions:**

1. **Watched overlay** — when `isWatched`:
   ```tsx
   <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center pointer-events-none">
     <CheckCircle2 className="w-16 h-16 text-green-500" />
   </div>
   ```

2. **Toggle button** — always visible:
   ```tsx
   <button
     type="button"
     onClick={(e) => {
       e.stopPropagation()
       onToggleWatched()
     }}
     aria-label={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
     className="absolute bottom-2 right-2 rounded-full bg-background/80 p-1.5 hover:bg-background"
   >
     <CheckCircle2
       className={cn('w-6 h-6', isWatched ? 'text-green-500' : 'text-muted-foreground')}
     />
   </button>
   ```

The overlay uses `pointer-events-none` so it doesn't intercept the toggle button click. The toggle button stops propagation so it doesn't flip the card.

### `src/components/FilterBar.tsx` (modify)

Add two new props:

```ts
hideWatched: boolean
onHideWatchedChange: (v: boolean) => void
```

Add a `<Switch>` + `<Label>` pair near the Clear button:

```tsx
<div className="flex items-center gap-2">
  <Switch id="hide-watched" checked={hideWatched} onCheckedChange={onHideWatchedChange} />
  <Label htmlFor="hide-watched">Hide watched</Label>
</div>
```

Update `onClear` semantics: also resets `hideWatched` to false. The "default" check for the disabled Clear button must include `!hideWatched`.

### `src/App.tsx` (modify)

- `const { watchedIds, toggle, isWatched } = useWatched()`
- `const [hideWatched, setHideWatched] = useState(false)`
- Add filter step to `visibleMovies` pipeline:
  ```ts
  if (hideWatched) list = list.filter((m) => !watchedIds.has(m.id))
  ```
- Pass `hideWatched` + `setHideWatched` to `<FilterBar>`
- Pass `isWatched(movie.id)` + `() => toggle(movie.id)` to each card (via MovieGrid)

### `src/components/MovieGrid.tsx` (modify)

Forward two new props per card. Cleanest API:

```ts
type MovieGridProps = {
  movies: Movie[]
  query?: string
  isWatched: (id: number) => boolean
  onToggleWatched: (id: number) => void
}
```

Then per card: `<MovieCard isWatched={isWatched(m.id)} onToggleWatched={() => onToggleWatched(m.id)} />`

---

## Tests

### `src/hooks/useWatched.test.ts` (new)

- Initial `watchedIds` is empty when localStorage is clean
- `toggle(id)` adds the id; calling again removes it
- Writes to localStorage after each change (read it back and parse)
- Reads existing IDs from localStorage on mount

### `src/components/MovieCard.test.tsx` (extend)

- Renders the watched toggle button with the correct `aria-label`
- Clicking the toggle button calls `onToggleWatched` exactly once
- Clicking the toggle button does **not** flip the card (no `rotate-y-180` on inner div)
- When `isWatched` is true, an overlay with a `CheckCircle2` icon is present (look for the SVG or a wrapping element)
- When `isWatched` is true, the toggle button's icon has the green class

### `src/components/FilterBar.test.tsx` (extend)

- Renders the Hide watched switch
- Toggling it fires `onHideWatchedChange` with the new value
- Clear is enabled when `hideWatched === true`; click also resets it

### `src/components/MovieGrid.test.tsx` (extend or update)

- Verify the new `isWatched` / `onToggleWatched` props are forwarded correctly (use the existing `vi.mock` for `MovieCard`)

---

## Done when

- A checkmark button appears on every card; clicking it marks watched without flipping
- Watched cards show a dark overlay + large green tick on the front
- State survives a page reload (localStorage)
- "Hide watched" switch in the filter bar removes watched cards from the grid
- Clear resets sort + services + hide-watched
- `npm run test:run` passes
- `npm run build` passes
