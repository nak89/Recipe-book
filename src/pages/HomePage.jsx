import { useState } from 'react'
import AddRecipeCard from '../components/AddRecipeCard'
import RecipeCard from '../components/RecipeCard'
import { recipes as initialRecipes } from '../data/recipes'

function HomePage() {
    const [recipes, setRecipes] = useState(initialRecipes)

    function handleRemove(id){
        setRecipes(recipes.filter((recipe) => recipe.id !== id))
    }

    return (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">My Recipe Book</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
            <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onRemove={handleRemove}
            />
        ))}
        <AddRecipeCard />
        </div>
    </div>
  )
}

export default HomePage