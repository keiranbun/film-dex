import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TooltipProvider } from '@/components/ui/tooltip'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

import { toast } from 'sonner'
import { WatchedIO } from '@/components/WatchedIO'
import type { Movie } from '@/types/movie'

// Radix DropdownMenu needs these in jsdom
beforeAll(() => {
  Element.prototype.hasPointerCapture = vi.fn() as never
  Element.prototype.releasePointerCapture = vi.fn() as never
  Element.prototype.scrollIntoView = vi.fn() as never
})

beforeEach(() => {
  vi.clearAllMocks()
  ;(URL as unknown as { createObjectURL: () => string }).createObjectURL = vi.fn(
    () => 'blob:mock-url',
  )
  ;(URL as unknown as { revokeObjectURL: () => void }).revokeObjectURL = vi.fn()
})

const sampleMovies: Movie[] = [
  { id: 1, rank: 1, title: 'A', year: 2000, poster: '', rating: 8, streaming_au: [] },
  { id: 2, rank: 2, title: 'B', year: 2001, poster: '', rating: 7, streaming_au: [] },
  { id: 3, rank: 3, title: 'C', year: 2002, poster: '', rating: 6, streaming_au: [] },
]

function renderComponent(overrides: Partial<React.ComponentProps<typeof WatchedIO>> = {}) {
  const props: React.ComponentProps<typeof WatchedIO> = {
    movies: sampleMovies,
    watchedIds: new Set([1, 3]),
    onSetWatched: vi.fn(),
    ...overrides,
  }
  const user = userEvent.setup()
  const utils = render(
    <TooltipProvider>
      <WatchedIO {...props} />
    </TooltipProvider>,
  )
  return { user, props, ...utils }
}

describe('WatchedIO', () => {
  it('renders the Watchlist trigger button', () => {
    renderComponent()
    expect(screen.getByRole('button', { name: 'Watchlist' })).toBeInTheDocument()
  })

  it('opens the menu with Export and Import items', async () => {
    const { user } = renderComponent()
    await user.click(screen.getByRole('button', { name: 'Watchlist' }))
    expect(await screen.findByRole('menuitem', { name: /Export/ })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Import/ })).toBeInTheDocument()
  })

  it('Export creates a blob, downloads filmdex-watchlist.json, and revokes the URL', async () => {
    const realCreate = document.createElement.bind(document)
    const clickSpy = vi.fn()
    const createdAnchors: HTMLAnchorElement[] = []
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = realCreate(tag) as HTMLElement
      if (tag === 'a') {
        ;(el as HTMLAnchorElement).click = clickSpy
        createdAnchors.push(el as HTMLAnchorElement)
      }
      return el as never
    })

    const { user } = renderComponent()
    await user.click(screen.getByRole('button', { name: 'Watchlist' }))
    await user.click(await screen.findByRole('menuitem', { name: /Export/ }))

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    const arg = (URL.createObjectURL as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(arg).toBeInstanceOf(Blob)

    expect(createdAnchors.length).toBeGreaterThan(0)
    const anchor = createdAnchors[createdAnchors.length - 1]
    expect(anchor.download).toBe('filmdex-watchlist.json')
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
  })

  it('Import valid file calls onSetWatched with the watched ids', async () => {
    const onSetWatched = vi.fn()
    renderComponent({ onSetWatched })

    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      movies: [
        { id: 1, title: 'A', watched: true },
        { id: 2, title: 'B', watched: false },
        { id: 3, title: 'C', watched: true },
      ],
    }
    const file = new File([JSON.stringify(payload)], 'watchlist.json', {
      type: 'application/json',
    })

    const input = screen.getByLabelText('Import watchlist file', {
      selector: 'input',
    }) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => expect(onSetWatched).toHaveBeenCalled())
    expect(onSetWatched).toHaveBeenCalledWith(new Set([1, 3]))
  })

  it('Import valid file shows a success toast with the count', async () => {
    renderComponent()

    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      movies: [
        { id: 1, title: 'A', watched: true },
        { id: 2, title: 'B', watched: false },
        { id: 3, title: 'C', watched: true },
      ],
    }
    const file = new File([JSON.stringify(payload)], 'watchlist.json', {
      type: 'application/json',
    })

    const input = screen.getByLabelText('Import watchlist file', {
      selector: 'input',
    }) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => expect(toast.success).toHaveBeenCalled())
    const msg = (toast.success as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(msg).toContain('2 movies')
  })

  it('Import malformed JSON shows error toast and does not call onSetWatched', async () => {
    const onSetWatched = vi.fn()
    renderComponent({ onSetWatched })

    const file = new File(['not json'], 'bad.json', { type: 'application/json' })
    const input = screen.getByLabelText('Import watchlist file', {
      selector: 'input',
    }) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
    expect(onSetWatched).not.toHaveBeenCalled()
  })

  it('Import wrong version shows error toast and does not call onSetWatched', async () => {
    const onSetWatched = vi.fn()
    renderComponent({ onSetWatched })

    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      movies: [{ id: 1, title: 'A', watched: true }],
    }
    const file = new File([JSON.stringify(payload)], 'watchlist.json', {
      type: 'application/json',
    })
    const input = screen.getByLabelText('Import watchlist file', {
      selector: 'input',
    }) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
    expect(onSetWatched).not.toHaveBeenCalled()
  })
})
