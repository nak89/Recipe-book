import { Link } from 'react-router-dom'

function ProfilePage() {
  return (
    <section className="app-card rounded-[2rem] p-8">
      <p className="text-xs uppercase tracking-[0.35em] app-muted">Profile</p>
      <h1 className="mt-3 text-3xl font-semibold">Profile page coming soon</h1>
      <p className="mt-3 max-w-xl app-muted">
        The link is wired up so the sidebar feels complete, and this page can later show account details, avatar, and saved preferences.
      </p>
      <Link to="/" className="mt-6 inline-flex rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white">
        Back to recipes
      </Link>
    </section>
  )
}

export default ProfilePage