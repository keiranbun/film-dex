import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar, type FilterBarProps } from '@/components/FilterBar'

// Radix Select + Popover rely on Pointer Events APIs that jsdom doesn't
// implement. Stub them so trigger/option clicks don't throw.
beforeAll(() => {
  Element.prototype.hasPointerCapture = vi.fn() as never
  Element.prototype.releasePointerCapture = vi.fn() as never
  Element.prototype.scrollIntoView = vi.fn() as never
})

function setup(overrides: Partial<FilterBarProps> = {}) {
  const props: FilterBarProps = {
    sortOrder: 'rank',
    onSortOrderChange: vi.fn(),
    availableServices: ['Netflix', 'Stan', 'Disney+'],
    selectedServices: new Set<string>(),
    onSelectedServicesChange: vi.fn(),
    hideWatched: false,
    onHideWatchedChange: vi.fn(),
    onClear: vi.fn(),
    ...overrides,
  }
  const user = userEvent.setup({ pointerEventsCheck: 0 })
  const utils = render(<FilterBar {...props} />)
  return { user, props, ...utils }
}

describe('FilterBar', () => {
  it('renders the sort select trigger, services trigger, and Clear button', () => {
    setup()
    expect(screen.getByRole('combobox', { name: 'Sort order' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
  })

  it('fires onSortOrderChange with the new value when a sort option is picked', async () => {
    const { user, props } = setup()
    await user.click(screen.getByRole('combobox', { name: 'Sort order' }))
    // Radix Select portals options into the body; query within document
    const option = await screen.findByRole('option', { name: 'Lowest rating' })
    await user.click(option)
    expect(props.onSortOrderChange).toHaveBeenCalledWith('rating-asc')
  })

  it('lists all four sort options in the dropdown', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('combobox', { name: 'Sort order' }))
    expect(await screen.findByRole('option', { name: 'Rank' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Lowest rating' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'A → Z' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Z → A' })).toBeInTheDocument()
  })

  it('lists every available service when the popover is opened', async () => {
    const { user } = setup({
      availableServices: ['Netflix', 'Stan', 'Disney+', 'Binge'],
    })
    await user.click(screen.getByRole('button', { name: 'Services' }))
    // Each service rendered as a checkbox with matching label
    expect(await screen.findByLabelText('Netflix')).toBeInTheDocument()
    expect(screen.getByLabelText('Stan')).toBeInTheDocument()
    expect(screen.getByLabelText('Disney+')).toBeInTheDocument()
    expect(screen.getByLabelText('Binge')).toBeInTheDocument()
  })

  it('fires onSelectedServicesChange with the service added when its checkbox is clicked', async () => {
    const { user, props } = setup()
    await user.click(screen.getByRole('button', { name: 'Services' }))
    const checkbox = await screen.findByLabelText('Stan')
    await user.click(checkbox)
    expect(props.onSelectedServicesChange).toHaveBeenCalledTimes(1)
    const arg = (props.onSelectedServicesChange as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as Set<string>
    expect(arg).toBeInstanceOf(Set)
    expect(arg.has('Stan')).toBe(true)
    expect(arg.size).toBe(1)
  })

  it('fires onSelectedServicesChange with the service removed when an already-checked box is clicked', async () => {
    const { user, props } = setup({
      selectedServices: new Set(['Netflix', 'Stan']),
    })
    await user.click(screen.getByRole('button', { name: /Services/ }))
    const checkbox = await screen.findByLabelText('Netflix')
    await user.click(checkbox)
    const arg = (props.onSelectedServicesChange as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as Set<string>
    expect(arg.has('Netflix')).toBe(false)
    expect(arg.has('Stan')).toBe(true)
  })

  it('shows count in trigger label when services are selected', () => {
    setup({ selectedServices: new Set(['Netflix', 'Stan']) })
    expect(screen.getByRole('button', { name: 'Services (2)' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Services' })).not.toBeInTheDocument()
  })

  it('disables Clear at default state', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled()
  })

  it('enables Clear when sortOrder is not rank', () => {
    setup({ sortOrder: 'title-asc' })
    expect(screen.getByRole('button', { name: 'Clear' })).toBeEnabled()
  })

  it('enables Clear when at least one service is selected', () => {
    setup({ selectedServices: new Set(['Netflix']) })
    expect(screen.getByRole('button', { name: /Clear/ })).toBeEnabled()
  })

  it('fires onClear when Clear is clicked', async () => {
    const { user, props } = setup({ sortOrder: 'rating-asc' })
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(props.onClear).toHaveBeenCalledTimes(1)
  })

  it('renders the Hide watched switch', () => {
    setup()
    expect(screen.getByLabelText('Hide watched')).toBeInTheDocument()
  })

  it('fires onHideWatchedChange(true) when the switch is clicked from off', async () => {
    const { user, props } = setup()
    await user.click(screen.getByLabelText('Hide watched'))
    expect(props.onHideWatchedChange).toHaveBeenCalledTimes(1)
    expect(props.onHideWatchedChange).toHaveBeenCalledWith(true)
  })

  it('enables Clear when hideWatched is true (with default sort + no services)', () => {
    setup({ hideWatched: true })
    expect(screen.getByRole('button', { name: 'Clear' })).toBeEnabled()
  })
})
