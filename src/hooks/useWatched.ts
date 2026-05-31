import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'filmdex-watched'

function readFromStorage(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((v): v is number => typeof v === 'number'))
  } catch {
    return new Set()
  }
}

function writeToStorage(ids: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
  } catch {
    // ignore (private mode, quota, etc.)
  }
}

export function useWatched(): {
  watchedIds: Set<number>
  toggle: (id: number) => void
  isWatched: (id: number) => boolean
  setWatched: (ids: Set<number>) => void
} {
  const [watchedIds, setWatchedIds] = useState<Set<number>>(() =>
    readFromStorage(),
  )

  useEffect(() => {
    writeToStorage(watchedIds)
  }, [watchedIds])

  const toggle = useCallback((id: number) => {
    setWatchedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isWatched = useCallback(
    (id: number) => watchedIds.has(id),
    [watchedIds],
  )

  const setWatched = useCallback((ids: Set<number>) => {
    setWatchedIds(new Set(ids))
  }, [])

  return { watchedIds, toggle, isWatched, setWatched }
}
