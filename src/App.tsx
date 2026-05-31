import { useMemo, useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ModeToggle } from '@/components/mode-toggle'
import { MovieGrid } from '@/components/MovieGrid'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar, type SortOrder } from '@/components/FilterBar'
import type { Movie } from '@/types/movie'
import moviesData from '../data/movies.json'

const movies = moviesData as Movie[]

function App() {
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('rank')
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(),
  )

  const availableServices = useMemo(() => {
    const set = new Set<string>()
    for (const m of movies) {
      for (const s of m.streaming_au) set.add(s.name)
    }
    return [...set].sort()
  }, [])

  const filteredMovies = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return movies
    return movies.filter((m) => m.title.toLowerCase().includes(q))
  }, [query])

  const visibleMovies = useMemo(() => {
    let list = filteredMovies
    if (selectedServices.size > 0) {
      list = list.filter((m) =>
        m.streaming_au.some((s) => selectedServices.has(s.name)),
      )
    }
    if (sortOrder === 'rating-asc') {
      list = [...list].sort((a, b) => b.rank - a.rank)
    } else if (sortOrder === 'title-asc') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOrder === 'title-desc') {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title))
    } else {
      list = [...list].sort((a, b) => a.rank - b.rank)
    }
    return list
  }, [filteredMovies, sortOrder, selectedServices])

  const handleClear = () => {
    setSortOrder('rank')
    setSelectedServices(new Set())
  }

  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
              <h1 className="text-2xl font-bold tracking-tight">FilmDex</h1>
              <ModeToggle />
            </div>
          </header>
          <main className="container mx-auto px-4 py-6 space-y-4">
            <SearchBar query={query} onQueryChange={setQuery} />
            <FilterBar
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              availableServices={availableServices}
              selectedServices={selectedServices}
              onSelectedServicesChange={setSelectedServices}
              onClear={handleClear}
            />
            <MovieGrid movies={visibleMovies} query={query} />
          </main>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
