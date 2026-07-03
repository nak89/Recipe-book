import RecipeCard from '../components/RecipeCard'
import AddRecipeCard from '../components/AddRecipeCard'
import type { Recipe } from '../types/recipe'

interface HomePageProps {
  recipes: Recipe[]
  onRemove: (id: string) => void
  onToggleFavourite: (id: string, isFavourite: boolean) => void
}

function HomePage({ recipes, onRemove, onToggleFavourite }: HomePageProps) {
  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-6'>My Recipe Book</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onRemove={onRemove}
            onToggleFavourite={onToggleFavourite}
          />
        ))}
        <AddRecipeCard />
      </div>
    </div>
  )
}

export default HomePage