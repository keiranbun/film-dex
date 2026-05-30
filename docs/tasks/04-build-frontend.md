# Task 04 — Build Frontend

Build the movie grid and flip card UI using React, Tailwind, and Shadcn.

---

## Components

### `src/types/movie.ts`

Shared TypeScript types matching the shape of `data/movies.json`:

```ts
export type StreamingService = {
  name: string
  logo: string
}

export type Movie = {
  id: number
  rank: number
  title: string
  year: number
  poster: string
  rating: number
  streaming_au: StreamingService[]
}
```

---

### `src/App.tsx`

- Imports `data/movies.json`
- Renders a responsive grid of `<MovieCard />` components
- One card per film, sorted by `rank`

---

### `src/components/MovieCard.tsx`

A CSS flip card:

**Front:**
- Movie poster image (full bleed)
- IMDB rank badge (top-left)
- Rating badge (top-right)

**Back:**
- Movie title
- Year
- List of AU streaming services — logo + name per service
- "Not available for streaming in AU" message if `streaming_au` is empty

**Interaction:**
- Click to flip
- Click again (or click elsewhere) to flip back

---

## Layout

- Responsive grid: 2 cols mobile → 4 cols tablet → 5 cols desktop
- Cards are uniform size with fixed aspect ratio (poster proportions: 2:3)

---

## Done when

- All 100 cards render in the grid
- Each card flips on click to show streaming info
- No streaming available state is handled gracefully
- Layout is responsive across mobile and desktop
