import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from './pages/HomePage'
import RecipeFormPage from './pages/RecipeFormPage'
import RecipePrepPage from "./pages/RecipePrepPage"
import RecipeStepsPage from "./pages/RecipeStepsPage"
import { recipes as initialRecipes} from './data/recipes'

function App() {
  const [recipes, setRecipes] = useState(initialRecipes)

  function handleRemove(id){
    setRecipes(recipes.filter((recipe) => recipe.id !== id))
  }
  function handleSave(recipe) {
    setRecipes((prev) => {
      const exists = prev.some((r) => r.id === recipe.id)
      if (exists) {
        return prev.map((r) => (r.id === recipe.id ? recipe : r))
      }
      return [...prev, recipe]
    })
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<HomePage recipes={recipes} onRemove={handleRemove} />} />
        <Route path ="/recipe/new" element={<RecipeFormPage recipes={recipes} onSave={handleSave} />} />
        <Route path ="/recipe/:id/edit" element={<RecipeFormPage recipes={recipes} onSave={handleSave} />} />
        <Route path ="/recipe/:id/prep" element={<RecipePrepPage />} />
        <Route path ="/recipe/:id/steps" element={<RecipeStepsPage />} />
      </Routes>
    </BrowserRouter>  
  )
}

export default App
