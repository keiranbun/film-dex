import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWatched } from '@/hooks/useWatched'

const KEY = 'filmdex-watched'

describe('useWatched', () => {
  it('starts with an empty Set when localStorage is clean', () => {
    const { result } = renderHook(() => useWatched())
    expect(result.current.watchedIds).toBeInstanceOf(Set)
    expect(result.current.watchedIds.size).toBe(0)
    expect(result.current.isWatched(42)).toBe(false)
  })

  it('toggle(id) adds the id; calling again removes it', () => {
    const { result } = renderHook(() => useWatched())

    act(() => result.current.toggle(42))
    expect(result.current.watchedIds.has(42)).toBe(true)
    expect(result.current.isWatched(42)).toBe(true)

    act(() => result.current.toggle(42))
    expect(result.current.watchedIds.has(42)).toBe(false)
    expect(result.current.isWatched(42)).toBe(false)
  })

  it('writes the current set to localStorage as a JSON array after changes', () => {
    const { result } = renderHook(() => useWatched())

    act(() => result.current.toggle(1))
    act(() => result.current.toggle(2))

    const raw = localStorage.getItem(KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw as string)
    expect(Array.isArray(parsed)).toBe(true)
    expect(new Set(parsed)).toEqual(new Set([1, 2]))

    act(() => result.current.toggle(1))
    const after = JSON.parse(localStorage.getItem(KEY) as string)
    expect(new Set(after)).toEqual(new Set([2]))
  })

  it('reads existing IDs from localStorage on mount', () => {
    localStorage.setItem(KEY, JSON.stringify([1, 2, 3]))
    const { result } = renderHook(() => useWatched())
    expect(result.current.watchedIds).toEqual(new Set([1, 2, 3]))
    expect(result.current.isWatched(2)).toBe(true)
    expect(result.current.isWatched(99)).toBe(false)
  })

  it('setWatched replaces watchedIds exactly with the provided set', () => {
    const { result } = renderHook(() => useWatched())

    act(() => result.current.toggle(99))
    expect(result.current.watchedIds.has(99)).toBe(true)

    act(() => result.current.setWatched(new Set([1, 2, 3])))
    expect(result.current.watchedIds).toEqual(new Set([1, 2, 3]))
    expect(result.current.watchedIds.has(99)).toBe(false)
  })

  it('setWatched persists the new set to localStorage', () => {
    const { result } = renderHook(() => useWatched())

    act(() => result.current.setWatched(new Set([3, 1, 2])))

    const raw = localStorage.getItem(KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw as string) as number[]
    expect([...parsed].sort()).toEqual([1, 2, 3])
  })

  it('setWatched(new Set()) clears a pre-seeded set', () => {
    localStorage.setItem(KEY, JSON.stringify([1, 2, 3]))
    const { result } = renderHook(() => useWatched())
    expect(result.current.watchedIds.size).toBe(3)

    act(() => result.current.setWatched(new Set()))
    expect(result.current.watchedIds.size).toBe(0)

    const raw = localStorage.getItem(KEY)
    expect(JSON.parse(raw as string)).toEqual([])
  })
})
