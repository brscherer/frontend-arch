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
