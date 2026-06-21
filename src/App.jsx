import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from './pages/HomePage'
import RecipeFormPage from './pages/RecipeFormPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<HomePage />} />
        <Route path ="/recipe/new" element={<RecipeFormPage />} />
      </Routes>
    </BrowserRouter>  
  )
}

export default App
