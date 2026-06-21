import { useLocation } from 'react-router-dom'
function RecipeFormPage() {
    const location = useLocation()
    const prefillData = location.state?.prefillData

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Add / Edit Recipe</h1>
            {prefillData ? (
                <p className="text-gray-500 mt-2">
                    Prefilled from: <strong>{prefillData.title}</strong>
                </p>
            ) : (
                <p className="text-gray-500 mt-2">Form goes here.</p>               
            )}
        </div>
    )
}
export default RecipeFormPage