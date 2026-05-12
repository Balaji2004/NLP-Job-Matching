// src/pages/History.jsx
// Shows all past resume analyses for the logged-in user

import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { fetchHistory } from '../utils/api'
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'
import SkillTag from '../components/SkillTag'
import { Link } from 'react-router-dom'
import { Clock, FileSearch, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

// Single expandable history item
function HistoryItem({ item }) {
  const [expanded, setExpanded] = useState(false)

  const scoreColor = item.match_percentage >= 70
    ? '#4FACFE'
    : item.match_percentage >= 50
    ? '#A855F7'
    : '#F472B6'

  return (
    <div className="card transition-all duration-300">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left">
        <div className="flex items-center gap-4">
          {/* Score bubble */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
            style={{ background: `${scoreColor}22`, border: `1px solid ${scoreColor}44`, color: scoreColor }}>
            {item.match_percentage}%
          </div>
          <div>
            <p className="font-display font-semibold text-white">{item.predicted_role || 'Unknown role'}</p>
            <p className="text-white/30 font-body text-xs flex items-center gap-1 mt-0.5">
              <Clock size={10} />
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1.5">
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
              Tech {item.technical_score}%
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-neon-purple/10 text-purple-400 border border-purple-400/20">
              Soft {item.soft_score}%
            </span>
          </div>
          {expanded ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-4 page-enter">
          {/* Skills */}
          {item.matching_skills?.length > 0 && (
            <div>
              <p className="text-white/40 font-body text-xs uppercase tracking-wider mb-2">Matching Skills</p>
              <div className="flex flex-wrap gap-2">
                {item.matching_skills.map((s) => <SkillTag key={s} label={s} variant="match" />)}
              </div>
            </div>
          )}
          {item.missing_skills?.length > 0 && (
            <div>
              <p className="text-white/40 font-body text-xs uppercase tracking-wider mb-2">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {item.missing_skills.map((s) => <SkillTag key={s} label={s} variant="missing" />)}
              </div>
            </div>
          )}
          {/* Suggestions */}
          {item.suggestions?.length > 0 && (
            <div>
              <p className="text-white/40 font-body text-xs uppercase tracking-wider mb-2">Suggestions</p>
              <ul className="space-y-1.5">
                {item.suggestions.map((s, i) => (
                  <li key={i} className="text-white/50 font-body text-sm flex gap-2">
                    <span className="text-yellow-400/60">›</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Job description excerpt */}
          {item.job_description && (
            <div>
              <p className="text-white/40 font-body text-xs uppercase tracking-wider mb-2">Job Description (excerpt)</p>
              <p className="text-white/30 font-body text-xs leading-relaxed line-clamp-3">
                {item.job_description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function History() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!user?.email) return
    fetchHistory(user.email)
      .then(setHistory)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className="min-h-screen gradient-bg">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-16 page-enter">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Analysis History</h1>
            <p className="text-white/40 font-body mt-1">
              {history.length} {history.length === 1 ? 'analysis' : 'analyses'} on record
            </p>
          </div>
          <Link to="/analyze" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
            New analysis <ArrowRight size={14} />
          </Link>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 font-body text-sm">
            Failed to load history: {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shimmer h-20 rounded-2xl" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="card text-center py-16">
            <FileSearch size={36} className="text-white/15 mx-auto mb-4" />
            <p className="font-display font-semibold text-white/40">No analyses yet</p>
            <p className="text-white/25 font-body text-sm mt-1 mb-6">
              Run your first resume analysis to see results here.
            </p>
            <Link to="/analyze" className="btn-primary inline-flex items-center gap-2 py-2.5 px-6 text-sm">
              Analyze a resume <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
