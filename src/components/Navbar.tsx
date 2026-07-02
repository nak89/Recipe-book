import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }
    return (
        <nav className="border-b px-8 py-4 flex items-center justify-between">
            <Link to ="/" className="text-xl font-bold">
                📖 My Recipe Book
            </Link>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{user?.email}</span>
                <button
                    onClick={handleLogout}
                    className="text-sm px-4 py-2 rounded-lg border hover:bg-gray-50 text-red-600"
                >
                    Log out
                </button>
            </div>
        </nav>
    )
}

export default Navbar
