# 5-Minute Presentation: Traditional vs Server-Driven UI

## Setup (before starting)

```bash
# Terminal 1 — start the shared API
npm run --workspace=shared dev

# Terminal 2 — start both apps
npm run --workspace=traditional-bundling dev &
npm run --workspace=server-driven-ui dev &
```

**Pre-open in editor:**
- `traditional-bundling/src/components/Wizard.tsx`
- `traditional-bundling/src/components/StepEmail.tsx`
- `server-driven-ui/src/components/LayoutRenderer.tsx`
- `server-driven-ui/src/primitives/` (folder view)
- `shared/src/steps.ts`

---

## Script

---

### 0:00–0:30 — The Problem (Why compare?)

> "We built the same registration wizard two ways. Same look, same features. But the architectures couldn't be more different. One hardcodes every screen into the JavaScript bundle. The other lets the server decide what to render."

**Action:** Open both browser tabs (`localhost:5173`, `localhost:5174`). Point out they look identical.

> "The user sees the same thing. But ask the engineering team what happens when they need to *reorder the steps or change a label* — and the answers diverge completely."

---

### 0:30–1:30 — Traditional Bundling

> "Let's look at the traditional side first. Open `Wizard.tsx`."

**Highlight:** `traditional-bundling/src/components/Wizard.tsx`

```
switch (stepId) {
  case "email":       return <StepEmail />
  case "profile":     return <StepProfile />
  case "preferences": return <StepPreferences />
  case "plan":        return <StepPlan />
  case "billing":     return <StepBilling />
  case "review":      return <StepReview />
  case "confirmation":return <StepConfirmation />
}
```

> "Every step is hardcoded into the bundle at build time. The API tells us *which step ID* is active, and this switch picks the right component."

**Flip to:** `traditional-bundling/src/components/StepEmail.tsx`

```
<input name="email" type="email" required />
<input name="password" type="password" required />
```

> "Each step is a full form component. Fields, validation, labels, layout — all compiled in."

**Key point:**
> "To add a field → edit this file. To reorder steps → edit the switch. To fix a typo → PR, CI/CD, deploy. *Every UI change* requires the full deployment pipeline."

---

### 1:30–2:30 — Server-Driven UI

> "Now the other side. The client has *no idea* what a registration wizard is."

**Show:** `server-driven-ui/src/primitives/` folder — list the files:

```
TextField.tsx  SelectField.tsx  CheckboxField.tsx
RadioField.tsx  Button.tsx  ProgressBar.tsx
```

> "Six reusable primitives. That's it. The client only knows how to render a text field vs a select field vs a checkbox."

**Open:** `server-driven-ui/src/components/LayoutRenderer.tsx`

```
switch (field.type) {
  case "select":   return <SelectField ... />
  case "checkbox": return <CheckboxField ... />
  case "radio":    return <RadioField ... />
  default:         return <TextField ... />
}
```

> "Instead of `switch(stepId)`, we use `switch(field.type)`. The renderer doesn't know about email, billing, or plans — it just says 'oh, this is a text field, render it.'"

**Open:** `shared/src/steps.ts`

```typescript
steps: [
  { id: "email", fields: [
    { name: "email", type: "email", label: "Email address", required: true }
  ]},
  { id: "billing", condition: { field: "plan", equals: "pro" }}
]
```

> "The server defines everything — the steps, fields, validation, even conditional logic ('only show billing if plan is pro'). The client is a generic renderer of JSON."

**Key point:**
> "To reorder these steps → reorder the array. To make a field optional → change `required` to `false`. To fix a label → edit the JSON. All of these take seconds. No deploy needed."

---

### 2:30–3:15 — Live Demo (The "Aha" Moment)

> "Let me prove this matters. Watch what happens when I swap two steps on the server."

**Action:** Edit `shared/src/steps.ts` — swap the order of `profile` and `preferences`.

- Refresh the Traditional app (":5173") → **no change**. It has its own hardcoded order in Wizard.tsx.
- Refresh the SDUI app (":5174") → **steps appear in the new order**. It fetches the latest schema.

> "Same server change. Two different behaviors. The traditional app ignores it. The SDUI app obeys instantly. The traditional app is independent — the SDUI app is a thin shell controlled by the server."

---

### 3:15–4:00 — The Three Trade-offs

> "So which is better? It depends on what you're optimizing for."

**Trade-off 1 — Change velocity vs UI flexibility**

> "SDUI: change a label in 10 seconds, reorder in 5 seconds, fix bugs instantly. But if you need a brand-new type of UI that doesn't map to any existing primitive — date picker, drag-and-drop, 3D viewer — you still need a client deploy. Traditional can do anything, it just takes longer."

**Trade-off 2 — Resilience vs small bundles**

> "Traditional gets heavier as you add features."
- 10 screens: ~250 KB
- 50 screens: ~700 KB
> "But it works offline, cached by a service worker. SDUI stays tiny — 180 KB at 50 screens — but it's blank when the server is down."

**Trade-off 3 — Developer experience**

> "Traditional gives you HMR, React DevTools, full TypeScript compile-time safety. SDUI: the schema is JSON — no type checking, harder to debug through a generic renderer, and E2E tests can break when the schema changes."

---

### 4:00–4:30 — Decision Framework

> "Pick Traditional Bundling when…"
- UI is complex, custom, or animation-heavy
- Offline support is a requirement
- Your team is small and ships fast enough already

> "Pick Server-Driven UI when…"
- Product changes are frequent (A/B tests, experiments, last-minute edits)
- You have a design system that cleanly maps to 6-10 primitive components
- You need to fix bugs or ship changes without app store review cycles

---

### 4:30–5:00 — Closing

> "Both projects live in this repository. They share the same API server so you can compare them head-to-head."

**Point at:** `README.md` — the **Experiments to Run** section.

> "Try killing the API server — SDUI goes blank, traditional keeps working. Try adding a custom field type — traditional is one file, SDUI is a new primitive plus a deploy. The README walks through six experiments that expose the trade-offs."

> "The question isn't 'which is better?' — it's 'which trades off the things you care about least?' Questions?"

---

## Quick Reference

| Segment | Time | Files to Show | Key Line |
|---------|------|---------------|----------|
| Problem | 0:00–0:30 | Two browser tabs | "Same look, different architecture" |
| Traditional | 0:30–1:30 | `Wizard.tsx`, `StepEmail.tsx` | `switch(stepId)` |
| SDUI | 1:30–2:30 | `primitives/`, `LayoutRenderer.tsx`, `steps.ts` | `switch(field.type)` |
| Demo | 2:30–3:15 | `steps.ts` (edit live) | Reorder steps → only SDUI updates |
| Trade-offs | 3:15–4:00 | Comparison tables in README | Velocity vs flexibility, resilience vs bundles, DX |
| Decision | 4:00–4:30 | — | "Pick X when…" |
| Close | 4:30–5:00 | README → Experiments | "Run the experiments yourself" |
