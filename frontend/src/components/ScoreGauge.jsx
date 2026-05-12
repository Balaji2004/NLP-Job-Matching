// src/components/ScoreGauge.jsx
// Animated circular score ring — displays the ATS match percentage

import { useEffect, useState } from 'react'

// Maps a score to a color gradient stop
function scoreColor(score) {
  if (score >= 80) return { from: '#4FACFE', to: '#00F5FF' }
  if (score >= 60) return { from: '#A855F7', to: '#4FACFE' }
  if (score >= 40) return { from: '#F59E0B', to: '#EF4444' }
  return { from: '#EF4444', to: '#F472B6' }
}

function scoreLabel(score) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

export default function ScoreGauge({ score = 0, size = 160 }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  // Animate from 0 to score on mount
  useEffect(() => {
    const duration = 1200
    const startTime = performance.now()
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
      setAnimatedScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [score])

  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference
  const { from, to } = scoreColor(score)
  const gradId = `gauge-grad-${score}`

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10}
          />
          {/* Animated foreground */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-white"
            style={{ fontSize: size * 0.22 }}>
            {animatedScore}%
          </span>
        </div>
      </div>

      <span className="text-xs font-body font-medium uppercase tracking-widest"
        style={{ color: from }}>
        {scoreLabel(score)}
      </span>
    </div>
  )
}
