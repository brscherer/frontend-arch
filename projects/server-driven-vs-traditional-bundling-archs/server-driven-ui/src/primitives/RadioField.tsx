import type { FieldDefinition } from "../types.js"

interface Props {
  field: FieldDefinition
  value: string
  onChange: (value: string) => void
}

export default function RadioField({ field, value, onChange }: Props) {
  return (
    <fieldset>
      <legend>{field.label}</legend>
      {(field.options ?? []).map((opt) => (
        <label key={opt.value} className="radio-label">
          <input
            type="radio"
            name={field.name}
            value={opt.value}
            required={field.required}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </fieldset>
  )
}
