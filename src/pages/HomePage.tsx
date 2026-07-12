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

  const orderedRecipes = useMemo(() => {
    return [...filteredRecipes].sort((left, right) => Number(right.isFavourite) - Number(left.isFavourite))
  }, [filteredRecipes])

  const favouriteRecipes = orderedRecipes.filter((recipe) => recipe.isFavourite)
  const otherRecipes = orderedRecipes.filter((recipe) => !recipe.isFavourite)

  return (
    <div className="space-y-8">
      <section className="app-card rounded-[2rem] p-4 sm:p-5 lg:p-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] app-muted">Recipe dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem] lg:text-[2.5rem]">
            A calm place to browse your favorite recipes first.
          </h1>
          <p className="max-w-2xl text-sm leading-6 app-muted sm:text-[0.9rem]">
            Your very own recipe book to keep all your favorite recipes in one. Click on your recipe to start cooking, or make a new one.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5 text-sm">
          <span className="app-chip rounded-full px-4 py-2">{recipes.length} recipes</span>
          <span className="app-chip app-chip-active rounded-full px-4 py-2">{favouriteRecipes.length} favorites</span>
          <span className="app-chip rounded-full px-4 py-2">Random recipe</span>
        </div>
      </section>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      {orderedRecipes.length === 0 ? (
        <div className="app-card rounded-[2rem] p-10 text-center">
          <p className="text-lg font-medium">
            {recipes.length === 0 ? 'No recipes yet — add your first one!' : 'No recipes match your filters.'}
          </p>
          <p className="mt-2 app-muted">Try loosening a filter or start a new recipe from the sidebar.</p>
          <div className="mt-6 flex justify-center">
            <AddRecipeCard />
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Favorites</h2>
                <p className="text-sm app-muted">The recipes you keep coming back to.</p>
              </div>
              <div className="text-sm app-muted">{favouriteRecipes.length} saved</div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <AddRecipeCard />
              {favouriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onRemove={onRemove}
                  onToggleFavourite={onToggleFavourite}
                />
              ))}
            </div>
          </section>

          {otherRecipes.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">All recipes</h2>
                <p className="text-sm app-muted">Everything else in your collection.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {otherRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onRemove={onRemove}
                    onToggleFavourite={onToggleFavourite}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export default HomePage