import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ModeToggle } from '@/components/mode-toggle'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

function setMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function renderToggle() {
  return render(
    <ThemeProvider>
      <TooltipProvider>
        <ModeToggle />
      </TooltipProvider>
    </ThemeProvider>
  )
}

describe('ModeToggle', () => {
  beforeEach(() => {
    // Start in light mode explicitly so the initial icon is deterministic.
    setMatchMedia(false)
    window.localStorage.setItem('filmdex-theme', 'light')
  })

  it('renders a button', () => {
    renderToggle()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('toggles light ↔ dark on click', async () => {
    const user = userEvent.setup()
    renderToggle()

    // Starts in light → aria-label advertises the next state (dark).
    expect(
      screen.getByRole('button', { name: /switch to dark mode/i })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(
      screen.getByRole('button', { name: /switch to light mode/i })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(
      screen.getByRole('button', { name: /switch to dark mode/i })
    ).toBeInTheDocument()
  })

  it('shows Sun icon when theme is light and Moon icon when theme is dark', async () => {
    const user = userEvent.setup()
    renderToggle()

    const button = screen.getByRole('button')

    // light mode → Sun
    expect(button.querySelector('.lucide-sun')).not.toBeNull()
    expect(button.querySelector('.lucide-moon')).toBeNull()

    // click → dark mode → Moon
    await user.click(button)
    expect(button.querySelector('.lucide-moon')).not.toBeNull()
    expect(button.querySelector('.lucide-sun')).toBeNull()
  })
})
