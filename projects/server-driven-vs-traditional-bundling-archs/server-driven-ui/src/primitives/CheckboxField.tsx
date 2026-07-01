import type { FieldDefinition } from "../types.js"

interface Props {
  field: FieldDefinition
  value: string | string[]
  onChange: (value: string | string[]) => void
}

export default function CheckboxField({ field, value, onChange }: Props) {
  const isSingle = (field.options ?? []).length <= 1

  if (isSingle) {
    const opt = field.options?.[0]
    return (
      <label className="checkbox-label" key={opt?.value}>
        <input
          type="checkbox"
          required={field.required}
          checked={value === opt?.value}
          onChange={(e) => onChange(e.target.checked ? (opt?.value ?? "true") : "")}
        />
        {field.label}
      </label>
    )
  }

  const selected = Array.isArray(value) ? value : []

  return (
    <fieldset>
      <legend>{field.label}</legend>
      {(field.options ?? []).map((opt) => (
        <label key={opt.value} className="checkbox-label">
          <input
            type="checkbox"
            value={opt.value}
            checked={selected.includes(opt.value)}
            onChange={(e) => {
              const next = e.target.checked
                ? [...selected, opt.value]
                : selected.filter((v) => v !== opt.value)
              onChange(next)
            }}
          />
          {opt.label}
        </label>
      ))}
    </fieldset>
  )
}
