import { useState } from 'react'
import type { Movie } from '@/types/movie'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg bg-card text-card-foreground p-4 flex flex-col gap-3 overflow-hidden">
          <h3 className="text-lg font-bold line-clamp-2">{movie.title}</h3>
          <p className="text-base text-muted-foreground">{movie.year}</p>
          {movie.streaming_au.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Not available for streaming in AU
            </p>
          ) : (
            <ScrollArea className="flex-1">
              <div
                className="flex flex-wrap gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {movie.streaming_au.map((service) => (
                  <Tooltip key={service.name}>
                    <TooltipTrigger asChild>
                      <img
                        src={service.logo}
                        alt={service.name}
                        className="w-14 h-14 rounded"
                      />
                    </TooltipTrigger>
                    <TooltipContent>{service.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}
