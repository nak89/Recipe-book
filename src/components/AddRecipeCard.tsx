import { Link } from 'react-router-dom'

function AddRecipeCard(){
    return (
        <Link 
        to="/recipe/new"
        className="app-card group flex min-h-[220px] flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-[var(--border)] p-6 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
            <span className="text-4xl transition-transform group-hover:scale-110">+</span>
            <span className="mt-2 text-sm font-medium">Add recipe</span>
            <span className="mt-1 text-xs uppercase tracking-[0.24em]">Quick add</span>
        </Link>
    )
}

export default AddRecipeCard