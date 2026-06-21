import AddRecipeCard from '../components/AddRecipeCard'
import RecipeCard from '../components/RecipeCard'
import { recipes } from '../data/recipes'

function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Recipe Book</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
        <AddRecipeCard />
      </div>
    </div>
  )
}

export default HomePage