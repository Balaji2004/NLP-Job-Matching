// src/pages/Landing.jsx
// Public hero page — showcases features, CTA to signup

import { Link } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'
import { Zap, Brain, Target, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'Semantic AI Matching',
    desc: 'Uses sentence-transformers and cosine similarity — not just keyword counting.',
    color: '#4FACFE',
  },
  {
    icon: Target,
    title: 'Skill Gap Analysis',
    desc: 'Identifies exactly which skills are missing so you can close the gap before applying.',
    color: '#A855F7',
  },
  {
    icon: TrendingUp,
    title: 'Score Breakdown',
    desc: 'Separate technical, soft-skill, and semantic scores so you know what to improve.',
    color: '#00F5FF',
  },
]

const POINTS = [
  'PDF resume parsing',
  'TF-IDF + semantic embeddings',
  'Predicted role detection',
  'History tracking',
  'Improvement suggestions',
]

export default function Landing() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <AnimatedBackground />

      {/* ── Nav ── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4FACFE, #A855F7)' }}>
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-lg neon-text">ResumeMatch</span>
          <span className="text-white/30 font-display font-light text-lg">AI</span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login"  className="btn-glass text-sm py-2 px-5">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm py-2 px-5">Get started</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-mono text-white/50 mb-8 border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
          Semantic AI · TF-IDF · Sentence Transformers
        </div>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white leading-tight mb-6">
          Know your ATS score{' '}
          <span className="neon-text">before</span>
          <br />you apply
        </h1>

        <p className="text-white/50 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your resume and a job description. Our AI tells you your match percentage,
          missing skills, and exactly what to fix — in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/signup"
            className="btn-primary flex items-center gap-2 text-base py-3.5 px-8 animate-glow-pulse">
            Analyze my resume
            <ArrowRight size={18} />
          </Link>
          <Link to="/login"
            className="btn-glass flex items-center gap-2 text-base py-3.5 px-8 text-white/60 hover:text-white">
            Sign in
          </Link>
        </div>

        {/* Checklist */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-24">
          {POINTS.map((p) => (
            <span key={p} className="flex items-center gap-1.5 text-white/40 font-body text-sm">
              <CheckCircle size={13} className="text-neon-blue" />
              {p}
            </span>
          ))}
        </div>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card-hover p-6 group animate-float"
              style={{ animationDelay: `${Math.random() * 2}s` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}22`, border: `1px solid ${color}33` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
              <p className="text-white/40 font-body text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-6 text-center">
        <p className="text-white/20 font-body text-xs">
          © 2025 ResumeMatch AI — Built with FastAPI, React, Supabase &amp; Sentence Transformers
        </p>
      </footer>
    </div>
  )
}
