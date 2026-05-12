// src/App.jsx
// Root component — sets up routing and auth context
import ResumeEditor from './pages/ResumeEditor'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'

// Pages
import Landing   from './pages/Landing'
import Login     from './pages/Login'
import Signup    from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Analyzer  from './pages/Analyzer'
import History   from './pages/History'

// ─── Protected route wrapper ─────────────────────────
// Redirects unauthenticated users to /login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-neon-blue/30 border-t-neon-blue animate-spin" />
          <p className="text-white/40 font-body text-sm">Authenticating…</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

// ─── Public route wrapper ────────────────────────────
// Redirects already-logged-in users away from auth pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Toast notifications — top-right, dark themed */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0F0F1A',
              color: '#E2E8F0',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#4FACFE', secondary: '#0F0F1A' } },
            error:   { iconTheme: { primary: '#F472B6', secondary: '#0F0F1A' } },
          }}
        />

        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login"  element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Protected pages */}
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analyze"   element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
          <Route path="/history"   element={<ProtectedRoute><History /></ProtectedRoute>} />
         <Route path="/resume-editor"element={<ProtectedRoute><ResumeEditor /></ProtectedRoute>
  }
/>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
