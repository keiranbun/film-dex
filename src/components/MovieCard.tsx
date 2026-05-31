import type { Movie } from '@/types/movie'

// Stub — real implementation in tasks 08 and 09.
export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="aspect-[2/3] rounded-lg bg-muted flex items-center justify-center text-center text-xs text-muted-foreground p-2">
      #{movie.rank} {movie.title}
    </div>
  )
}
