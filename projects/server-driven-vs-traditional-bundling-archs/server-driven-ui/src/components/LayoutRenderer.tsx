import type { StepDefinition } from "../types.js"
import { TextField, SelectField, CheckboxField, RadioField } from "../primitives/index.js"

interface Props {
  step: StepDefinition
  data: Record<string, unknown>
  onChange: (name: string, value: unknown) => void
  onAction: (actionType: string) => void
}

export default function LayoutRenderer({ step, data, onChange, onAction }: Props) {
  return (
    <div className="step-content">
      <h2>{step.title}</h2>
      {step.description && <p className="step-desc">{step.description}</p>}

      {step.fields.map((field) => {
        const value = data[field.name]

        switch (field.type) {
          case "select":
            return (
              <SelectField
                key={field.name}
                field={field}
                value={(value as string) ?? ""}
                onChange={(v) => onChange(field.name, v)}
              />
            )

          case "checkbox":
            return (
              <CheckboxField
                key={field.name}
                field={field}
                value={(value as string | string[]) ?? (field.options && field.options.length > 1 ? [] : "")}
                onChange={(v) => onChange(field.name, v)}
              />
            )

          case "radio":
            return (
              <RadioField
                key={field.name}
                field={field}
                value={(value as string) ?? ""}
                onChange={(v) => onChange(field.name, v)}
              />
            )

          default:
            return (
              <TextField
                key={field.name}
                field={field}
                value={(value as string) ?? ""}
                onChange={(v) => onChange(field.name, v)}
              />
            )
        }
      })}

      <div className="actions">
        {step.actions.map((action) => {
          if (action.type === "back") {
            return (
              <button
                key={action.label}
                type="button"
                className={action.variant}
                onClick={() => onAction("back")}
              >
                {action.label}
              </button>
            )
          }
          return (
            <button
              key={action.label}
              type="submit"
              className={action.variant}
              onClick={() => onAction(action.type)}
            >
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
