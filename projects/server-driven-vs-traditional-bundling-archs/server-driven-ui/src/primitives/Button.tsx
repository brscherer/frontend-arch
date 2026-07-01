import type { ActionDefinition } from "../types.js"

interface Props {
  action: ActionDefinition
  disabled?: boolean
  onClick: () => void
}

export default function Button({ action, disabled, onClick }: Props) {
  return (
    <button
      type={action.type === "submit" ? "submit" : "button"}
      className={action.variant}
      disabled={disabled}
      onClick={onClick}
    >
      {action.label}
    </button>
  )
}
