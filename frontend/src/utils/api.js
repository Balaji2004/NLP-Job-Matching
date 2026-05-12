// src/utils/api.js
// All calls to the FastAPI backend go through here.
// Requires VITE_API_URL in your .env file.
// Local dev:  VITE_API_URL=http://localhost:8000
// Production: VITE_API_URL=https://your-backend.onrender.com
import { supabase }from './supabase'
const API_BASE = import.meta.env.VITE_API_URL

if (!API_BASE) {
  throw new Error(
    '[ResumeMatch] VITE_API_URL is not set.\n' +
    'Copy frontend/.env.example → frontend/.env and set VITE_API_URL=http://localhost:8000'
  )
}

/**
 * Analyze a resume PDF against a job description.
 * @param {File} resumeFile  - The PDF file object
 * @param {string} jobDesc   - Raw job description text
 * @param {string} userEmail - Logged-in user's email (for DB history)
 * @returns {Promise<object>} - Analysis result JSON
 */
export async function analyzeResume(resumeFile, jobDesc, userEmail) {
  const formData = new FormData()
  formData.append('resume', resumeFile)
  formData.append('job_description', jobDesc)
  formData.append('user_email', userEmail)

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `Server error ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch resume analysis history for a user.
 * @param {string} userEmail
 * @returns {Promise<Array>}
 */
export async function fetchHistory(
  email
) {

  const { data, error } =
    await supabase
      .from("resume_history")
      .select("*")
      .eq("email", email)
      .order("created_at", {
        ascending: false,
      });

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}

/**
 * Health check — confirms backend is alive.
 */
export async function healthCheck() {
  const response = await fetch(`${API_BASE}/health`)
  return response.ok
}
