import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MovieGrid } from '@/components/MovieGrid'
import type { Movie } from '@/types/movie'

vi.mock('@/components/MovieCard', () => ({
  MovieCard: ({
    movie,
    isWatched,
    onToggleWatched,
  }: {
    movie: Movie
    isWatched?: boolean
    onToggleWatched?: () => void
  }) => (
    <div
      data-testid="movie-card"
      data-movie-id={movie.id}
      data-is-watched={String(Boolean(isWatched))}
    >
      {movie.title}
      {onToggleWatched && (
        <button
          type="button"
          data-testid={`toggle-${movie.id}`}
          onClick={onToggleWatched}
        >
          toggle
        </button>
      )}
    </div>
  ),
}))

function makeMovie(overrides: Partial<Movie> & Pick<Movie, 'id' | 'rank' | 'title'>): Movie {
  return {
    year: 2000,
    poster: 'https://example.com/p.jpg',
    rating: 8.0,
    streaming_au: [],
    ...overrides,
  }
}

describe('MovieGrid', () => {
  it('renders one card per movie in the input array', () => {
    const movies = [
      makeMovie({ id: 1, rank: 1, title: 'A' }),
      makeMovie({ id: 2, rank: 2, title: 'B' }),
      makeMovie({ id: 3, rank: 3, title: 'C' }),
    ]
    render(<MovieGrid movies={movies} />)
    expect(screen.getAllByTestId('movie-card')).toHaveLength(3)
  })

  it('renders cards in the exact order received (no internal sort)', () => {
    const movies = [
      makeMovie({ id: 30, rank: 3, title: 'Third' }),
      makeMovie({ id: 10, rank: 1, title: 'First' }),
      makeMovie({ id: 20, rank: 2, title: 'Second' }),
    ]
    render(<MovieGrid movies={movies} />)
    const titles = screen.getAllByTestId('movie-card').map((el) => el.textContent)
    expect(titles).toEqual(['Third', 'First', 'Second'])
  })

  it('renders nothing (no crash, empty grid) when given an empty array', () => {
    const { container } = render(<MovieGrid movies={[]} />)
    expect(screen.queryAllByTestId('movie-card')).toHaveLength(0)
    expect(container.firstChild).not.toBeNull()
    expect((container.firstChild as HTMLElement).children).toHaveLength(0)
  })

  it('shows the query-aware empty state when movies is empty and query is set', () => {
    render(<MovieGrid movies={[]} query="batman" />)
    expect(screen.getByText(/No movies match "batman"/)).toBeInTheDocument()
  })

  it('shows the generic empty state when movies is empty and no query is provided', () => {
    render(<MovieGrid movies={[]} />)
    expect(screen.getByText('No movies to show')).toBeInTheDocument()
    expect(screen.queryByText(/No movies match/)).not.toBeInTheDocument()
  })

  it('forwards isWatched(id) per card', () => {
    const movies = [
      makeMovie({ id: 1, rank: 1, title: 'A' }),
      makeMovie({ id: 2, rank: 2, title: 'B' }),
    ]
    render(
      <MovieGrid
        movies={movies}
        isWatched={(id) => id === 1}
        onToggleWatched={vi.fn()}
      />,
    )
    const cards = screen.getAllByTestId('movie-card')
    expect(cards[0]).toHaveAttribute('data-movie-id', '1')
    expect(cards[0]).toHaveAttribute('data-is-watched', 'true')
    expect(cards[1]).toHaveAttribute('data-movie-id', '2')
    expect(cards[1]).toHaveAttribute('data-is-watched', 'false')
  })

  it('invokes onToggleWatched with the correct movie id', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const movies = [
      makeMovie({ id: 7, rank: 1, title: 'A' }),
      makeMovie({ id: 9, rank: 2, title: 'B' }),
    ]
    render(<MovieGrid movies={movies} onToggleWatched={onToggle} />)
    await user.click(screen.getByTestId('toggle-9'))
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith(9)
  })
})
