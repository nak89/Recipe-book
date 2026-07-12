import { useEffect, useRef, useState } from 'react'
import { CUISINE_OPTIONS } from '../data/cuisines'

export interface Filters {
  search: string
  difficulty: string
  cuisine: string
  course: string
  maxDuration: string
  favouritesOnly: boolean
}

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onReset: () => void
}

interface DropdownOption {
  value: string
  label: string
  icon?: string
}

interface DropdownProps {
  id: string
  label: string
  value: string
  options: DropdownOption[]
  isOpen: boolean
  onToggle: () => void
  onSelect: (value: string) => void
  showIcons?: boolean
  scrollable?: boolean
}

function FilterDropdown({
  id,
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  showIcons = false,
  scrollable = false,
}: DropdownProps) {
  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  return (
    <div className='relative min-w-44 flex-1'>
      <button
        id={id}
        type='button'
        onClick={onToggle}
        className='app-input no-accent-hover flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm outline-none'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-labelledby={id}
      >
        <span className='flex items-center gap-3'>
          {showIcons && selectedOption.icon && (
            <span className='text-base leading-none'>{selectedOption.icon}</span>
          )}
          <span>{selectedOption.label ?? label}</span>
        </span>
        <span className='app-muted text-lg leading-none'>⌄</span>
      </button>

      {isOpen && (
        <div className={`app-card absolute left-0 top-[calc(100%+0.35rem)] z-30 w-full rounded-[1.4rem] p-1.5 ${scrollable ? 'max-h-60 overflow-y-auto' : ''}`}>
          {options.map((option) => {
            const isSelected = value === option.value
            return (
              <button
                key={option.value || 'all'}
                type='button'
                onClick={() => onSelect(option.value)}
                className={`no-accent-hover flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm ${isSelected ? 'bg-[var(--accent-soft)] text-[var(--text)]' : 'text-[var(--text)] hover:bg-[var(--surface-soft)]'}`}
              >
                {showIcons ? (
                  <span className='flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-strong)] text-sm'>
                    {option.icon ?? '🍽️'}
                  </span>
                ) : (
                  <span className='flex h-2 w-2 rounded-full bg-[var(--muted)]/45' />
                )}
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const defaultFilters: Filters = {
  search: '',
  difficulty: '',
  cuisine: '',
  course: '',
  maxDuration: '',
  favouritesOnly: false,
}

function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const filterRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (filters.search === '') {
      setSearchInput('')
    }
  }, [filters.search])

  useEffect(() => {
  const timer = setTimeout(() => {
        if (searchInput !== filters.search) {
        onChange({ ...filters, search: searchInput })
        }
    }, 300)
    return () => clearTimeout(timer)
    }, [searchInput])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (filterRowRef.current && !filterRowRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function update(field: keyof Filters, value: string | boolean) {
    onChange({ ...filters, [field]: value })
  }

  function chooseCuisine(value: string) {
    update('cuisine', value)
    setOpenMenu(null)
  }

  const selectedCuisine = CUISINE_OPTIONS.find((cuisine) => cuisine.value === filters.cuisine)

  const difficultyOptions: DropdownOption[] = [
    { value: '', label: 'All difficulties' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ]

  const cuisineOptions: DropdownOption[] = [
    { value: '', label: 'All cuisines', icon: '🍽️' },
    ...CUISINE_OPTIONS,
  ]

  const courseOptions: DropdownOption[] = [
    { value: '', label: 'All courses' },
    { value: 'Starter', label: 'Starter' },
    { value: 'Main', label: 'Main' },
    { value: 'Dessert', label: 'Dessert' },
  ]

  const durationOptions: DropdownOption[] = [
    { value: '', label: 'Any duration' },
    { value: '15', label: 'Under 15 min' },
    { value: '30', label: 'Under 30 min' },
    { value: '60', label: 'Under 60 min' },
  ]

  const hasActiveFilters =
    searchInput !== '' ||
    filters.difficulty !== '' ||
    filters.cuisine !== '' ||
    filters.course !== '' ||
    filters.maxDuration !== '' ||
    filters.favouritesOnly

  return (
    <div className={`app-card mb-6 space-y-4 rounded-[1.75rem] p-3.5 sm:p-4 ${openMenu ? 'relative z-50' : 'relative z-10'}`}>
      <div className='flex flex-wrap gap-2.5' ref={filterRowRef}>
        {/* Search — uses local state now */}
        <input
          type='text'
          placeholder='Search recipes...'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='app-input flex-1 min-w-44 rounded-2xl px-3.5 py-2.5 text-sm outline-none'
        />

        <FilterDropdown
          id='difficulty-filter'
          label='All difficulties'
          value={filters.difficulty}
          options={difficultyOptions}
          isOpen={openMenu === 'difficulty'}
          onToggle={() => setOpenMenu((current) => (current === 'difficulty' ? null : 'difficulty'))}
          onSelect={(value) => update('difficulty', value)}
        />

        <FilterDropdown
          id='cuisine-filter'
          label='All cuisines'
          value={filters.cuisine}
          options={cuisineOptions}
          isOpen={openMenu === 'cuisine'}
          onToggle={() => setOpenMenu((current) => (current === 'cuisine' ? null : 'cuisine'))}
          onSelect={chooseCuisine}
          showIcons
          scrollable
        />

        <FilterDropdown
          id='course-filter'
          label='All courses'
          value={filters.course}
          options={courseOptions}
          isOpen={openMenu === 'course'}
          onToggle={() => setOpenMenu((current) => (current === 'course' ? null : 'course'))}
          onSelect={(value) => update('course', value)}
        />

        <FilterDropdown
          id='duration-filter'
          label='Any duration'
          value={filters.maxDuration}
          options={durationOptions}
          isOpen={openMenu === 'duration'}
          onToggle={() => setOpenMenu((current) => (current === 'duration' ? null : 'duration'))}
          onSelect={(value) => update('maxDuration', value)}
        />
      </div>

      <div className='flex items-center justify-between gap-3'>
        <label className='flex items-center gap-2 text-sm cursor-pointer'>
          <input
            type='checkbox'
            checked={filters.favouritesOnly}
            onChange={(e) => update('favouritesOnly', e.target.checked)}
            className='w-4 h-4'
          />
          Favourites only
        </label>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className='text-sm font-medium text-[var(--accent)] hover:underline'
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterBar