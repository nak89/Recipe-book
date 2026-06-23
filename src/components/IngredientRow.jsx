import { UNITS } from "../data/units";

function IngredientRow({ ingredient, onChange, onRemove }) {
    return (
        <div className="flex gap-2 items-start">
            <input 
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => onChange(ingredient.id, 'name', e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2"
            />
            <input
                type="number"
                min="0"
                placeholder="Qty"
                value={ingredient.quantity}
                onChange={(e) => {
                const value = e.target.value
                if (value === '' || Number(value) >= 0) {
                    onChange(ingredient.id, 'quantity', value)
                }
                }}
                className="w-20 border rounded-lg px-3 py-2"
            />
            <select 
                value={ingredient.unit}    
                onChange={(e) => onChange(ingredient.id, 'unit', e.target.value)}
                className="w-28 border rounded-lg px-3 py-2"
            >
                {UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                ))}
            </select>
            <button 
                type="button"
                onClick={() => onRemove(ingredient.id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
                x
            </button>    
        </div>
    )
}
export default IngredientRow