// src/components/AnalysisResultCard.jsx
// Full result card shown after a successful ATS analysis

import ScoreGauge from './ScoreGauge'
import ScoreBar from './ScoreBar'
import SkillTag from './SkillTag'
import { CheckCircle, XCircle, Lightbulb, User, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function AnalysisResultCard({ result }) {
  const [showSuggestions, setShowSuggestions] = useState(true)

  const {
    match_percentage = 0,
    technical_score = 0,
    soft_score = 0,
    predicted_role = 'Unknown',
    matching_skills = [],
    missing_skills = [],
    suggestions = [],
    semantic_score = 0,
    tfidf_score = 0,
  } = result

  return (
    <div className="page-enter space-y-6">
      {/* ── Top row: Overall score + predicted role ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ATS Score Gauge */}
        <div className="card flex flex-col items-center gap-4 col-span-1">
          <h3 className="font-display font-semibold text-white/70 text-sm uppercase tracking-wider">
            ATS Match Score
          </h3>
          <ScoreGauge score={match_percentage} size={160} />
        </div>

        {/* Sub-scores */}
        <div className="card col-span-2 flex flex-col gap-6 justify-center">
          <h3 className="font-display font-semibold text-white/70 text-sm uppercase tracking-wider">
            Score Breakdown
          </h3>
          <ScoreBar label="Technical Skills" score={technical_score} colorFrom="#4FACFE" colorTo="#00F5FF" />
          <ScoreBar label="Soft Skills"       score={soft_score}      colorFrom="#A855F7" colorTo="#F472B6" />
          <ScoreBar label="Semantic Match"    score={Math.round(semantic_score * 100)} colorFrom="#F59E0B" colorTo="#EF4444" />
          <ScoreBar label="Keyword Match"     score={Math.round(tfidf_score * 100)}   colorFrom="#10B981" colorTo="#4FACFE" />
        </div>
      </div>

      {/* ── Predicted role ── */}
      <div className="card flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #4FACFE22, #A855F722)' }}>
          <User size={18} style={{ color: '#4FACFE' }} />
        </div>
        <div>
          <p className="text-white/40 font-body text-xs uppercase tracking-wider">Predicted Role</p>
          <p className="font-display font-semibold text-white">{predicted_role}</p>
        </div>
      </div>

      {/* ── Matching & Missing Skills ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matching */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-neon-blue" />
            <h3 className="font-display font-semibold text-white text-sm">
              Matching Skills
              <span className="ml-2 text-neon-blue font-mono">({matching_skills.length})</span>
            </h3>
          </div>
          {matching_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matching_skills.map((skill) => (
                <SkillTag key={skill} label={skill} variant="match" />
              ))}
            </div>
          ) : (
            <p className="text-white/30 font-body text-sm">No matching skills detected.</p>
          )}
        </div>

        {/* Missing */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={16} className="text-pink-400" />
            <h3 className="font-display font-semibold text-white text-sm">
              Missing Skills
              <span className="ml-2 text-pink-400 font-mono">({missing_skills.length})</span>
            </h3>
          </div>
          {missing_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missing_skills.map((skill) => (
                <SkillTag key={skill} label={skill} variant="missing" />
              ))}
            </div>
          ) : (
            <p className="text-white/30 font-body text-sm">No missing skills — great coverage!</p>
          )}
        </div>
      </div>

      {/* ── Suggestions ── */}
      {suggestions.length > 0 && (
        <div className="card">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-yellow-400" />
              <h3 className="font-display font-semibold text-white text-sm">
                Improvement Suggestions
              </h3>
            </div>
            {showSuggestions ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
          </button>

          {showSuggestions && (
            <ul className="space-y-3">
              {suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-3 text-sm font-body text-white/70">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono"
                    style={{ background: 'linear-gradient(135deg, #F59E0B33, #EF444433)', color: '#F59E0B' }}>
                    {i + 1}
                  </span>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
