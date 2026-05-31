import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, renderHook, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/components/theme-provider'

const STORAGE_KEY = 'filmdex-theme'

function setMatchMedia(matches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>()
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: vi.fn((_: string, l: (e: MediaQueryListEvent) => void) => {
      listeners.add(l)
    }),
    removeEventListener: vi.fn((_: string, l: (e: MediaQueryListEvent) => void) => {
      listeners.delete(l)
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn((event: Event) => {
      listeners.forEach((l) => l(event as MediaQueryListEvent))
      return true
    }),
  }
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue(mql),
  })
  return { mql, listeners }
}

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    setMatchMedia(false)
  })

  it('defaults to system "light" when no localStorage value and prefers-color-scheme is light', () => {
    setMatchMedia(false)
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('light')
  })

  it('defaults to system "dark" when no localStorage value and prefers-color-scheme is dark', () => {
    setMatchMedia(true)
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('dark')
  })

  it('reads the stored value on mount when localStorage has one, ignoring system preference', () => {
    setMatchMedia(true) // system would say dark
    window.localStorage.setItem(STORAGE_KEY, 'light')
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('light')
  })

  it('setTheme("dark") adds the `dark` class to <html>', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => result.current.setTheme('dark'))
    expect(document.documentElement).toHaveClass('dark')
  })

  it('setTheme("light") removes the `dark` class', () => {
    document.documentElement.classList.add('dark')
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => result.current.setTheme('light'))
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('persists the chosen theme to localStorage under key `filmdex-theme`', async () => {
    const user = userEvent.setup()
    function Probe() {
      const { theme, setTheme } = useTheme()
      return (
        <button onClick={() => setTheme('dark')}>
          set-dark:{theme}
        </button>
      )
    }
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    )
    await user.click(screen.getByRole('button'))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark')
  })

  it('does NOT update when matchMedia fires a change event after mount', () => {
    const { mql, listeners } = setMatchMedia(false)
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('light')

    // Flip system preference and fire a change event. The provider should
    // ignore it — theme is fully user-controlled after mount.
    mql.matches = true
    act(() => {
      listeners.forEach((l) =>
        l({ matches: true, media: '(prefers-color-scheme: dark)' } as MediaQueryListEvent)
      )
    })

    expect(result.current.theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })
})
