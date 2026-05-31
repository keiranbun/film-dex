import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '@/components/SearchBar'

describe('SearchBar', () => {
  it('renders an input with the expected placeholder', () => {
    render(<SearchBar query="" onQueryChange={() => {}} />)
    expect(screen.getByPlaceholderText('Search movies…')).toBeInTheDocument()
  })

  it('fires onQueryChange for each keystroke with the new value', async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()
    render(<SearchBar query="" onQueryChange={onQueryChange} />)

    await user.type(screen.getByPlaceholderText('Search movies…'), 'abc')

    expect(onQueryChange).toHaveBeenCalledTimes(3)
    // Component is controlled with query="", so each call receives a single char
    expect(onQueryChange).toHaveBeenNthCalledWith(1, 'a')
    expect(onQueryChange).toHaveBeenNthCalledWith(2, 'b')
    expect(onQueryChange).toHaveBeenNthCalledWith(3, 'c')
  })

  it('reflects the query prop as the input value', () => {
    render(<SearchBar query="inception" onQueryChange={() => {}} />)
    expect(screen.getByPlaceholderText('Search movies…')).toHaveValue('inception')
  })
})
