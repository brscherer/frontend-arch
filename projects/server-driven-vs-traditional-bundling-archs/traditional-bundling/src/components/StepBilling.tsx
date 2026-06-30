import { useWizard } from "../context/WizardContext.js"

export default function StepBilling() {
  const { state, dispatch } = useWizard()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        dispatch({ type: "NEXT" })
      }}
    >
      <h2>Billing</h2>
      <p className="step-desc">Enter payment details</p>

      <label>
        Card number
        <input
          type="text"
          required
          placeholder="4242 4242 4242 4242"
          pattern="^[\d ]{16,19}$"
          value={(state.data.card_number as string) ?? ""}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", name: "card_number", value: e.target.value })
          }
        />
      </label>

      <label>
        Expiry date
        <input
          type="text"
          required
          placeholder="MM/YY"
          value={(state.data.card_expiry as string) ?? ""}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", name: "card_expiry", value: e.target.value })
          }
        />
      </label>

      <label>
        CVC
        <input
          type="password"
          required
          placeholder="123"
          pattern="^\d{3,4}$"
          value={(state.data.card_cvc as string) ?? ""}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", name: "card_cvc", value: e.target.value })
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
