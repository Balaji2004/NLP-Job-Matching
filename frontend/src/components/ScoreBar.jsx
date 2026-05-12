// src/components/ScoreBar.jsx
// Animated horizontal score bar for technical/soft skill scores

import { useEffect, useState } from 'react'

export default function ScoreBar({ label, score = 0, colorFrom = '#4FACFE', colorTo = '#A855F7' }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Delay slightly to allow CSS transition to animate
    const timer = setTimeout(() => setWidth(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-white/60 font-body text-sm">{label}</span>
        <span className="font-display font-semibold text-white text-sm">{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full score-bar-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
            boxShadow: `0 0 8px ${colorFrom}60`,
          }}
        />
      </div>
    </div>
  )
}
