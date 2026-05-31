import { Input } from '@/components/ui/input'

export type SearchBarProps = {
  query: string
  onQueryChange: (q: string) => void
}

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Input
        type="search"
        placeholder="Search movies…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search movies"
      />
    </div>
  )
}
