import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MovieCard } from '@/components/MovieCard'
import type { Movie } from '@/types/movie'

const movie: Movie = {
  id: 278,
  rank: 1,
  title: 'The Shawshank Redemption',
  year: 1994,
  poster: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
  rating: 8.7,
  streaming_au: [
    {
      name: 'HBO Max',
      logo: 'https://image.tmdb.org/t/p/original/jbe4gVSfRlbPTdESXhEKpornsfu.jpg',
    },
  ],
}

describe('MovieCard (front face)', () => {
  it('renders the poster img with correct src and alt', () => {
    render(<MovieCard movie={movie} />)
    const img = screen.getByAltText(movie.title) as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', movie.poster)
  })

  it('shows rank badge and rating badge formatted to 1 decimal', () => {
    render(<MovieCard movie={{ ...movie, rank: 1, rating: 8.687 }} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('8.7')).toBeInTheDocument()
  })

  it('shows the skeleton placeholder before the image loads', () => {
    render(<MovieCard movie={movie} />)
    expect(screen.getByTestId('poster-skeleton')).toBeInTheDocument()
  })

  it('removes the skeleton after the image fires onLoad', () => {
    render(<MovieCard movie={movie} />)
    expect(screen.getByTestId('poster-skeleton')).toBeInTheDocument()
    fireEvent.load(screen.getByAltText(movie.title))
    expect(screen.queryByTestId('poster-skeleton')).not.toBeInTheDocument()
  })

  it('flips the card when clicked (adds rotate-y-180 to inner div)', async () => {
    const user = userEvent.setup()
    render(<MovieCard movie={movie} />)
    const inner = screen.getByTestId('movie-card-inner')
    expect(inner).not.toHaveClass('rotate-y-180')
    await user.click(inner)
    expect(inner).toHaveClass('rotate-y-180')
  })

  it('un-flips the card on a second click', async () => {
    const user = userEvent.setup()
    render(<MovieCard movie={movie} />)
    const inner = screen.getByTestId('movie-card-inner')
    await user.click(inner)
    expect(inner).toHaveClass('rotate-y-180')
    await user.click(inner)
    expect(inner).not.toHaveClass('rotate-y-180')
  })
})
