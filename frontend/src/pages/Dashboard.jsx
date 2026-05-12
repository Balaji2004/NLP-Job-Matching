// src/pages/Dashboard.jsx
// Main dashboard: shows summary stats, quick-action cards, recent history

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { fetchHistory } from '../utils/api'
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'
import { FileSearch, History, TrendingUp, Award, ArrowRight, Clock } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    if (!user?.email) return
    fetchHistory(user.email)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoadingHistory(false))
    }, [user, location.pathname])

  // Compute quick stats from history
  const avgScore = history.length
    ? Math.round(history.reduce((s, h) => s + (h.match_percentage || 0), 0) / history.length)
    : null
  const best = history.length
    ? Math.max(...history.map((h) => h.match_percentage || 0))
    : null

  const QUICK_ACTIONS = [
    {
      to: '/analyze',
      icon: FileSearch,
      label: 'Analyze Resume',
      desc: 'Upload PDF + paste job description',
      color: '#4FACFE',
    },
    {
      to: '/history',
      icon: History,
      label: 'View History',
      desc: `${history.length} past analyses`,
      color: '#A855F7',
    },
  ]

  const STATS = [
    { label: 'Total Analyses', value: history.length, icon: TrendingUp, color: '#4FACFE' },
    { label: 'Average Score',  value: avgScore != null ? `${avgScore}%` : '—', icon: Award,      color: '#A855F7' },
    { label: 'Best Score',     value: best    != null ? `${best}%`    : '—', icon: Award,      color: '#00F5FF' },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-16 page-enter">
        {/* Greeting */}
        <div className="mb-10">
          <p className="text-white/40 font-body text-sm mb-1 font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-display font-bold text-3xl text-white">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="text-white/40 font-body mt-1">Here's your ATS intelligence overview.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}22`, border: `1px solid ${color}33` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-white/40 font-body text-xs">{label}</p>
                <p className="font-display font-bold text-2xl text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {QUICK_ACTIONS.map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to}
              className="card-hover p-6 group flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}22`, border: `1px solid ${color}33` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div>
                  <p className="font-display font-semibold text-white">{label}</p>
                  <p className="text-white/40 font-body text-sm">{desc}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent history */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">Recent Analyses</h2>
            <Link to="/history" className="text-neon-blue font-body text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {loadingHistory ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer h-16 rounded-xl" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="card text-center py-12">
              <FileSearch size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 font-body text-sm">No analyses yet.</p>
              <Link to="/analyze" className="btn-primary inline-flex items-center gap-2 mt-4 py-2.5 px-5 text-sm">
                Analyze your first resume <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <div key={item.id} className="card-hover flex items-center justify-between p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full"
                      style={{
                        background: item.match_percentage >= 70
                          ? '#4FACFE'
                          : item.match_percentage >= 50
                          ? '#A855F7'
                          : '#F472B6'
                      }} />
                    <div>
                      <p className="font-body text-white text-sm font-medium">
                        {item.predicted_role || 'Unknown role'}
                      </p>
                      <p className="text-white/30 font-body text-xs flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-lg"
                    style={{ color: item.match_percentage >= 70 ? '#4FACFE' : '#A855F7' }}>
                    {item.match_percentage}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
