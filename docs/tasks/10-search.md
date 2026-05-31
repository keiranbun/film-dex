# Task 10 — Search Bar

Add a search input that filters the grid by movie title in real time.

---

## New shadcn component

```sh
npx shadcn@latest add input
```

---

## Files

### `src/components/SearchBar.tsx` (new)

Controlled input component. Props:

```ts
type SearchBarProps = {
  query: string
  onQueryChange: (q: string) => void
}
```

- Wraps a Shadcn `<Input>` with `placeholder="Search movies…"`
- `value={query}` and `onChange={(e) => onQueryChange(e.target.value)}`
- Container: `w-full max-w-md mx-auto` (centred, capped width)
- No internal state — pure controlled component

### `src/App.tsx` (modify)

- Add `const [query, setQuery] = useState('')`
- Compute `filteredMovies`:
  ```ts
  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  )
  ```
- Render layout:
  ```tsx
  <header>…</header>
  <main className="container mx-auto p-4 space-y-4">
    <SearchBar query={query} onQueryChange={setQuery} />
    <MovieGrid movies={filteredMovies} query={query} />
  </main>
  ```

### `src/components/MovieGrid.tsx` (modify)

- Accept optional `query?: string` prop
- When `movies.length === 0`, render an empty state instead of the grid:
  ```tsx
  <p className="text-center text-muted-foreground py-12">
    No movies match "{query}"
  </p>
  ```
- Existing sort logic stays (removed in task 11)

---

## Tests

### `src/components/SearchBar.test.tsx` (new)

- Renders an input with placeholder text "Search movies…"
- Typing into the input fires `onQueryChange` with the new value
- Input reflects the `query` prop value

### `src/components/MovieGrid.test.tsx` (extend)

- When `movies` is empty and `query` is set, shows `No movies match "{query}"`
- When `movies` is empty and no `query`, shows the empty state without the quoted string (or no message — pick one and assert it)

---

## Done when

- A search input is visible above the grid
- Typing filters the grid live (case-insensitive title match)
- Empty results show a helpful message including the query
- `npm run test:run` passes
- `npm run build` passes
