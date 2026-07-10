import { createContext, useContext, useReducer, type ReactNode } from "react"

interface WizardState {
  currentStep: number
  data: Record<string, unknown>
}

type Action =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SET_FIELD"; name: string; value: unknown }
  | { type: "RESET" }

function wizardReducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "NEXT":
      return { ...state, currentStep: state.currentStep + 1 }
    case "BACK":
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) }
    case "SET_FIELD":
      return { ...state, data: { ...state.data, [action.name]: action.value } }
    case "RESET":
      return { currentStep: 0, data: {} }
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
    currentStep: 0,
    data: {},
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
