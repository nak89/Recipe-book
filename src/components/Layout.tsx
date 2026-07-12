import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed'

function Layout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
    })

    useEffect(() => {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed))
    }, [isSidebarCollapsed])

    const sidebarLinks = [
        { label: 'Profile', to: '/profile' },
        { label: 'Settings', to: '/settings' },
    ]

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <div className="app-shell relative flex min-h-screen flex-col lg:flex-row">
            <button
                type="button"
                onClick={() => setIsSidebarCollapsed((current) => !current)}
                aria-expanded={!isSidebarCollapsed}
                aria-label={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                className="app-panel fixed left-4 top-4 z-50 rounded-full px-4 py-2 text-sm font-medium shadow-lg"
            >
                <span aria-hidden="true" className="text-lg leading-none">
                    ☰
                </span>
                <span className="sr-only">{isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}</span>
            </button>

            <aside
                className={`app-sidebar border-b lg:border-b-0 lg:border-r lg:sticky lg:top-0 lg:h-screen overflow-hidden px-4 py-5 flex flex-col justify-between gap-6 transition-all duration-300 ease-in-out ${
                    isSidebarCollapsed ? 'lg:w-0 lg:px-0 lg:py-0 lg:border-r-0 lg:opacity-0 pointer-events-none' : 'lg:w-72'
                }`}
            >
                <div className="space-y-6 pt-12 lg:pt-14">
                    <Link to="/" className="block rounded-2xl px-4 py-3">
                        <div className="text-xs uppercase tracking-[0.3em] app-muted">Recipe Book</div>
                        <div className="mt-2 text-lg font-semibold">Editorial kitchen</div>
                        <p className="mt-1 text-sm app-muted">Browse your collection with a calm, modern shell.</p>
                    </Link>

                    <div className="space-y-2">
                        {sidebarLinks.map((item) => {
                            const isActive = location.pathname === item.to
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium app-link-hover ${isActive ? 'bg-[var(--accent-soft)] text-[var(--text)]' : 'text-[var(--text)]'}`}
                                >
                                    <span>{item.label}</span>
                                    <span className="app-muted">→</span>
                                </Link>
                            )
                        })}

                        <Link
                            to="/recipe/new"
                            className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text)] app-link-hover"
                        >
                            <span>Quick add</span>
                            <span className="app-muted">+</span>
                        </Link>

                        <button
                            onClick={toggleTheme}
                            className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text)] app-link-hover"
                        >
                            <span>{theme === 'dark' ? 'Switch to light' : 'Switch to dark'}</span>
                            <span className="app-muted">◐</span>
                        </button>
                    </div>

                    <div className="app-panel rounded-3xl px-4 py-4">
                        <div className="text-xs uppercase tracking-[0.28em] app-muted">Signed in as</div>
                        <div className="mt-2 text-sm font-medium break-words">{user?.email ?? 'Guest user'}</div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white"
                    style={{ backgroundColor: 'var(--danger)' }}
                >
                    Sign out
                </button>
            </aside>

            <main className={`flex-1 px-4 py-16 sm:px-6 lg:px-8 lg:py-16 ${isSidebarCollapsed ? 'lg:pl-20' : ''}`}>
                {children}
            </main>
        </div>
    )
}

export default Layout 