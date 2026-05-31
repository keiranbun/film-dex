import type { Movie } from '@/types/movie'
import { MovieCard } from '@/components/MovieCard'

export type MovieGridProps = {
  movies: Movie[]
  query?: string
  isWatched?: (id: number) => boolean
  onToggleWatched?: (id: number) => void
}

export function MovieGrid({
  movies,
  query,
  isWatched,
  onToggleWatched,
}: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        {query ? `No movies match "${query}"` : 'No movies to show'}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isWatched={isWatched?.(movie.id) ?? false}
          onToggleWatched={
            onToggleWatched ? () => onToggleWatched(movie.id) : undefined
          }
        />
      ))}
    </div>
  )
}
