# Task 06 — Movie Grid

Render all 100 movies as a responsive grid inside the app shell, with skeleton
placeholders for the poster images while they load.

---

## Data loading

`src/App.tsx` imports `data/movies.json` directly:

```ts
import movies from '../data/movies.json'
import type { Movie } from '@/types/movie'
```

Vite resolves the JSON import at build time, so no runtime fetch is needed.

Cast the import to `Movie[]` when using it.

---

## Grid component

### `src/components/MovieGrid.tsx`

- Accepts `movies: Movie[]` as a prop
- Renders one `<MovieCard movie={...} />` per entry, sorted by `rank`
- Grid uses Tailwind:
  - Mobile: 2 columns
  - Tablet (`md:`): 4 columns
  - Desktop (`lg:`): 5 columns
  - Gap: `gap-4`

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
  {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
</div>
```

---

## Skeleton loading

Poster images are remote (TMDB CDN) so they load progressively. The card front
should show a `<Skeleton />` placeholder until the `<img>` fires its `onLoad`.

This logic lives inside `MovieCard` (task 07), but the requirement is captured
here because the grid is what makes loading observable.

---

## Aspect ratio

Cards are uniform with a **2:3 aspect ratio** (standard movie poster proportions).
Apply with Tailwind's `aspect-[2/3]` on the card container so the grid stays
clean even before images load.

---

## Tests

**`src/components/MovieGrid.test.tsx`**
- Renders one card per movie in the input array
- Cards appear in `rank` order even if the input is unsorted
- Renders nothing (no crash, empty grid) when given an empty array

> Mock `MovieCard` to a simple `<div data-testid="movie-card">{movie.title}</div>` so the grid test stays focused on layout/ordering, not the card internals.

---

## Done when

- All 100 cards render in the grid
- Grid responds correctly at mobile, tablet, and desktop breakpoints
- All cards keep the 2:3 aspect ratio regardless of image load state
- `npm run build` passes
