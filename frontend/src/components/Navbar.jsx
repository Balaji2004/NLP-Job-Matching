// src/components/Navbar.jsx
// Responsive top navigation bar for authenticated pages

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { LayoutDashboard, FileSearch, History, LogOut, Menu, X, Zap } from 'lucide-react'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analyze',   label: 'Analyzer',  icon: FileSearch },
  { to: '/history',   label: 'History',   icon: History },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4FACFE, #A855F7)' }}>
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-lg neon-text">ResumeMatch</span>
            <span className="text-white/30 font-display font-light text-lg">AI</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all duration-200
                    ${active
                      ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                    }`}>
                  <Icon size={15} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* User info + logout */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <span className="text-white/30 font-body text-xs truncate max-w-[160px]">
                {user.email}
              </span>
            )}
            <button onClick={handleLogout}
              className="flex items-center gap-2 btn-glass text-sm py-2 px-4 text-red-400/80 hover:text-red-400">
              <LogOut size={14} />
              Sign out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden glass p-2 rounded-lg text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/[0.06] px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.05] transition-all font-body text-sm">
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-white/[0.05] transition-all font-body text-sm text-left">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}
