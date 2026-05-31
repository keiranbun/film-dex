# Task 05 — Types

**Status:** Complete

Define the shared TypeScript types that match the shape of `data/movies.json`.
These types are imported by every component that touches movie data.

---

## File

**`src/types/movie.ts`**

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

## Done when

- `src/types/movie.ts` exists with both types exported
- `npm run build` passes
