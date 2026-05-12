// src/pages/Signup.jsx
// New account creation via Supabase

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AnimatedBackground from '../components/AnimatedBackground'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]     = useState({ email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)  // email confirmation sent

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await signUp(form.email, form.password)
      setDone(true)
      toast.success('Account created! Check your email to confirm.')
    } catch (err) {
      setError(err.message || 'Signup failed. Try a different email.')
    } finally {
      setLoading(false)
    }
  }

  // ── Post-signup confirmation screen ──
  if (done) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <AnimatedBackground />
        <div className="card neon-border p-10 max-w-md w-full text-center page-enter">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #4FACFE22, #A855F722)', border: '1px solid #4FACFE44' }}>
            <CheckCircle size={28} className="text-neon-blue" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Check your email</h2>
          <p className="text-white/40 font-body text-sm mb-6">
            We sent a confirmation link to <span className="text-white/70">{form.email}</span>.
            Click it to activate your account.
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2 py-3 px-6">
            Go to login <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative">
      <AnimatedBackground />

      <div className="w-full max-w-md relative z-10 page-enter">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4FACFE, #A855F7)' }}>
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-xl neon-text">ResumeMatch AI</span>
        </div>

        <div className="card neon-border p-8">
          <h1 className="font-display font-bold text-2xl text-white mb-1">Create account</h1>
          <p className="text-white/40 font-body text-sm mb-8">Free to start — no credit card required</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 font-body text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-white/50 font-body text-xs uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com"
                  className="input-glass pl-10" disabled={loading} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/50 font-body text-xs uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="password" name="password" value={form.password}
                  onChange={handleChange} placeholder="Min. 6 characters"
                  className="input-glass pl-10" disabled={loading} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/50 font-body text-xs uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="password" name="confirm" value={form.confirm}
                  onChange={handleChange} placeholder="Repeat password"
                  className="input-glass pl-10" disabled={loading} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2 disabled:opacity-50">
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating account…</>
              ) : (
                <>Create account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 font-body text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-blue hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
