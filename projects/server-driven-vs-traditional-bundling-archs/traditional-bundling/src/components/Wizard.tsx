import { useState } from "react"
import { useWizard } from "../context/WizardContext.js"
import StepEmail from "./StepEmail.js"
import StepProfile from "./StepProfile.js"
import StepPreferences from "./StepPreferences.js"
import StepPlan from "./StepPlan.js"
import StepReview from "./StepReview.js"
import StepConfirmation from "./StepConfirmation.js"

const STEPS = ["email", "preferences", "profile", "plan", "review"]

export default function Wizard() {
  const { state } = useWizard()
  const [complete, setComplete] = useState(false)

  const stepId = STEPS[state.currentStep]
  if (!stepId) return <div className="error">Step not found</div>
  if (complete) return <StepConfirmation />

  const isLastStep = state.currentStep === STEPS.length - 1

  return (
    <div className="wizard">
      <div className="progress">
        {STEPS.map((id, i) => (
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
    default:
      return <div className="error">Unknown step: {stepId}</div>
  }
}
