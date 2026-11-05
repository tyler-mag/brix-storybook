import './styles/tokens.generated.css'
import './styles/global.css'
import './App.css'

function App() {
  return (
    <main className="landing">
      <header className="landing__nav">
        <img src="/brand/brix-mark.svg" alt="Brix" />
        <span>Design system · v0.1</span>
      </header>
      <section className="landing__hero">
        <p className="landing__eyebrow">Call operations, made legible</p>
        <h1>Build the right interface from a shared set of decisions.</h1>
        <p className="landing__lede">
          Brix documents the foundations, components, and interaction rules
          behind a calmer call-operations workflow.
        </p>
        <a className="landing__link" href="/storybook/">
          Open Storybook <span aria-hidden="true">↗</span>
        </a>
      </section>
      <section className="landing__principles" aria-label="Brix principles">
        <article><b>01</b><p>Hierarchy before decoration.</p></article>
        <article><b>02</b><p>Semantic tokens before raw values.</p></article>
        <article><b>03</b><p>Decision guidance beside every component.</p></article>
      </section>
    </main>
  )
}

export default App
