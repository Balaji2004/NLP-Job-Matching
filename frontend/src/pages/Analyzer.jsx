// src/pages/Analyzer.jsx
// Core feature page: upload resume PDF + paste job description → AI analysis
import { supabase }from '../utils/supabase'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useAuth } from '../hooks/useAuth'
import { analyzeResume } from '../utils/api'
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'
import AnalysisResultCard from '../components/AnalysisResultCard'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { Upload, FileText, X, ArrowRight, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Analyzer() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [resumeFile, setResumeFile]   = useState(null)
  const [jobDesc, setJobDesc]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [result, setResult]           = useState(null)
  useEffect(() => {

  const saved =
    localStorage.getItem(
  `resume-analysis-${user.email}`
)

  if (saved) {

    const parsed =
      JSON.parse(saved);

    setResult(parsed);
  }

}, []);
  const [error, setError]             = useState('')

  // ── Dropzone setup ──
  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Only PDF files are supported.')
      return
    }
    if (accepted.length > 0) {
      setResumeFile(accepted[0])
      setError('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
  })

  const handleSubmit = async () => {
    if (!resumeFile)  { setError('Please upload your resume PDF.'); return }
    if (!jobDesc.trim()) { setError('Please paste the job description.'); return }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await analyzeResume(resumeFile, jobDesc, user.email)
      setResult(data)
      const { data: insertedData, error: insertError } =
  await supabase
    .from('resume_history')
    .insert([
      {
        email: user.email,

        match_percentage:
          data.match_percentage,

        matching_skills:
          data.matching_skills || [],

        missing_skills:
          data.missing_skills || [],

        predicted_role:
          data.predicted_role,

        technical_score:
          data.technical_score,

        soft_score:
          data.soft_score,

        suggestions:
          data.suggestions || [],

        job_description:
          jobDesc,
      },
    ])
    .select()

console.log(
  "Inserted:",
  insertedData
)

console.log(
  "Insert Error:",
  insertError
)
if (!insertError) {


}
      localStorage.setItem(
  `resume-analysis-${user.email}`,
  JSON.stringify(data)
)
      toast.success('Analysis complete!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'Analysis failed. Is the backend running?')
      toast.error('Analysis failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    localStorage.removeItem(
  `resume-analysis-${user.email}`
)
    setResumeFile(null)
    setJobDesc('')
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen gradient-bg">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-16 page-enter">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Resume Analyzer</h1>
            <p className="text-white/40 font-body mt-1">Semantic AI ATS matching in seconds</p>
          </div>
          {result && (
            <button onClick={handleReset}
              className="btn-glass flex items-center gap-2 text-sm py-2 px-4">
              <RotateCcw size={14} /> New analysis
            </button>
          )}
        </div>

        {/* ── Result view ── */}
        {result && !loading && (

  <div className="space-y-4">

    <AnalysisResultCard
      result={result}
    />

    <button
      onClick={() =>
        navigate('/resume-editor')
      }
      className="btn-primary w-full py-4"
    >
      Edit Resume
    </button>

  </div>
)}
        

        {/* ── Loading ── */}
        {loading && <LoadingSpinner message="Analyzing your resume…" />}

        {/* ── Input form (hidden when result shown) ── */}
        {!result && !loading && (
          <div className="space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 font-body text-sm">
                {error}
              </div>
            )}

            {/* PDF dropzone */}
            <div>
              <label className="block text-white/50 font-body text-xs uppercase tracking-wider mb-3">
                Resume PDF
              </label>

              {resumeFile ? (
                <div className="card flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: '#4FACFE22', border: '1px solid #4FACFE33' }}>
                      <FileText size={18} style={{ color: '#4FACFE' }} />
                    </div>
                    <div>
                      <p className="font-body text-white text-sm font-medium">{resumeFile.name}</p>
                      <p className="text-white/30 font-body text-xs">
                        {(resumeFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setResumeFile(null)}
                    className="text-white/30 hover:text-white/70 transition-colors p-2">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div {...getRootProps()}
                  className={`card cursor-pointer transition-all duration-300 p-10 text-center
                    border-2 border-dashed
                    ${isDragActive
                      ? 'border-neon-blue/60 bg-neon-blue/5'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}>
                  <input {...getInputProps()} />
                  <Upload size={28} className="mx-auto mb-3 text-white/30" />
                  <p className="font-body text-white/60 text-sm">
                    {isDragActive
                      ? 'Drop your PDF here…'
                      : 'Drag & drop your resume PDF, or click to browse'}
                  </p>
                  <p className="text-white/25 font-body text-xs mt-1">PDF only · Max 10 MB</p>
                </div>
              )}
            </div>

            {/* Job description textarea */}
            <div>
              <label className="block text-white/50 font-body text-xs uppercase tracking-wider mb-3">
                Job Description
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the full job description here…"
                rows={10}
                className="input-glass resize-none font-body leading-relaxed"
              />
              <p className="text-white/20 font-body text-xs mt-1.5">
                {jobDesc.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!resumeFile || !jobDesc.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed">
              Run AI Analysis
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
