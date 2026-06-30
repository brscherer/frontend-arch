import { useEffect, useState } from "react"
import { useWizard } from "../context/WizardContext.js"
import { fetchWizardSteps } from "../api/client.js"
import StepEmail from "./StepEmail.js"
import StepProfile from "./StepProfile.js"
import StepPreferences from "./StepPreferences.js"
import StepPlan from "./StepPlan.js"
import StepBilling from "./StepBilling.js"
import StepReview from "./StepReview.js"
import StepConfirmation from "./StepConfirmation.js"

export default function Wizard() {
  const { state, dispatch } = useWizard()
  const [loading, setLoading] = useState(true)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    fetchWizardSteps()
      .then((steps) => dispatch({ type: "SET_STEPS", steps: [...steps, "confirmation"] }))
      .finally(() => setLoading(false))
  }, [dispatch])

  if (loading) return <div className="loading">Loading wizard...</div>
  if (state.steps.length === 0) return <div className="error">No steps configured</div>

  const stepId = state.steps[state.currentStep]
  if (!stepId) return <div className="error">Step not found</div>
  if (complete) return <StepConfirmation />

  const isLastStep = state.currentStep === state.steps.length - 1

  return (
    <div className="wizard">
      <div className="progress">
        {state.steps.slice(0, -1).map((id, i) => (
          <span
            key={id}
            className={`step-dot ${i === state.currentStep ? "active" : ""} ${i < state.currentStep ? "done" : ""}`}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <div className="step-content">
        {isLastStep ? (
          <StepReview onComplete={() => setComplete(true)} />
        ) : (
          <StepSwitch stepId={stepId} />
        )}
      </div>
    </div>
  )
}

function StepSwitch({ stepId }: { stepId: string }) {
  switch (stepId) {
    case "email":
      return <StepEmail />
    case "profile":
      return <StepProfile />
    case "preferences":
      return <StepPreferences />
    case "plan":
      return <StepPlan />
    case "billing":
      return <StepBilling />
    default:
      return <div className="error">Unknown step: {stepId}</div>
  }
}
