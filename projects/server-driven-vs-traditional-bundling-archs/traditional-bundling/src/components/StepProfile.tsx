import { useWizard } from "../context/WizardContext.js"

export default function StepProfile() {
  const { state, dispatch } = useWizard()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        dispatch({ type: "NEXT" })
      }}
    >
      <h2>Profile</h2>
      <p className="step-desc">Tell us about yourself</p>

      <label>
        Display name
        <input
          type="text"
          required
          minLength={2}
          placeholder="Jane Doe"
          value={(state.data.display_name as string) ?? ""}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", name: "display_name", value: e.target.value })
          }
        />
      </label>

      <label>
        Phone number
        <input
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={(state.data.phone as string) ?? ""}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", name: "phone", value: e.target.value })
          }
        />
      </label>

      <div className="actions">
        <button type="button" className="ghost" onClick={() => dispatch({ type: "BACK" })}>
          Back
        </button>
        <button type="submit" className="primary">Next</button>
      </div>
    </form>
  )
}
