import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RecipeFormPage from './pages/RecipeFormPage'
import RecipePrepPage from './pages/RecipePrepPage'
import RecipeStepsPage from './pages/RecipeStepsPage'

const API_URL = 'http://localhost:3000'

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/recipes`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch recipes')
        return res.json()
      })
      .then((data) => {
        setRecipes(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  async function handleRemove(id) {
    try {
      const res = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete recipe')
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleSave(recipe) {
    const isExisting = recipes.some((r) => r.id === recipe.id)
    const url = isExisting ? `${API_URL}/recipes/${recipe.id}` : `${API_URL}/recipes`
    const method = isExisting ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(recipe),
      })
      if (!res.ok) throw new Error('Failed to save recipe')
      const savedRecipe = await res.json()
      
      setRecipes((prev) => {
        if (isExisting) {
          return prev.map((r) => (r.id === savedRecipe.id ? savedRecipe : r))
        }
        return [...prev, savedRecipe]
      })
    } catch (err) {
      alert(err.message)
      throw err
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading recipes...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage recipes={recipes} onRemove={handleRemove} />} />
        <Route path="/recipe/new" element={<RecipeFormPage recipes={recipes} onSave={handleSave} />} />
        <Route path="/recipe/:id/edit" element={<RecipeFormPage recipes={recipes} onSave={handleSave} />} />
        <Route path="/recipe/:id/prep" element={<RecipePrepPage recipes={recipes} />} />
        <Route path="/recipe/:id/steps" element={<RecipeStepsPage recipes={recipes} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App