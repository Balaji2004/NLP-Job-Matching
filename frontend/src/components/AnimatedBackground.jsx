// src/components/AnimatedBackground.jsx
// Renders the floating blob + grid pattern background used across all pages

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden gradient-bg grid-pattern">
      {/* Primary blue blob */}
      <div className="blob w-96 h-96 top-[-10%] left-[-5%]"
        style={{ background: '#4FACFE', animationDelay: '0s' }} />

      {/* Purple blob */}
      <div className="blob w-80 h-80 bottom-[-10%] right-[-5%]"
        style={{ background: '#A855F7', animationDelay: '-3s' }} />

      {/* Cyan accent */}
      <div className="blob w-64 h-64 top-[40%] right-[20%]"
        style={{ background: '#00F5FF', animationDelay: '-6s', opacity: 0.08 }} />

      {/* Pink accent */}
      <div className="blob w-48 h-48 bottom-[20%] left-[25%]"
        style={{ background: '#F472B6', animationDelay: '-2s', opacity: 0.07 }} />
    </div>
  )
}
