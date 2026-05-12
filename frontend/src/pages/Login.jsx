// src/pages/Login.jsx
// Email/password login via Supabase

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AnimatedBackground from '../components/AnimatedBackground'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      await signIn(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative">
      <AnimatedBackground />

      <div className="w-full max-w-md relative z-10 page-enter">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4FACFE, #A855F7)' }}>
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-xl neon-text">ResumeMatch AI</span>
        </div>

        <div className="card neon-border p-8">
          <h1 className="font-display font-bold text-2xl text-white mb-1">Welcome back</h1>
          <p className="text-white/40 font-body text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 font-body text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-white/50 font-body text-xs uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com"
                  className="input-glass pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-white/50 font-body text-xs uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password" name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••"
                  className="input-glass pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2 disabled:opacity-50">
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 font-body text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-neon-blue hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
