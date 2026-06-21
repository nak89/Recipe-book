import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from './pages/HomePage'
import RecipeFormPage from './pages/RecipeFormPage'
import RecipePrepPage from "./pages/RecipePrepPage"
import RecipeStepsPage from "./pages/RecipeStepsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<HomePage />} />
        <Route path ="/recipe/new" element={<RecipeFormPage />} />
        <Route path ="/recipe/:id/edit" element={<RecipeFormPage />} />
        <Route path ="/recipe/:id/prep" element={<RecipePrepPage />} />
        <Route path ="/recipe/:id/steps" element={<RecipeStepsPage />} />
      </Routes>
    </BrowserRouter>  
  )
}

export default App
