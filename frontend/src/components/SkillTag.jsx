// src/components/SkillTag.jsx
// Renders a single skill chip in matching/missing/neutral variant

const VARIANTS = {
  match: {
    bg: 'bg-neon-blue/10',
    border: 'border-neon-blue/30',
    text: 'text-neon-blue',
    dot: 'bg-neon-blue',
  },
  missing: {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    dot: 'bg-pink-400',
  },
  neutral: {
    bg: 'bg-white/[0.04]',
    border: 'border-white/[0.08]',
    text: 'text-white/60',
    dot: 'bg-white/30',
  },
}

export default function SkillTag({ label, variant = 'neutral' }) {
  const v = VARIANTS[variant] || VARIANTS.neutral
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium
      ${v.bg} ${v.border} ${v.text} transition-all duration-200 hover:scale-105`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
      {label}
    </span>
  )
}
