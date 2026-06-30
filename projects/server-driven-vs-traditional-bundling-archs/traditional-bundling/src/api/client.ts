interface SubmitPayload {
  email: string
  display_name: string
  plan: string
  [key: string]: unknown
}

const BASE = "http://localhost:3001"

export async function fetchWizardSteps(): Promise<string[]> {
  const res = await fetch(`${BASE}/api/wizard/schema`)
  const data = await res.json()
  return data.steps.map((s: { id: string }) => s.id)
}

export async function submitWizard(payload: SubmitPayload) {
  const res = await fetch(`${BASE}/api/wizard/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}
