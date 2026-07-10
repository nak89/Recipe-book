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
import { Link } from 'react-router-dom'

function App() {
  const { token } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthError, setIsAuthError] = useState<boolean>(false)

  // Fetch recipes for the authenticated user whenever the `token` changes.
  // - Shows a loading state while fetching
  // - Stores server errors in `error`
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setIsAuthError(false)

    fetch(`${API_URL}/recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok){
          if (res.status === 401) {
            setIsAuthError(true)
            throw new Error('Your session has expired')
          }
          throw new Error('Failed to fetch recipes')
        } 
        return res.json()
      })
      .then((data) => {
        setRecipes(data)
        setLoading(false)
        setIsAuthError(false)
      })
      .catch((err) => {
        if (err instanceof Error) setError(err.message)
        setLoading(false)
      })
  }, [token])

  async function handleRemove(id: string) {
    // Delete a recipe on the server and remove it from local state
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
    // Create or update a recipe depending on whether it already exists
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
    async function handleToggleFavourite(id: string, isFavourite: boolean) {
      // Toggle the `isFavourite` flag for a recipe on the server,
      // then update the local copy with the response from the API.
      try {
        const res = await fetch(`${API_URL}/recipes/${id}/favourite`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isFavourite }),
        })
        if (!res.ok) throw new Error('Failed to update favourite')
        const updatedRecipe: Recipe = await res.json()
        setRecipes((prev) =>
          prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
        )
      } catch (err) {
        if (err instanceof Error) alert(err.message)
      }
    }
  const recipeContent = loading ? (
    <div className="p-8 text-center text-gray-500">Loading recipes...</div>
  ) : isAuthError ? (
    <div className='p-8 text-center'>
    <p className='text-yellow-600 mb-4'>{error}</p>
    <Link
      to='/login'
      className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
    >
      Go to login page
    </Link>
    </div>
  ):
   error ?
  (
    <div className="p-8 text-center text-red-600">Error: {error}</div>
  ) : null

  // `recipeContent` holds a small UI placeholder used while recipes load
  // or when an error occurred. Routes render this when the app is not
  // ready to show the main content.

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
                  <HomePage recipes={recipes} onRemove={handleRemove} onToggleFavourite={handleToggleFavourite} />
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