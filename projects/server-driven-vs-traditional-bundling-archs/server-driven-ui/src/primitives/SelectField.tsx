import type { FieldDefinition } from "../types.js"

interface Props {
  field: FieldDefinition
  value: string
  onChange: (value: string) => void
}

export default function SelectField({ field, value, onChange }: Props) {
  return (
    <label>
      {field.label}
      <select
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {(field.options ?? []).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
