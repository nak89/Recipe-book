import { useState, useEffect } from 'react'
import { CUISINES } from '../data/cuisines'

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

  function update(field: keyof Filters, value: string | boolean) {
    onChange({ ...filters, [field]: value })
  }

  const hasActiveFilters =
    searchInput !== '' ||
    filters.difficulty !== '' ||
    filters.cuisine !== '' ||
    filters.course !== '' ||
    filters.maxDuration !== '' ||
    filters.favouritesOnly

  return (
    <div className='mb-6 space-y-3'>
      <div className='flex gap-3 flex-wrap'>
        {/* Search — uses local state now */}
        <input
          type='text'
          placeholder='Search recipes...'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='flex-1 min-w-48 border rounded-lg px-3 py-2 text-sm'
        />

        {/* Difficulty */}
        <select
          value={filters.difficulty}
          onChange={(e) => update('difficulty', e.target.value)}
          className='border rounded-lg px-3 py-2 text-sm'
        >
          <option value=''>All difficulties</option>
          <option value='Beginner'>Beginner</option>
          <option value='Intermediate'>Intermediate</option>
          <option value='Advanced'>Advanced</option>
        </select>

        {/* Cuisine */}
        <select
          value={filters.cuisine}
          onChange={(e) => update('cuisine', e.target.value)}
          className='border rounded-lg px-3 py-2 text-sm'
        >
          <option value=''>All cuisines</option>
          {CUISINES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Course */}
        <select
          value={filters.course}
          onChange={(e) => update('course', e.target.value)}
          className='border rounded-lg px-3 py-2 text-sm'
        >
          <option value=''>All courses</option>
          <option value='Starter'>Starter</option>
          <option value='Main'>Main</option>
          <option value='Dessert'>Dessert</option>
        </select>

        {/* Duration */}
        <select
          value={filters.maxDuration}
          onChange={(e) => update('maxDuration', e.target.value)}
          className='border rounded-lg px-3 py-2 text-sm'
        >
          <option value=''>Any duration</option>
          <option value='15'>Under 15 min</option>
          <option value='30'>Under 30 min</option>
          <option value='60'>Under 60 min</option>
        </select>
      </div>

      <div className='flex items-center justify-between'>
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
            className='text-sm text-blue-600 hover:underline'
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterBar