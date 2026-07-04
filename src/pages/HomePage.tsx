import RecipeCard from '../components/RecipeCard'
import AddRecipeCard from '../components/AddRecipeCard'
import { Link } from 'react-router-dom'
import type { Recipe } from '../types/recipe'

interface HomePageProps {
  recipes: Recipe[]
  onRemove: (id: string) => void
  onToggleFavourite: (id: string, isFavourite: boolean) => void
}

function HomePage({ recipes, onRemove, onToggleFavourite }: HomePageProps) {
  return (
    <div className='p-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>My Recipe Book</h1>
        <Link to="/recipe/new" className='inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'>
          Add New Recipe
        </Link>
      </div>
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