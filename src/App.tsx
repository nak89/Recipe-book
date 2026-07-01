import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RecipeFormPage from './pages/RecipeFormPage'
import RecipePrepPage from './pages/RecipePrepPage'
import RecipeStepsPage from './pages/RecipeStepsPage'
import type { Recipe } from './types/recipe'
import { API_URL } from './config'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { token, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API_URL}/recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch recipes')
        return res.json()
      })
      .then((data) => {
        setRecipes(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err instanceof Error) setError(err.message)
        setLoading(false)
      })
  }, [token])

async function handleRemove(id: string) {
  try {
    const res = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Failed to delete recipe')
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
  } catch (err) {
    if (err instanceof Error) alert(err.message)
  }
}

async function handleSave(recipe: Recipe) {
  const isExisting = recipes.some((r) => r.id === recipe.id)
  const url = isExisting ? `${API_URL}/recipes/${recipe.id}` : `${API_URL}/recipes`
  const method = isExisting ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipe),
    })
    if (!res.ok) throw new Error('Failed to save recipe')
    const savedRecipe: Recipe = await res.json()

    setRecipes((prev) => {
      if (isExisting) {
        return prev.map((r) => (r.id === savedRecipe.id ? savedRecipe : r))
      }
      return [...prev, savedRecipe]
    })
  } catch (err) {
    if (err instanceof Error) alert(err.message)
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading recipes...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">Error: {error}</div>
              ) : (
                <HomePage recipes={recipes} onRemove={handleRemove} />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/new"
          element={
            <ProtectedRoute>
              <RecipeFormPage recipes={recipes} onSave={handleSave} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id/edit"
          element={
            <ProtectedRoute>
              <RecipeFormPage recipes={recipes} onSave={handleSave} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id/prep"
          element={
            <ProtectedRoute>
              <RecipePrepPage recipes={recipes} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id/steps"
          element={
            <ProtectedRoute>
              <RecipeStepsPage recipes={recipes} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App