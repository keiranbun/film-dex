import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactElement } from 'react'
import userEvent from '@testing-library/user-event'
import { MovieCard } from '@/components/MovieCard'
import { TooltipProvider } from '@/components/ui/tooltip'
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

function renderWithProviders(ui: ReactElement) {
  return render(<TooltipProvider delayDuration={0}>{ui}</TooltipProvider>)
}

describe('MovieCard (front face)', () => {
  it('renders the poster img with correct src and alt', () => {
    renderWithProviders(<MovieCard movie={movie} />)
    const img = screen.getByAltText(movie.title) as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', movie.poster)
  })

  it('shows rank badge and rating badge formatted to 1 decimal', () => {
    renderWithProviders(<MovieCard movie={{ ...movie, rank: 1, rating: 8.687 }} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('8.7')).toBeInTheDocument()
  })

  it('shows the skeleton placeholder before the image loads', () => {
    renderWithProviders(<MovieCard movie={movie} />)
    expect(screen.getByTestId('poster-skeleton')).toBeInTheDocument()
  })

  it('removes the skeleton after the image fires onLoad', () => {
    renderWithProviders(<MovieCard movie={movie} />)
    expect(screen.getByTestId('poster-skeleton')).toBeInTheDocument()
    fireEvent.load(screen.getByAltText(movie.title))
    expect(screen.queryByTestId('poster-skeleton')).not.toBeInTheDocument()
  })

  it('flips the card when clicked (adds rotate-y-180 to inner div)', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MovieCard movie={movie} />)
    const inner = screen.getByTestId('movie-card-inner')
    expect(inner).not.toHaveClass('rotate-y-180')
    await user.click(inner)
    expect(inner).toHaveClass('rotate-y-180')
  })

  it('un-flips the card on a second click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MovieCard movie={movie} />)
    const inner = screen.getByTestId('movie-card-inner')
    await user.click(inner)
    expect(inner).toHaveClass('rotate-y-180')
    await user.click(inner)
    expect(inner).not.toHaveClass('rotate-y-180')
  })
})

describe('MovieCard (back face)', () => {
  const multiStreamMovie: Movie = {
    ...movie,
    streaming_au: [
      { name: 'HBO Max', logo: 'https://example.com/hbo.png' },
      { name: 'Netflix', logo: 'https://example.com/netflix.png' },
      { name: 'Stan', logo: 'https://example.com/stan.png' },
    ],
  }

  it('shows the title and year on the back face after flipping', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MovieCard movie={movie} />)
    await user.click(screen.getByTestId('movie-card-inner'))
    // Title appears on both faces, so getAllByText
    expect(screen.getAllByText(movie.title).length).toBeGreaterThan(0)
    expect(screen.getByText(String(movie.year))).toBeInTheDocument()
  })

  it('renders one img per streaming_au entry with correct src and alt', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MovieCard movie={multiStreamMovie} />)
    await user.click(screen.getByTestId('movie-card-inner'))
    for (const service of multiStreamMovie.streaming_au) {
      const img = screen.getByAltText(service.name) as HTMLImageElement
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', service.logo)
    }
  })

  it('shows a tooltip with the service name when hovering its logo', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MovieCard movie={multiStreamMovie} />)
    await user.click(screen.getByTestId('movie-card-inner'))
    const logo = screen.getByAltText('Netflix')
    await user.hover(logo)
    // Radix renders the tooltip content (possibly multiple copies for a11y).
    const tooltips = await screen.findAllByText('Netflix')
    // At least one rendered node beyond the alt-text-only img reference exists
    expect(tooltips.length).toBeGreaterThan(0)
  })

  it('shows the unavailable message and no logos when streaming_au is empty', async () => {
    const user = userEvent.setup()
    const empty: Movie = { ...movie, streaming_au: [] }
    renderWithProviders(<MovieCard movie={empty} />)
    await user.click(screen.getByTestId('movie-card-inner'))
    expect(
      screen.getByText('Not available for streaming in AU'),
    ).toBeInTheDocument()
    // Only the poster img remains
    const imgs = screen.getAllByRole('img')
    expect(imgs).toHaveLength(1)
    expect(imgs[0]).toHaveAttribute('alt', movie.title)
  })

  it('does not flip back when clicking a streaming logo', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MovieCard movie={multiStreamMovie} />)
    const inner = screen.getByTestId('movie-card-inner')
    await user.click(inner)
    expect(inner).toHaveClass('rotate-y-180')
    await user.click(screen.getByAltText('HBO Max'))
    expect(inner).toHaveClass('rotate-y-180')
  })

  it('flips back to front when clicking elsewhere on the back face', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MovieCard movie={movie} />)
    const inner = screen.getByTestId('movie-card-inner')
    await user.click(inner)
    expect(inner).toHaveClass('rotate-y-180')
    // Click the title on the back face (outside the logos container)
    await user.click(screen.getByText(String(movie.year)))
    expect(inner).not.toHaveClass('rotate-y-180')
  })
})
