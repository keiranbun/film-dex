import { useMemo } from 'react'
import type { Movie } from '@/types/movie'
import { MovieCard } from '@/components/MovieCard'

export function MovieGrid({
  movies,
  query,
}: {
  movies: Movie[]
  query?: string
}) {
  const sorted = useMemo(
    () => [...movies].sort((a, b) => a.rank - b.rank),
    [movies],
  )

  if (sorted.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        {query ? `No movies match "${query}"` : 'No movies to show'}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {sorted.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
