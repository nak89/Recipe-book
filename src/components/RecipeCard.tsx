import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Recipe } from '../types/recipe'
import ConfirmModal from './ConfirmModal'

interface RecipeCardProps {
  recipe: Recipe
  onRemove: (id: string) => void
  onToggleFavourite: (id: string, isFavourite: boolean) => void
}

function RecipeCard({ recipe, onRemove, onToggleFavourite }: RecipeCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent){
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleCopyClick() {
    setMenuOpen(false)
    navigate('/recipe/new', { state: { prefillData: recipe } })
  }
  return (
  <>
    {showConfirm && (
      <ConfirmModal
        title='Remove Recipe'
        message={`Are you sure you want to remove "${recipe.title}"? This cannot be undone.`}
        confirmLabel='Remove'
        onConfirm={() => {
          setShowConfirm(false)
          onRemove(recipe.id)
        }}
        onCancel={() => setShowConfirm(false)}
      />
    )}
    <div className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <Link to={`/recipe/${recipe.id}/prep`}>
        <img
          src={recipe.photoUrl}
          alt={recipe.title}
          className="w-full h-40 object-cover"
        />
        <div className='p-4'>
        <div className='flex items-start justify-between'>
          <h3 className='text-lg font-semibold'>{recipe.title}</h3>
          <button onClick={(e) => {
            e.preventDefault()
            onToggleFavourite(recipe.id, !recipe.isFavourite)
          }}
          className="text-xl leading-none hover:scale-110 transition-transform"
          title={recipe.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            {recipe.isFavourite ? '♥' : '♡'}
          </button>
        </div>

        <div className='flex gap-3 text-sm text-gray-600 mt-1'>
          <span>{recipe.difficulty}</span>
          <span>•</span>
          <span>{recipe.totalMinutes} min</span>
          {recipe.cuisine && (
            <>
              <span>•</span>
              <span>{recipe.cuisine}</span>
            </>
          )}
        </div>

        {recipe.course && (
          <span className='inline-block mt-2 text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600'>
            {recipe.course}
          </span>
        )}
        </div>
      </Link>

      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow text-gray-700 text-lg leading-none"
        >
          ⋮
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg overflow-hidden text-sm z-10">
            <Link
              to={`/recipe/${recipe.id}/edit`}
              className="block px-4 py-2 hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              Edit
            </Link>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
              onClick = {handleCopyClick}
            >
              Copy
            </button>
            <button
            className='block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600'
            onClick={() => {
              setMenuOpen(false)
              setShowConfirm(true)
            }}
            >
            Remove
          </button>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default RecipeCard