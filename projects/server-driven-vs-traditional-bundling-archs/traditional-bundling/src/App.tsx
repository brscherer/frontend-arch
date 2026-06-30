import { WizardProvider } from "./context/WizardContext.js"
import Wizard from "./components/Wizard.js"

export default function App() {
  return (
    <WizardProvider>
      <div className="app">
        <header>
          <h1>Traditional Bundling</h1>
          <p className="subtitle">All steps compiled into the bundle at build time</p>
        </header>
        <main>
          <Wizard />
        </main>
      </div>
    </WizardProvider>
  )
}
