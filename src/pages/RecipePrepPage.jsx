import { useParams, Link} from 'react-router-dom'

function RecipePrepPage({ recipes }) {
    const { id } = useParams()
    const recipe = recipes.find((r) => r.id === id)
    
    if (!recipe){
        return <div className="p-8">Recipe not found.</div>
    }
    
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Link to="/" className="text-sm text-blue-600 hover:underline">← Back to recipes</Link>

            <h1 className="text-3xl font-bold mt-2">{recipe.title}</h1>
            <p className="text-gray-600 mt-1">{recipe.description}</p>

            <div className="flex gap-4 text-sm text-gray-500mt mt-3">
                <span>{recipe.difficulty}</span>
                <span>•</span>
                <span>{recipe.totalMinutes}</span>
                <span>•</span>
                <span>{recipe.servings}</span>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">Ingredients</h2>
            <ul className="space-y-1">
                {recipe.ingredients.map((ing, index) => (
                    <li key={index} className="text-gray-700">
                        {ing.quantity} {ing.unit} {ing.name}
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">Tools & Utensils</h2>
            <ul className="space-y-1">
                {recipe.tools.map((tool, index) => (
                    <li key={index} className="text-gray-700">{tool}</li>
                ))}
            </ul>

            <Link 
                to={`/recipe/${recipe.id}/steps`}
                className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
                Start Cooking →
            </Link>
        </div>
    )
}
export default RecipePrepPage