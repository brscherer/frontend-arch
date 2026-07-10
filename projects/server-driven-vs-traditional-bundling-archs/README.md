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

The shared API server (`shared/`) provides wizard data. What differs is **where the UI layout lives**:
- **Traditional**: the API only accepts form submissions. Fields, steps, validation, and order are all baked into the client bundle.
- **SDUI**: the API serves a full JSON schema that defines every field, step, and validation rule. The client is a generic renderer.

> **Diagrams:** Visual architecture diagrams are available in the [`diagrams/`](./diagrams/) folder, including architecture flow, component hierarchy, deploy cycle comparison, bundle size analysis, and failure mode comparisons.

---

## Architecture A: Traditional Bundling

**Location:** `traditional-bundling/`

UI is compiled into JavaScript bundles at build time. Every screen, component, and form is a hardcoded `.tsx` file shipped with the app.

### How it works

See [`diagrams/traditional-architecture.drawio`](./diagrams/traditional-architecture.drawio) for a visual diagram.

Step order is defined by a `STEPS` constant in `Wizard.tsx`, baked into the bundle at build time. Each step is a dedicated component (`StepEmail`, `StepProfile`, etc.) hardcoded with its own fields, labels, and validation. The API is only used for form submission (`POST /api/wizard/submit`) — it has no influence over UI structure.

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

See [`diagrams/sdui-architecture.drawio`](./diagrams/sdui-architecture.drawio) for a visual diagram.

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

### Architecture & Rendering

| Dimension | Traditional Bundling | Server-Driven UI |
|-----------|-------------------|------------------|
| **UI source of truth** | Compiled bundle at build time | Server JSON schema at runtime |
| **Client-side rendering** | Hardcoded `Step*.tsx` components mapped by `switch(stepId)` | Generic `LayoutRenderer` maps `switch(field.type)` to primitives |
| **Component count** | 7 step components + 3 layout files (grows with features) | 6 primitives + 1 layout renderer (fixed) |
| **Adding a new step** | Create `.tsx` file → import → add switch case → deploy | Add entry to server schema JSON only |
| **Skinny vs fat client** | Fat client — all logic compiled in | Skinny client — rendering logic on server |
| **API dependency** | Only uses `POST /api/wizard/submit` for form data. No UI schema coupling. | Uses `GET /api/wizard/schema` for layout + `POST /api/wizard/submit`. Full coupling. |

### Performance & Bundle

| Dimension | Traditional Bundling | Server-Driven UI |
|-----------|-------------------|------------------|
| **Bundle size (current)** | 151.6 KB (48.3 KB gzip) | 147.9 KB (47.6 KB gzip) |
| **Bundle growth (10 screens)** | ~250 KB | ~155 KB |
| **Bundle growth (25 screens)** | ~400 KB | ~165 KB |
| **Bundle growth (50 screens)** | ~700 KB | ~180 KB |
| **Time to interactive** | Parse + execute full bundle | Thin shell loads fast, but blocked on schema fetch |
| **Offline support** | Full app renders offline (cached bundle + service worker) | Blank screen — needs server for both layout and data |

### Change Velocity

| Dimension | Traditional Bundling | Server-Driven UI |
|-----------|-------------------|------------------|
| **UI change cycle** | Code → PR → CI/CD → deploy (minutes–hours) | Edit server JSON → instant |
| **Deploy frequency** | Every UI change requires full pipeline | Only when server itself changes |
| **Step reordering** | Edit Wizard.tsx, reorder switch cases | Reorder array in JSON schema |
| **Conditional logic changes** | Edit component `.tsx` code | Edit `condition` property in schema |
| **A/B testing** | Requires feature flags + separate deploys | Serve different schema per cohort — zero client changes |

### Failure Modes

| Scenario | Traditional Bundling | Server-Driven UI |
|----------|-------------------|------------------|
| **API server down** | UI renders normally (cached bundle). Only submission fails. | Blank screen or loading spinner. No render without schema. |
| **Slow network** | App loads instantly from CDN. Data requests delay independently. | Schema fetch blocks all rendering. User sees loader. |
| **Schema bug** | Not affected — components are compiled-in. | Broken layout, but fix is instant (edit JSON, no deploy). |
| **New UI requirement** | Full cycle: component → PR → CI/CD → deploy | If within primitives: instant. New primitive needed: same as traditional. |

### Developer Experience

| Dimension | Traditional Bundling | Server-Driven UI |
|-----------|-------------------|------------------|
| **Hot Module Replacement** | Full HMR — instant feedback | Only primitive code changes trigger HMR |
| **React DevTools** | Works for all components | Dynamic content harder to inspect |
| **TypeScript safety** | Full compile-time checks throughout | Schema is JSON — no compile-time validation |
| **Unit testing** | Test each `Step*` component with static props | Test each primitive in isolation |
| **E2E test stability** | Static selectors (`input[name="email"]`) | Selectors depend on schema — can break without client change |
| **Debugging** | Standard browser dev tools, stack traces | Must trace through generic renderer + server response |

### Caching & Distribution

| Dimension | Traditional Bundling | Server-Driven UI |
|-----------|-------------------|------------------|
| **Cache strategy** | Immutable hashed bundles with long-lived CDN cache | Static bundle + dynamic schema (different invalidation rules) |
| **Cache invalidation** | New deploy = new hash. No staleness concerns. | Must balance: cache schema (stale UI) vs always fetch (no offline) |
| **Service worker** | Can precache entire app | Can only precache primitive shell |
| **Update propagation** | Users download new bundle on next visit | Schema change applies immediately on next fetch |

### Code Complexity

| Dimension | Traditional Bundling | Server-Driven UI |
|-----------|-------------------|------------------|
| **File structure** | N step components + 1 `switch(stepId)` | M primitives + 1 `switch(field.type)` |
| **Scaling pattern** | Linear — each new feature adds components | Constant — primitives are reused |
| **Business logic location** | Spread across step components | Centralized in server schema |
| **Design consistency** | Relies on dev discipline | Enforced by schema language |

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
| 2 | **Add a field** — Add a new `FieldDefinition` to any step in `steps.ts`. | Traditional: nothing changes (client doesn't fetch schema at all). SDUI: new field renders automatically. |
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
