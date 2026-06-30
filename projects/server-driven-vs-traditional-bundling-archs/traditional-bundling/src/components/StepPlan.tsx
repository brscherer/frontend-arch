import { useWizard } from "../context/WizardContext.js"

export default function StepPlan() {
  const { state, dispatch } = useWizard()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        dispatch({ type: "NEXT" })
      }}
    >
      <h2>Choose a Plan</h2>
      <p className="step-desc">Select the plan that fits you</p>

      <fieldset>
        <legend>Plan</legend>
        {[
          { value: "free", label: "Free — $0/mo" },
          { value: "pro", label: "Pro — $12/mo" },
          { value: "enterprise", label: "Enterprise — custom" },
        ].map((opt) => (
          <label key={opt.value} className="radio-label">
            <input
              type="radio"
              name="plan"
              value={opt.value}
              checked={state.data.plan === opt.value}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", name: "plan", value: e.target.value })
              }
            />
            {opt.label}
          </label>
        ))}
      </fieldset>

      <div className="actions">
        <button type="button" className="ghost" onClick={() => dispatch({ type: "BACK" })}>
          Back
        </button>
        <button type="submit" className="primary">Next</button>
      </div>
    </form>
  )
}
