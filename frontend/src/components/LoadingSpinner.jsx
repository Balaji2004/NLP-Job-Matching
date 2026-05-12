// src/components/LoadingSpinner.jsx
// Full-screen or inline loading state with scan-line animation

export default function LoadingSpinner({ message = 'Analyzing resume…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Outer pulsing ring */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-neon-blue/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-neon-purple/30 animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full"
            style={{ background: 'linear-gradient(135deg, #4FACFE, #A855F7)' }} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="font-display font-semibold text-white">{message}</p>
        <p className="text-white/30 font-body text-sm">Running semantic AI analysis…</p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-neon-blue/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}
