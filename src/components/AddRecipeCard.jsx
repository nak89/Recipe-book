import { Link } from 'react-router-dom'

function AddRecipeCard(){
    return (
        <Link 
        to="/recipe/new"
        className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400 hover:text-blue-600 transition"
        >
            <span className="text-4xl">+</span>
            <span className="mt-2 text-sm font-medium">Add Recipe</span>
        </Link>
    )
}

export default AddRecipeCard