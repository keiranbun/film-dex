import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export type SortOrder = 'rank' | 'rating-asc' | 'title-asc' | 'title-desc'

export type FilterBarProps = {
  sortOrder: SortOrder
  onSortOrderChange: (s: SortOrder) => void
  availableServices: string[]
  selectedServices: Set<string>
  onSelectedServicesChange: (s: Set<string>) => void
  onClear: () => void
}

export function FilterBar({
  sortOrder,
  onSortOrderChange,
  availableServices,
  selectedServices,
  onSelectedServicesChange,
  onClear,
}: FilterBarProps) {
  const isDefault = sortOrder === 'rank' && selectedServices.size === 0
  const servicesLabel =
    selectedServices.size > 0
      ? `Services (${selectedServices.size})`
      : 'Services'

  const toggleService = (name: string, checked: boolean) => {
    const next = new Set(selectedServices)
    if (checked) next.add(name)
    else next.delete(name)
    onSelectedServicesChange(next)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={sortOrder}
        onValueChange={(v) => onSortOrderChange(v as SortOrder)}
      >
        <SelectTrigger
          className="w-[180px]"
          aria-label="Sort order"
        >
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rank">Rank</SelectItem>
          <SelectItem value="rating-asc">Lowest rating</SelectItem>
          <SelectItem value="title-asc">A → Z</SelectItem>
          <SelectItem value="title-desc">Z → A</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">{servicesLabel}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="max-h-72 overflow-y-auto flex flex-col gap-1">
            {availableServices.map((name) => {
              const id = `service-${name}`
              const checked = selectedServices.has(name)
              return (
                <div
                  key={name}
                  className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(c) => toggleService(name, c === true)}
                  />
                  <Label
                    htmlFor={id}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {name}
                  </Label>
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        onClick={onClear}
        disabled={isDefault}
        className="ml-auto"
      >
        Clear
      </Button>
    </div>
  )
}
