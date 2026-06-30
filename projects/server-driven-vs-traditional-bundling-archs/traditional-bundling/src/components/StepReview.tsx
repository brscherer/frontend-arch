import { useWizard } from "../context/WizardContext.js"
import { submitWizard } from "../api/client.js"
import { useState } from "react"

interface Props {
  onComplete: () => void
}

export default function StepReview({ onComplete }: Props) {
  const { state, dispatch } = useWizard()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const data = state.data.plan === "free"
        ? { ...state.data, plan: "free" }
        : state.data
      await submitWizard(data as never)
      onComplete()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <h2>Review & Submit</h2>
      <p className="step-desc">Double-check everything before submitting</p>

      <div className="review-fields">
        {Object.entries(state.data).map(([key, value]) => (
          <div key={key} className="review-row">
            <strong>{key.replace(/_/g, " ")}</strong>
            <span>{Array.isArray(value) ? value.join(", ") : String(value)}</span>
          </div>
        ))}
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          required
          checked={(state.data.agree_terms as boolean) ?? false}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", name: "agree_terms", value: e.target.checked })
          }
        />
        I agree to the Terms of Service and Privacy Policy
      </label>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="button" className="ghost" onClick={() => dispatch({ type: "BACK" })}>
          Back
        </button>
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Create Account"}
        </button>
      </div>
    </form>
  )
}
