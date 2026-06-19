'use client'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300"
      />
      <span>{label}</span>
    </label>
  )
}
