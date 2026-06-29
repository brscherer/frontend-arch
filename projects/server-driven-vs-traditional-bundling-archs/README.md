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
