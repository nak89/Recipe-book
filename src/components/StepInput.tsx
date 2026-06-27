interface StepInputProps {
  stepNumber: number
  instruction: string 
  onChange: (value: string) => void 
  onRemove: () => void 
}

function StepInput({ stepNumber, instruction, onChange, onRemove }: StepInputProps) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-10 flex items-center justify-center text-sm font-semibold text-gray-500">
        {stepNumber}.
      </div>
      <textarea
        placeholder="Describe this step..."
        value={instruction}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="flex-1 border rounded-lg px-3 py-2"
      />
      <button
        type="button"
        onClick={onRemove}
        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
      >
        ✕
      </button>
    </div>
  )
}

export default StepInput