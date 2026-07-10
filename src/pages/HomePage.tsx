import { useState, useMemo } from 'react'
import RecipeCard from '../components/RecipeCard'
import AddRecipeCard from '../components/AddRecipeCard'
import FilterBar, { defaultFilters } from '../components/FilterBar'
import type { Filters } from '../components/FilterBar'
import type { Recipe } from '../types/recipe'

interface HomePageProps {
  recipes: Recipe[]
  onRemove: (id: string) => void
  onToggleFavourite: (id: string, isFavourite: boolean) => void
}

function HomePage({ recipes, onRemove, onToggleFavourite }: HomePageProps) {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
    const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
        const conditions = [
        !filters.search || recipe.title.toLowerCase().includes(filters.search.toLowerCase()),
        !filters.difficulty || recipe.difficulty === filters.difficulty,
        !filters.cuisine || recipe.cuisine === filters.cuisine,
        !filters.course || recipe.course === filters.course,
        !filters.maxDuration || recipe.totalMinutes <= Number(filters.maxDuration),
        !filters.favouritesOnly || recipe.isFavourite === true,
        ]
        return conditions.every(Boolean)
    })
    }, [recipes, filters])

  return (
    <div className='p-8'>
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      {filteredRecipes.length === 0 ? (
          <div className='text-center text-gray-500 py-16'>
          {recipes.length === 0
            ? 'No recipes yet — add your first one!'
            : 'No recipes match your filters.'}
          <AddRecipeCard />
        </div>
      ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
              <AddRecipeCard />
          {filteredRecipes.map((recipe) => (
              <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onRemove={onRemove}
              onToggleFavourite={onToggleFavourite}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default HomePage