export interface CuisineOption {
  value: string
  label: string
  icon: string
}

export const CUISINE_OPTIONS: CuisineOption[] = [
  { value: 'Italian', label: 'Italian', icon: '🇮🇹' },
  { value: 'Asian', label: 'Asian', icon: '🍜' },
  { value: 'French', label: 'French', icon: '🇫🇷' },
  { value: 'Mexican', label: 'Mexican', icon: '🇲🇽' },
  { value: 'Mediterranean', label: 'Mediterranean', icon: '🫒' },
  { value: 'American', label: 'American', icon: '🇺🇸' },
  { value: 'Indian', label: 'Indian', icon: '🇮🇳' },
  { value: 'Japanese', label: 'Japanese', icon: '🇯🇵' },
  { value: 'Chinese', label: 'Chinese', icon: '🇨🇳' },
  { value: 'Cambodian', label: 'Cambodia', icon: '🇰🇭' },
  { value: 'Greek', label: 'Greek', icon: '🇬🇷' },
  { value: 'Spanish', label: 'Spanish', icon: '🇪🇸' },
  { value: 'Middle Eastern', label: 'Middle Eastern', icon: '🧆' },
  { value: 'Other', label: 'Other', icon: '🍽️' },
]

export const CUISINES = CUISINE_OPTIONS.map((cuisine) => cuisine.value)

