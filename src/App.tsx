import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RecipeFormPage from './pages/RecipeFormPage'
import RecipePrepPage from './pages/RecipePrepPage'
import RecipeStepsPage from './pages/RecipeStepsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { API_URL } from './config'
import type { Recipe } from './types/recipe'
import Layout from './components/Layout'

function App() {
  const { token } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

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

  const recipeContent = loading ? (
    <div className="p-8 text-center text-gray-500">Loading recipes...</div>
  ) : error ? (
    <div className="p-8 text-center text-red-600">Error: {error}</div>
  ) : null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {recipeContent ?? (
                <Layout>
                  <HomePage recipes={recipes} onRemove={handleRemove} />
                </Layout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/new"
          element={
            <ProtectedRoute>
              {recipeContent ?? (
                <Layout>
                  <RecipeFormPage recipes={recipes} onSave={handleSave} />
                </Layout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id/edit"
          element={
            <ProtectedRoute>
              {recipeContent ?? (
                <Layout>
                  <RecipeFormPage recipes={recipes} onSave={handleSave} />
                </Layout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id/prep"
          element={
            <ProtectedRoute>
              {recipeContent ?? (
                <Layout>
                  <RecipePrepPage recipes={recipes} />
                </Layout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id/steps"
          element={
            <ProtectedRoute>
              {recipeContent ?? (
                <Layout>
                  <RecipeStepsPage recipes={recipes} />
                </Layout>
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App