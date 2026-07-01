import { useEffect, useState } from "react"
import { WizardProvider, useWizard } from "./context/WizardContext.js"
import { fetchWizardSchema, submitWizard } from "./api/client.js"
import LayoutRenderer from "./components/LayoutRenderer.js"
import { ProgressBar } from "./primitives/index.js"

function Wizard() {
  const { state, dispatch } = useWizard()
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    fetchWizardSchema()
      .then((schema) => dispatch({ type: "SET_SCHEMA", schema }))
      .catch(() => setFetchError("Failed to load wizard configuration from server"))
      .finally(() => setLoading(false))
  }, [dispatch])

  if (loading) return <div className="loading">Loading wizard from server...</div>
  if (fetchError) return <div className="error">{fetchError}</div>
  if (!state.schema) return <div className="error">No schema received</div>
  if (state.complete) {
    return (
      <div className="confirmation">
        <h2>Account Created!</h2>
        <p>Welcome aboard. Your account is ready to go.</p>
      </div>
    )
  }

  const step = state.schema.steps[state.currentStep]
  if (!step) return <div className="error">Step not found in schema</div>

  const handleFieldChange = (name: string, value: unknown) => {
    dispatch({ type: "SET_FIELD", name, value })
  }

  const handleAction = async (actionType: string) => {
    if (actionType === "back") {
      dispatch({ type: "BACK" })
      return
    }

    if (actionType === "submit") {
      try {
        await submitWizard(state.data)
        dispatch({ type: "COMPLETE" })
      } catch {
        alert("Submission failed. Please try again.")
      }
      return
    }

    if (actionType === "next") {
      dispatch({ type: "NEXT" })
      return
    }
  }

  return (
    <div className="wizard">
      <ProgressBar current={state.currentStep} total={state.schema.totalSteps} />
      <form onSubmit={(e) => { e.preventDefault(); handleAction("submit") }}>
        <LayoutRenderer
          step={step}
          data={state.data}
          onChange={handleFieldChange}
          onAction={handleAction}
        />
      </form>
    </div>
  )
}

export default function App() {
  return (
    <WizardProvider>
      <div className="app">
        <header>
          <h1>Server-Driven UI</h1>
          <p className="subtitle">All steps rendered from server schema at runtime</p>
        </header>
        <main>
          <Wizard />
        </main>
      </div>
    </WizardProvider>
  )
}
