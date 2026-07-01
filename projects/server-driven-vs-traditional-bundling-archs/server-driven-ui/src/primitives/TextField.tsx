import type { FieldDefinition } from "../types.js"

interface Props {
  field: FieldDefinition
  value: string
  onChange: (value: string) => void
}

export default function TextField({ field, value, onChange }: Props) {
  return (
    <label>
      {field.label}
      <input
        type={field.type === "email" ? "email" : field.type === "password" ? "password" : field.type === "phone" ? "tel" : "text"}
        required={field.required}
        placeholder={field.placeholder}
        minLength={field.validation?.min}
        maxLength={field.validation?.max}
        pattern={field.validation?.pattern}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
