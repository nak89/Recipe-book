import type { ReactNode } from 'react'
import Navbar from './Navbar'

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen">
            <Navbar/>
            <main>{children}</main>
        </div>
    )
}

export default Layout 