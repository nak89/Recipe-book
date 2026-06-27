export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Ingredient {
    id?: string
    name: string
    quantity: number
    unit: string 
}

export interface Step {
    id?: string
    stepNumber: number
    instruction: string 
}

export interface Recipe {
    id: string
    title: string
    description?: string
    photoUrl?: string
    difficulty: Difficulty
    totalMinutes: number
    servings: number 
    ingredients: Ingredient[]
    tools: string[]
    steps: Step[]
}

export interface FormIngredient {
    id: string 
    name: string 
    quantity: string 
    unit: string
}

export interface FormStep {
    id: string 
    instruction: string 
}

