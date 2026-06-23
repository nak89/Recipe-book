import { useParams, Link } from 'react-router-dom'

function RecipeStepsPage({ recipes }) {
    const { id } = useParams()
    const recipe = recipes.find((r) => r.id === id)

    if (!recipe) {
        return <div className="p-8"> Recipe not found.</div>
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Link to={`/recipe/${recipe.id}/prep`} className="text-sm text-blue-600 hover:underline">
                ← Back to prep 
            </Link>

            <h1 className="text-3xl font-bold mt-2">{recipe.title}</h1>
            <p className="text-gray-500 mt-1">{recipe.totalMinutes} minutes total</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Steps</h2>
            <ol className="space-y-3">
                {recipe.steps.map((step) => (
                    <li key={step.stepNumber} className="flex gap-3">
                        <span className="font-semibold text-gray-400">{step.stepNumber}</span>
                        <span className="font-semibold text-gray-400">{step.instruction}</span>
                    </li>
                ))}
            </ol>

            <Link to="/" className="inline-block mt-6 text-sm text-blue-600 hover:underline">
                ← Back to recipe book
            </Link>
        </div>
    )
}
export default RecipeStepsPage