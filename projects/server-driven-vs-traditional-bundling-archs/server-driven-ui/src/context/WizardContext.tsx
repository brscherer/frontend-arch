import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { WizardSchema } from "../types.js"

interface WizardState {
  schema: WizardSchema | null
  currentStep: number
  data: Record<string, unknown>
  complete: boolean
}

type Action =
  | { type: "SET_SCHEMA"; schema: WizardSchema }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SET_FIELD"; name: string; value: unknown }
  | { type: "COMPLETE" }
  | { type: "RESET" }

function wizardReducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "SET_SCHEMA":
      return { ...state, schema: action.schema, currentStep: 0 }
    case "NEXT":
      return { ...state, currentStep: state.currentStep + 1 }
    case "BACK":
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) }
    case "SET_FIELD":
      return { ...state, data: { ...state.data, [action.name]: action.value } }
    case "COMPLETE":
      return { ...state, complete: true }
    case "RESET":
      return { schema: null, currentStep: 0, data: {}, complete: false }
    default:
      return state
  }
}

const WizardContext = createContext<{
  state: WizardState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, {
    schema: null,
    currentStep: 0,
    data: {},
    complete: false,
  })

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider")
  return ctx
}
