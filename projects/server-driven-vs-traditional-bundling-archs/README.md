# Server-Driven UI vs Traditional Bundling

A side-by-side evaluation of two frontend architectures built with a shared registration wizard.

## The Demo App

Both projects implement the same **multi-step registration wizard**:

- Email/Sign-up step
- Profile step
- Preferences step
- Plan selection
- Billing (conditional — only for Pro plan)
- Review & submit
- Confirmation

The shared API server (`shared/`) provides the wizard data. What differs is **where the UI layout lives**.

> **Diagrams:** Visual architecture diagrams are available in the [`diagrams/`](./diagrams/) folder, including architecture flow, component hierarchy, deploy cycle comparison, bundle size analysis, and failure mode comparisons.

---

## Architecture A: Traditional Bundling

**Location:** `traditional-bundling/`

UI is compiled into JavaScript bundles at build time. Every screen, component, and form is a hardcoded `.tsx` file shipped with the app.

### How it works

```
┌──────────┐   build-time    ┌──────────────────┐
│  Step*.tsx │ ────────────→ │  bundle.js        │
│  Wizard.tsx│               │  (all components) │
│  App.tsx   │               └──────────────────┘
└───────────┘                       │
                                    ▼
┌──────────┐   runtime        ┌──────────────────┐
│  API      │ ←────────────── │  Client renders   │
│  server   │    step IDs     │  hardcoded steps  │
└──────────┘                  └──────────────────┘
```

The API only tells the client *which steps to show* (by ID). The client maps each ID to a compiled component.

### Pros

| Aspect | Benefit |
|--------|---------|
| **Performance** | Full UI available offline; no network dependency for layout |
| **Tooling** | Full React DevTools, Hot Module Replacement, type safety |
| **Flexibility** | Unlimited — any component, animation, or interaction is possible |
| **Testing** | Stable selectors, predictable DOM structure |
| **Error resilience** | App works even if the API is down (last known state) |

### Cons

| Aspect | Drawback |
|--------|----------|
| **Deploy velocity** | Any UI change = CI/CD deploy → build → rollout |
| **Bundle size** | Grows with every new screen/component added |
| **A/B testing** | Requires feature flags + separate deploys or complex flag infrastructure |
| **Conditional UI** | Logic hardcoded in components — changing conditions requires code change |

---

## Architecture B: Server-Driven UI

**Location:** `server-driven-ui/`

The client is a thin shell with generic primitive components. The server defines the entire screen layout, fields, validation, and actions in a JSON schema. The client renders whatever the server says.

### How it works

```
┌──────────┐   runtime       ┌──────────────────┐
│  Server   │ ────────────→  │  Client receives  │
│  schema   │   GET /schema  │  JSON schema       │
│  (JSON)   │                │                    │
└──────────┘                └──────────────────┘
       │                            │
       │                      ┌─────▼──────┐
       │                      │ Layout     │
       │                      │ Renderer   │
       │                      │ (maps type │
       │                      │  → comp.)   │
       │                      └─────┬──────┘
       │                            │
       ▼                     ┌──────▼───────┐
  ┌──────────┐    runtime    │  Primitives   │
  │  Server   │ ←──────────  │  TextField    │
  │  validates│   POST data  │  SelectField  │
  └──────────┘               │  CheckboxField│
                             │  RadioField   │
                             │  ProgressBar  │
                             └──────────────┘
```

The client has **zero knowledge** of specific steps. It only knows how to render field types.

### Pros

| Aspect | Benefit |
|--------|---------|
| **Deploy velocity** | UI changes = edit server JSON → instant. No client deploy needed |
| **A/B testing** | Serve different schemas to different cohorts. Trivial. |
| **Conditional UI** | Server decides what to show per user/plan/context |
| **Bundle size** | Small and fixed — primitives don't grow with new features |
| **Consistency** | One schema language enforces uniform UI patterns |

### Cons

| Aspect | Drawback |
|--------|----------|
| **Network dependency** | App cannot render without a server response (layout + data) |
| **Limited flexibility** | Only what the primitives support. Novel UI = new primitive = client deploy |
| **Tooling immaturity** | No React DevTools for dynamic content; harder HMR |
| **Testing complexity** | DOM structure varies per server response — selectors are brittle |
| **Latency waterfall** | Must fetch schema first, *then* render. Adds a round trip |
| **Caching strategy** | Must cache both layout schema and data, with different invalidation rules |

---

## Head-to-Head Comparison

| Dimension | Traditional Bundling | Server-Driven UI |
|-----------|-------------------|------------------|
| **Bundle size** | 151.6 KB (48.3 KB gzip) | 147.9 KB (47.6 KB gzip) |
| **Time to interactive** | Must parse + execute full bundle | Thin shell — but waits for schema fetch |
| **UI change cycle** | Code → PR → CI/CD → deploy (minutes/hours) | Edit JSON → instant |
| **Add a new field** | Write a new React component | Add a field definition to the schema |
| **Reorder steps** | Edit Wizard.tsx, reorder switch cases | Reorder array in JSON |
| **Add a new step type** | Create new `StepFoo.tsx`, add to Wizard | Add a new server schema entry (client already handles it) |
| **Change conditional logic** | Edit component code | Edit schema `condition` property |
| **Offline support** | Full app works offline | Blank screen without server |
| **Per-user customization** | Requires client logic or feature flags | Server serves different schemas per user |
| **Developer experience** | HMR, React DevTools, full type safety | Must test via server responses; harder to debug |
| **E2E test stability** | Static selectors (`.StepEmail input`) | Dynamic selectors depend on schema |
| **Learning curve** | Standard React knowledge | React + custom schema language |

---

## Key Trade-offs to Evaluate

### 1. Velocity vs Flexibility

SDUI maximizes **change velocity** — product changes are server config updates. But it caps **UI flexibility** to whatever the primitive set supports. If a designer wants a novel interaction, you need a new primitive (which requires a client deploy, defeating the purpose).

Traditional bundling gives unlimited flexibility at the cost of slower iteration.

### 2. Resilience vs Central Control

Traditional bundling degrades gracefully — the app still renders even when the API is down. SDUI creates a hard dependency on the server for *both* data and layout. A schema server outage means a blank app.

However, SDUI gives central control. You can fix a broken UI instantly across all users without waiting for them to update their client.

### 3. Bundle Size Economics

In a small app like this wizard, bundle differences are negligible (~4 KB). But at scale — think 50+ screens — the traditional bundle grows linearly with each new page. SDUI's primitive set stays roughly constant regardless of how many screens the server defines.

### 4. Testing Strategy

- **Traditional**: Unit test each `Step*` component with static props. E2E tests use stable selectors.
- **SDUI**: Test each primitive in isolation. E2E tests must mock the schema or be parameterized by it. Schema changes can break tests even though client code didn't change.

---

## Experiments to Run

| # | Experiment | What to Observe |
|---|-----------|-----------------|
| 1 | **Reorder steps** — Edit `shared/src/steps.ts` and reorder the array. Reload both apps. | Traditional: unchanged (hardcoded order). SDUI: reflects new order immediately. |
| 2 | **Add a field** — Add a new `FieldDefinition` to any step in `steps.ts`. | Traditional: nothing changes (client ignores unknown fields). SDUI: new field renders automatically. |
| 3 | **Change conditional logic** — Change `condition.equals` on the billing step from `"pro"` to `"free"`. | Traditional: unchanged. SDUI: billing now shows for free users. |
| 4 | **Bundle analysis** — Run `npx vite build --analyze` on both projects (or compare `dist/` sizes). | Traditional grows with step count. SDUI stays constant. |
| 5 | **Simulate API failure** — Stop the shared server and reload both apps. | Traditional: progress UI renders (can't submit). SDUI: blank screen with error. |
| 6 | **Add a new step type** — Add a new step like `"upload_avatar"` with a `file` field type. | Traditional: need a new component + client deploy. SDUI: need a new primitive + client deploy. Both require client changes. |

---

## Running the Projects

```sh
# Terminal 1 — API server (port 3001)
npm run dev:shared

# Terminal 2 — Traditional bundling (port 5173)
npm run dev:traditional

# Terminal 3 — Server-Driven UI (port 5174)
npm run dev:sdui

# Or all at once:
npm run dev
```

Both apps are identical in functionality. The difference is in *how* the UI is defined and delivered.
