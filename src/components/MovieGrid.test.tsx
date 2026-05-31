import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MovieGrid } from '@/components/MovieGrid'
import type { Movie } from '@/types/movie'

vi.mock('@/components/MovieCard', () => ({
  MovieCard: ({ movie }: { movie: Movie }) => (
    <div data-testid="movie-card">{movie.title}</div>
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

  it('renders cards in rank order even when input is unsorted', () => {
    const movies = [
      makeMovie({ id: 30, rank: 3, title: 'Third' }),
      makeMovie({ id: 10, rank: 1, title: 'First' }),
      makeMovie({ id: 20, rank: 2, title: 'Second' }),
    ]
    render(<MovieGrid movies={movies} />)
    const titles = screen.getAllByTestId('movie-card').map((el) => el.textContent)
    expect(titles).toEqual(['First', 'Second', 'Third'])
  })

  it('renders nothing (no crash, empty grid) when given an empty array', () => {
    const { container } = render(<MovieGrid movies={[]} />)
    expect(screen.queryAllByTestId('movie-card')).toHaveLength(0)
    expect(container.firstChild).not.toBeNull()
    expect((container.firstChild as HTMLElement).children).toHaveLength(0)
  })
})
