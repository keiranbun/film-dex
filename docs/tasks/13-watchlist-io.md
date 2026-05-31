# Task 13 — Watchlist Import / Export

Status: Complete

Let users export their watched/unwatched state to a JSON file and import one
back. Useful for sharing, backups, or moving between devices.

---

## New shadcn components

```sh
npx shadcn@latest add dropdown-menu sonner
```

`sonner` is the toast library that ships with the shadcn registry.
`lucide-react` is already available — use `ListChecks` (or `Bookmark`) for the icon.

---

## File format

Exported file: `filmdex-watchlist.json`

```json
{
  "version": 1,
  "exportedAt": "2026-05-31T12:00:00.000Z",
  "movies": [
    { "id": 278, "title": "The Shawshank Redemption", "watched": true },
    { "id": 238, "title": "The Godfather", "watched": false }
  ]
}
```

- All 100 movies always present (with `watched: false` for unwatched)
- `title` is included for human readability — it is **not** trusted on import; only `id` + `watched` are consumed
- `version: 1` reserved for future format changes (import accepts only `1`)

Import **replaces** the entire watched state: any id with `watched: true` becomes watched, everything else becomes unwatched.

---

## Files

### `src/hooks/useWatched.ts` (modify)

Add a `setWatched(ids: Set<number>): void` method that replaces the entire watched set (and persists). Existing `toggle` and `isWatched` keep working.

```ts
export function useWatched(): {
  watchedIds: Set<number>
  toggle: (id: number) => void
  isWatched: (id: number) => boolean
  setWatched: (ids: Set<number>) => void
}
```

`setWatched` simply calls `setWatchedIds(new Set(ids))` — the existing `useEffect` writes to localStorage.

### `src/components/WatchedIO.tsx` (new)

Header button + dropdown that owns all import/export logic. Props:

```ts
type WatchedIOProps = {
  movies: Movie[]              // the full top-100 list
  watchedIds: Set<number>
  onSetWatched: (ids: Set<number>) => void
}
```

Structure:

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Watchlist">
          <ListChecks className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Watchlist</TooltipContent>
    </Tooltip>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={handleExport}>Export…</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
      Import…
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

<input
  ref={fileInputRef}
  type="file"
  accept="application/json,.json"
  className="hidden"
  onChange={handleFileChange}
/>
```

**Export handler:**

```ts
function handleExport() {
  const payload = {
    version: 1 as const,
    exportedAt: new Date().toISOString(),
    movies: movies.map((m) => ({
      id: m.id,
      title: m.title,
      watched: watchedIds.has(m.id),
    })),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'filmdex-watchlist.json'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
```

**Import handler:**

```ts
async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  e.target.value = '' // allow re-importing the same file later
  if (!file) return
  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.movies)
    ) {
      throw new Error('bad shape')
    }
    const next = new Set<number>()
    for (const entry of parsed.movies) {
      if (
        entry &&
        typeof entry === 'object' &&
        typeof entry.id === 'number' &&
        entry.watched === true
      ) {
        next.add(entry.id)
      }
    }
    onSetWatched(next)
    toast.success(`Imported watchlist — ${next.size} movies marked as watched`)
  } catch {
    toast.error('Invalid file — could not import watchlist')
  }
}
```

### `src/App.tsx` (modify)

- Pull `setWatched` out of `useWatched()`
- Render `<Toaster richColors position="top-center" />` once, inside the providers
- Add `<WatchedIO>` in the header to the **right of `<ModeToggle />`**, grouped in a flex container:

```tsx
<div className="flex items-center gap-2">
  <ModeToggle />
  <WatchedIO movies={movies} watchedIds={watchedIds} onSetWatched={setWatched} />
</div>
```

---

## Tests

### `src/hooks/useWatched.test.ts` (extend)

- `setWatched(new Set([1, 2, 3]))` replaces `watchedIds` exactly
- `setWatched` persists to localStorage (read back and parse)
- Calling `setWatched(new Set())` clears all watched

### `src/components/WatchedIO.test.tsx` (new)

> Mock `sonner`: `vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() }, Toaster: () => null }))`.
> Mock `URL.createObjectURL` and `URL.revokeObjectURL` on `window`.

Required tests:
1. Renders the trigger button with `aria-label="Watchlist"`
2. Clicking the trigger opens a menu with "Export…" and "Import…" items
3. Export creates a Blob, calls `URL.createObjectURL`, and triggers a download via a synthesized `<a download="filmdex-watchlist.json">` click
4. Import with a valid JSON file (build with `new File([JSON.stringify(...)], 'x.json')`) calls `onSetWatched` with a Set containing only the ids whose `watched === true`
5. Import with valid JSON fires `toast.success` with a message that includes the count
6. Import with malformed JSON (`new File(['not json'], ...)`) fires `toast.error` and does NOT call `onSetWatched`
7. Import with valid JSON but missing/invalid `version` fires `toast.error`

Helper: build the file input ref interaction with `fireEvent.change(input, { target: { files: [file] } })`.

---

## Done when

- Header shows a watchlist icon button right of the dark-mode toggle, with a tooltip "Watchlist"
- Clicking it opens a small menu with Export and Import
- Export downloads `filmdex-watchlist.json` containing all 100 movies with current watched state
- Import accepts a valid file and replaces the watched state (visible in the grid immediately + persisted)
- Invalid imports show an error toast without corrupting current state
- `npm run test:run` passes
- `npm run build` passes
