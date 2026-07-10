const BASE = "http://localhost:3001"

export async function submitWizard(payload: Record<string, unknown>) {
  const res = await fetch(`${BASE}/api/wizard/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}
