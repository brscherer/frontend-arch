import { useWizard } from "../context/WizardContext.js"

export default function StepEmail() {
  const { state, dispatch } = useWizard()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        dispatch({ type: "NEXT" })
      }}
    >
      <h2>Sign Up</h2>
      <p className="step-desc">Choose how to sign up</p>

      <fieldset>
        <legend>Sign up with</legend>
        {["email", "google", "github"].map((method) => (
          <label key={method} className="radio-label">
            <input
              type="radio"
              name="signup_method"
              value={method}
              checked={state.data.signup_method === method}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", name: "signup_method", value: e.target.value })
              }
            />
            {method.charAt(0).toUpperCase() + method.slice(1)}
          </label>
        ))}
      </fieldset>

      <label>
        Email address
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={(state.data.email as string) ?? ""}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", name: "email", value: e.target.value })
          }
        />
      </label>

      <label>
        Password
        <input
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          value={(state.data.password as string) ?? ""}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", name: "password", value: e.target.value })
          }
        />
      </label>

      <div className="actions">
        <button type="submit" className="primary">Next</button>
      </div>
    </form>
  )
}
