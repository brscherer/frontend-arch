import { useWizard } from "../context/WizardContext.js"

export default function StepPreferences() {
  const { state, dispatch } = useWizard()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        dispatch({ type: "NEXT" })
      }}
    >
      <h2>Preferences</h2>
      <p className="step-desc">Customize your experience</p>

      <label>
        Theme
        <select
          value={(state.data.theme as string) ?? ""}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", name: "theme", value: e.target.value })
          }
        >
          <option value="">Select...</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </label>

      <fieldset>
        <legend>Email notifications</legend>
        {["updates", "newsletter", "activity"].map((item) => (
          <label key={item} className="checkbox-label">
            <input
              type="checkbox"
              value={item}
              checked={((state.data.notifications as string[]) ?? []).includes(item)}
              onChange={(e) => {
                const current = (state.data.notifications as string[]) ?? []
                const next = e.target.checked
                  ? [...current, item]
                  : current.filter((v) => v !== item)
                dispatch({ type: "SET_FIELD", name: "notifications", value: next })
              }}
            />
            {item === "updates" && "Product updates"}
            {item === "newsletter" && "Weekly newsletter"}
            {item === "activity" && "Account activity"}
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
