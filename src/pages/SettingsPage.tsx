import { Link } from 'react-router-dom'

function SettingsPage() {
  return (
    <section className="app-card rounded-[2rem] p-8">
      <p className="text-xs uppercase tracking-[0.35em] app-muted">Settings</p>
      <h1 className="mt-3 text-3xl font-semibold">Settings coming soon</h1>
      <p className="mt-3 max-w-xl app-muted">
        This route is in place for the sidebar link and can be expanded later with actual preferences, account options, and theme controls.
      </p>
      <Link to="/" className="mt-6 inline-flex rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white">
        Back to recipes
      </Link>
    </section>
  )
}

export default SettingsPage