import { useState } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import IngredientRow from '../components/IngredientRow'
import StepInput from '../components/StepInput'
import type { Recipe, Difficulty, FormIngredient, FormStep, Course } from '../types/recipe'
import { CUISINES } from '../data/cuisines'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'


interface LocationState {
  prefillData?: Recipe
}

interface RecipeFormPageProps {
  recipes: Recipe[]
  onSave: (recipe: Recipe) => Promise<void>
}

function RecipeFormPage({ recipes, onSave }: RecipeFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const existingRecipe = id ? recipes.find((r) => r.id === id) : null
  const state = location.state as LocationState | null
  const prefillData = existingRecipe || state?.prefillData

  const [title, setTitle] = useState<string>(prefillData?.title || '')
  const [description, setDescription] = useState<string>(prefillData?.description || '')
  
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>(prefillData?.photoUrl || '')
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string>('')
  
  const [difficulty, setDifficulty] = useState<Difficulty>(prefillData?.difficulty || 'Beginner')
  const [totalMinutes, setTotalMinutes] = useState<string>(
    prefillData?.totalMinutes !== undefined ? String(prefillData.totalMinutes) : ''
  )
  const [servings, setServings] = useState<string>(
    prefillData?.servings !== undefined ? String(prefillData.servings) : ''
  )
  const [error, setError] = useState<string>('')

  const [ingredients, setIngredients] = useState<FormIngredient[]>(
    prefillData?.ingredients
      ? prefillData.ingredients.map((ing) => ({
          ...ing,
          id: crypto.randomUUID(),
          quantity: String(ing.quantity),
        }))
      : [{ id: crypto.randomUUID(), name: '', quantity: '', unit: 'cup' }]
  )
  const [cuisine, setCuisine] = useState<string>(prefillData?.cuisine || '')
  const [customCuisine, setCustomCuisine] = useState<string>('')
  const [course, setCourse] = useState<Course | ''>(prefillData?.course || '')
  const [isFavourite, setIsFavourite] = useState<boolean>(prefillData?.isFavourite || false)
  const [calories, setCalories] = useState<string>(
    prefillData?.calories !== undefined ? String(prefillData.calories) : ''
  )
  const [protein, setProtein] = useState<string>(
    prefillData?.protein !== undefined ? String(prefillData.protein) : ''
  )
  const [carbs, setCarbs] = useState<string>(
    prefillData?.carbs !== undefined ? String(prefillData.carbs) : ''
  )
  const [fat, setFat] = useState<string>(
    prefillData?.fat !== undefined ? String(prefillData.fat) : ''
  )


  function addIngredient() {
    setIngredients([...ingredients, { id: crypto.randomUUID(), name: '', quantity: '', unit: 'cup' }])
  }
  function removeIngredient(ingId: string) {
    setIngredients(ingredients.filter((ing) => ing.id !== ingId))
  }
  function updateIngredient(ingId: string, field: keyof FormIngredient, value: string) {
    setIngredients(ingredients.map((ing) => (ing.id === ingId ? { ...ing, [field]: value } : ing)))
  }

  const [tools, setTools] = useState<string[]>(
    prefillData?.tools && prefillData.tools.length > 0 ? prefillData.tools : ['']
  )

  function addTool() {
    setTools([...tools, ''])
  }
  function removeTool(index: number) {
    setTools(tools.filter((_, i) => i !== index))
  }
  function updateTool(index: number, value: string) {
    setTools(tools.map((tool, i) => (i === index ? value : tool)))
  }

  const [steps, setSteps] = useState<FormStep[]>(
    prefillData?.steps
      ? prefillData.steps.map((step) => ({ id: crypto.randomUUID(), instruction: step.instruction }))
      : [{ id: crypto.randomUUID(), instruction: '' }]
  )

  function addStep() {
    setSteps([...steps, { id: crypto.randomUUID(), instruction: '' }])
  }
  function removeStep(stepId: string) {
    setSteps(steps.filter((step) => step.id !== stepId))
  }
  function updateStep(stepId: string, instruction: string) {
    setSteps(steps.map((step) => (step.id === stepId ? { ...step, instruction } : step)))
  }

  function isSameRecipe(a: Recipe, b: Recipe): boolean {
    const normalizeIngredients = (ings: Recipe['ingredients']) =>
      ings.map(({ name, quantity, unit }) => ({ name, quantity, unit }))

    const normalizeSteps = (steps: Recipe['steps']) =>
      steps.map(({ stepNumber, instruction }) => ({ stepNumber, instruction }))

    return (
      a.title.trim().toLowerCase() === b.title.trim().toLowerCase() &&
      (a.description || '').trim() === (b.description || '').trim() &&
      (a.photoUrl || '').trim() === (b.photoUrl || '').trim() &&
      a.difficulty === b.difficulty &&
      a.totalMinutes === b.totalMinutes &&
      a.servings === b.servings &&
      JSON.stringify(normalizeIngredients(a.ingredients)) === JSON.stringify(normalizeIngredients(b.ingredients)) &&
      JSON.stringify(a.tools) === JSON.stringify(b.tools) &&
      JSON.stringify(normalizeSteps(a.steps)) === JSON.stringify(normalizeSteps(b.steps))
    )
  }

    const { token } = useAuth()

    async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]
      if (!file) return

      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
      setUploadError('')
      setUploading(true)

      try {
        const formData = new FormData()
        formData.append('photo', file)

        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })

        if (!res.ok) throw new Error('Failed to upload photo')
        const data = await res.json()
        setPhotoPreview(data.url)
      } catch (err) {
        if (err instanceof Error) setUploadError(err.message)
        setPhotoPreview('')
        setPhotoFile(null)
      } finally {
        setUploading(false)
      }
    }

  function validateForm(): string[] {
    const missing: string[] = []

    if (!title.trim()) missing.push('Title')
    if (totalMinutes === '') missing.push('Duration')
    if (servings === '') missing.push('Servings')

    const hasValidIngredient = ingredients.some((ing) => ing.name.trim() !== '' && ing.quantity !== '')
    if (!hasValidIngredient) missing.push('Ingredients')

    const hasValidTool = tools.some((tool) => tool.trim() !== '')
    if (!hasValidTool) missing.push('Tools & Utensils')

    const hasValidStep = steps.some((step) => step.instruction.trim() !== '')
    if (!hasValidStep) missing.push('Steps')

    return missing
  }

  async function handleSave() {
    const missing = validateForm()
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(', ')}`)
      return
    }

    const recipe: Recipe = {
      id: existingRecipe ? existingRecipe.id : crypto.randomUUID(),
      title,
      description,
      photoUrl: photoPreview || undefined,
      difficulty,
      totalMinutes: Number(totalMinutes) || 0,
      servings: Number(servings) || 0,
      cuisine: cuisine === 'Other' ? customCuisine.trim() || 'Other' : cuisine || undefined,
      course: course ||undefined,
      isFavourite,
      calories: calories !== '' ? Number(calories) : undefined, 
      protein: protein !== '' ? Number(protein) : undefined, 
      carbs: carbs !== '' ? Number(carbs) : undefined,
      fat: fat !== '' ? Number(fat) : undefined,
      ingredients: ingredients
        .filter((ing) => ing.name.trim() !== '')
        .map(({ name, quantity, unit }) => ({
          name,
          quantity: Number(quantity) || 0,
          unit,
        })),
      tools: tools.filter((tool) => tool.trim() !== ''),
      steps: steps
        .filter((step) => step.instruction.trim() !== '')
        .map((step, index) => ({
          stepNumber: index + 1,
          instruction: step.instruction,
        })),
    }

    const titleTaken = recipes.find(
      (r) => r.id !== recipe.id && r.title.trim().toLowerCase() === recipe.title.trim().toLowerCase()
    )
    if (titleTaken) {
      setError(`You already have a recipe titled "${titleTaken.title}". Please choose a different title.`)
      return
    }

    const duplicate = recipes.find((r) => r.id !== recipe.id && isSameRecipe(r, recipe))
    if (duplicate) {
      setError(`This is identical to your existing recipe "${duplicate.title}". Please make a change before saving.`)
      return
    }

    setError('')
    try {
      await onSave(recipe)
      navigate('/')
    } catch (err) {
      // error already alerted inside onSave; stay on the form
    }
  }
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {existingRecipe ? 'Edit Recipe' : 'Add Recipe'}
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Photo</label>

          {photoPreview && (
            <div className='mb-2 relative'>
              <img
                src={photoPreview}
                alt='Recipe preview'
                className='w-full h-48 object-cover rounded-lg'
              />
              <button
                type='button'
                onClick={() => {
                  setPhotoPreview('')
                  setPhotoFile(null)
                }}
                className='absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-gray-700 shadow text-sm'
              >
                ✕
              </button>
            </div>
          )}

          <label className='flex items-center gap-2 cursor-pointer w-fit'>
            <span className='px-4 py-2 border rounded-lg text-sm hover:bg-gray-50'>
              {uploading ? 'Uploading...' : photoPreview ? 'Change photo' : 'Choose photo'}
            </span>
            <input
              type='file'
              accept='image/*'
              onChange={handlePhotoChange}
              disabled={uploading}
              className='hidden'
            />
          </label>

          {uploadError && (
            <p className='text-red-600 text-sm mt-1'>{uploadError}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full border rounded-lg px-3 py-2">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Minutes</label>
            <input type="number" min="0" value={totalMinutes} onChange={(e) => {
              const value = e.target.value
              if (value === '' || Number(value) >= 0) setTotalMinutes(value)
            }} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Servings</label>
            <input type="number" min="0" value={servings} onChange={(e) => {
              const value = e.target.value
              if (value === '' || Number(value) >= 0) setServings(value)
            }} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>
        {/* Cuisine */}
        <div>
          <label className='block text-sm font-medium mb-1'>Cuisine</label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className='w-full border rounded-lg px-3 py-2'
          >
            <option value=''>Select cuisine (optional)</option>
            {CUISINES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {cuisine === 'Other' && (
            <input
              type='text'
              placeholder='Enter your cuisine...'
              value={customCuisine}
              onChange={(e) => setCustomCuisine(e.target.value)}
              className='w-full border rounded-lg px-3 py-2 mt-2'
            />
          )}
        </div>

        {/* Course */}
        <div>
          <label className='block text-sm font-medium mb-1'>Course</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value as Course | '')}
            className='w-full border rounded-lg px-3 py-2'
          >
            <option value=''>Select course (optional)</option>
            <option value='Starter'>Starter</option>
            <option value='Main'>Main</option>
            <option value='Dessert'>Dessert</option>
          </select>
        </div>

        {/* Favourite */}
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='isFavourite'
            checked={isFavourite}
            onChange={(e) => setIsFavourite(e.target.checked)}
            className='w-4 h-4'
          />
          <label htmlFor='isFavourite' className='text-sm font-medium'>
            Mark as favourite
          </label>
        </div>

        {/* Nutrition */}
        <div>
          <label className="block text-sm font-medium mb-2">Ingredients</label>
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <IngredientRow key={ingredient.id} ingredient={ingredient} onChange={updateIngredient} onRemove={removeIngredient} />
            ))}
          </div>
          <button type="button" onClick={addIngredient} className="mt-2 text-sm text-blue-600 hover:underline">+ Add Ingredient</button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tools & Utensils</label>
          <div className="space-y-2">
            {tools.map((tool, index) => (
              <div key={index} className="flex gap-2">
                <input type="text" placeholder="e.g. mixing bowl" value={tool} onChange={(e) => updateTool(index, e.target.value)} className="flex-1 border rounded-lg px-3 py-2" />
                <button type="button" onClick={() => removeTool(index)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addTool} className="mt-2 text-sm text-blue-600 hover:underline">+ Add Tool</button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cooking Steps</label>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <StepInput key={step.id} stepNumber={index + 1} instruction={step.instruction} onChange={(value) => updateStep(step.id, value)} onRemove={() => removeStep(step.id)} />
            ))}
          </div>
          <button type="button" onClick={addStep} className="mt-2 text-sm text-blue-600 hover:underline">+ Add Step</button>
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>
            Nutritional Value <span className='text-gray-400 font-normal'>(optional, per serving)</span>
          </label>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs text-gray-500 mb-1'>Calories (kcal)</label>
              <input
                type='number'
                min='0'
                value={calories}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || Number(value) >= 0) setCalories(value)
                }}
                className='w-full border rounded-lg px-3 py-2'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-500 mb-1'>Protein (g)</label>
              <input
                type='number'
                min='0'
                value={protein}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || Number(value) >= 0) setProtein(value)
                }}
                className='w-full border rounded-lg px-3 py-2'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-500 mb-1'>Carbs (g)</label>
              <input
                type='number'
                min='0'
                value={carbs}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || Number(value) >= 0) setCarbs(value)
                }}
                className='w-full border rounded-lg px-3 py-2'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-500 mb-1'>Fat (g)</label>
              <input
                type='number'
                min='0'
                value={fat}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || Number(value) >= 0) setFat(value)
                }}
                className='w-full border rounded-lg px-3 py-2'
              />
            </div>
          </div>
        </div>
        {error && (
        <p className="text-red-600 text-sm">{error}</p>
        )}

        <button type="button" onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Save Recipe
        </button>
        <div className='flex gap-3 items-center'>
        <Link to="/" className="px-6 py-2 rounded-lg border hover:bg-gray-50 text-gray-700">
            Cancel
        </Link>
        </div>
      </div>
    </div>
  )
}

export default RecipeFormPage