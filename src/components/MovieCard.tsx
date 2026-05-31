import { useState } from 'react'
import type { Movie } from '@/types/movie'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function MovieCard({ movie }: { movie: Movie }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="aspect-[2/3] perspective-[1000px] cursor-pointer">
      <div
        data-testid="movie-card-inner"
        className={cn(
          'relative w-full h-full transition-transform duration-500 transform-3d',
          isFlipped && 'rotate-y-180',
        )}
        onClick={() => setIsFlipped((f) => !f)}
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden">
          {!imageLoaded && (
            <Skeleton
              data-testid="poster-skeleton"
              className="absolute inset-0 rounded-lg"
            />
          )}
          <img
            src={movie.poster}
            alt={movie.title}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              'object-cover w-full h-full rounded-lg transition-opacity duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0',
            )}
          />
          <Badge className="absolute top-2 left-2">#{movie.rank}</Badge>
          <Badge variant="secondary" className="absolute top-2 right-2">
            {movie.rating.toFixed(1)}
          </Badge>
        </div>

        {/* BACK — task 09 */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg bg-card" />
      </div>
    </div>
  )
}
