import { useMemo } from 'react'
import type { Movie } from '@/types/movie'
import { MovieCard } from '@/components/MovieCard'

export function MovieGrid({ movies }: { movies: Movie[] }) {
  const sorted = useMemo(
    () => [...movies].sort((a, b) => a.rank - b.rank),
    [movies]
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {sorted.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
