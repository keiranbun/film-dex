# Task 11 — Filter & Sort Bar

Add a control bar that sorts the grid and filters by streaming service.

---

## New shadcn components

```sh
npx shadcn@latest add select popover checkbox label
```

---

## Files

### `src/components/FilterBar.tsx` (new)

Horizontal control bar. Props:

```ts
type SortOrder = 'rank' | 'rating-desc' | 'rating-asc'

type FilterBarProps = {
  sortOrder: SortOrder
  onSortOrderChange: (s: SortOrder) => void
  availableServices: string[]          // unique service names from data
  selectedServices: Set<string>
  onSelectedServicesChange: (s: Set<string>) => void
  onClear: () => void
}
```

Layout: `flex flex-wrap items-center gap-2`

1. **Sort `<Select>`** — left side
   - Options: `Rank` (value `rank`, default), `Highest rating` (`rating-desc`), `Lowest rating` (`rating-asc`)
   - Trigger label like `Sort: Rank`

2. **Streaming `<Popover>`** — middle
   - Trigger: `<Button variant="outline">` with text `Services` or `Services (3)` when any selected
   - Content: scrollable list (`max-h-72 overflow-y-auto`) of `<Checkbox>` + `<Label>` pairs, one per `availableServices` entry
   - Toggling a checkbox calls `onSelectedServicesChange` with a new Set
   - Each row is keyed by service name

3. **Clear button** — right side
   - `<Button variant="ghost">Clear</Button>`
   - Disabled when nothing is set (sortOrder === 'rank' && selectedServices.size === 0)
   - Calls `onClear`

### `src/App.tsx` (modify)

- Add state:
  ```ts
  const [sortOrder, setSortOrder] = useState<SortOrder>('rank')
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  ```
- Derive `availableServices` once (useMemo) from `movies.flatMap(m => m.streaming_au.map(s => s.name))`, deduped + sorted
- Compute final list (after the query filter from task 10):
  ```ts
  const visibleMovies = useMemo(() => {
    let list = filteredMovies
    if (selectedServices.size > 0) {
      list = list.filter((m) =>
        m.streaming_au.some((s) => selectedServices.has(s.name))
      )
    }
    if (sortOrder === 'rating-desc') list = [...list].sort((a, b) => b.rating - a.rating)
    else if (sortOrder === 'rating-asc') list = [...list].sort((a, b) => a.rating - b.rating)
    else list = [...list].sort((a, b) => a.rank - b.rank)
    return list
  }, [filteredMovies, sortOrder, selectedServices])
  ```
- `onClear`: resets `sortOrder` to `'rank'` and `selectedServices` to empty Set
- Render `<FilterBar>` between `<SearchBar>` and `<MovieGrid>`

### `src/components/MovieGrid.tsx` (modify)

- **Remove** the internal `useMemo` sort — `App.tsx` now owns ordering
- Just maps the incoming `movies` array as-is

---

## Tests

### `src/components/FilterBar.test.tsx` (new)

- Renders the sort select, services trigger button, and Clear button
- Changing the sort `<Select>` fires `onSortOrderChange` with the new value
- Opening the popover lists every entry in `availableServices`
- Clicking a checkbox fires `onSelectedServicesChange` with an updated Set
- Trigger label shows count (e.g. `Services (2)`) when services are selected
- Clear button is disabled when state is default; enabled otherwise; click fires `onClear`

### `src/components/MovieGrid.test.tsx` (extend / update)

- Remove the existing sort assertion (now App's responsibility)
- Add: renders movies in the exact order they're passed (no internal sort)

---

## Done when

- Sort dropdown reorders the grid (Rank / Highest / Lowest)
- Selecting one or more streaming services filters the grid (OR logic)
- Trigger label reflects selection count
- Clear resets sort + service filters
- `npm run test:run` passes
- `npm run build` passes
