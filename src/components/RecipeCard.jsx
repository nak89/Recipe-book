function RecipeCard({ recipe }){
    return (
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <img 
                src={recipe.photoUrl}
                alt={recipe.title}
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <div className="flex gap-3 text-sm text-gray-600 mt-1">
                    <span>{recipe.difficulty}</span>
                    <span>•</span>
                    <span>{recipe.totalMinutes} min</span>
                </div>
            </div>
        </div>
    )
}

export default RecipeCard 