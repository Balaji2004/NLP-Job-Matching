# ResumeMatch AI 🚀

AI-powered ATS resume matching platform. Upload a PDF resume, paste a job description, get a semantic match score, skill gap analysis, and improvement suggestions.

---

## Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router DOM |
| Backend    | FastAPI, sentence-transformers, scikit-learn, pdfplumber |
| Auth + DB  | Supabase (email/password auth + PostgreSQL) |
| Deploy     | Vercel (frontend) · Render (backend) |

---

## Project Structure

```
resumematch/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AnimatedBackground.jsx
│   │   │   ├── ScoreGauge.jsx
│   │   │   ├── ScoreBar.jsx
│   │   │   ├── SkillTag.jsx
│   │   │   ├── AnalysisResultCard.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Analyzer.jsx
│   │   │   └── History.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   ├── supabase.js
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   └── .env.example
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── render_start.sh
│   └── .env.example
├── supabase_schema.sql
├── .gitignore
└── README.md
```

---

## Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the dashboard: **SQL Editor → New Query**, paste the contents of `supabase_schema.sql` and run it.
3. Get your credentials from **Settings → API**:
   - **Project URL** → `VITE_SUPABASE_URL` / `SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (keep this secret — backend only)
4. In **Authentication → Email**, make sure email/password auth is enabled.

---

## Step 2 — Backend Setup (local)

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies (sentence-transformers will download the model on first run)
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env: fill in SUPABASE_URL and SUPABASE_SERVICE_KEY

# Start the backend
uvicorn main:app --reload --port 8000
```

> **⚠️ RAM Warning**: `sentence-transformers` with `all-MiniLM-L6-v2` requires ~500 MB RAM.
> Render's **free tier only has 512 MB** and will OOM. Use the **Starter plan ($7/mo)** or higher.

The API will be at `http://localhost:8000`. Test it: `curl http://localhost:8000/health`

---

## Step 3 — Frontend Setup (local)

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env:
#   VITE_SUPABASE_URL=https://your-project.supabase.co
#   VITE_SUPABASE_ANON_KEY=your-anon-key
#   VITE_API_URL=http://localhost:8000

# Start the dev server
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to GitHub.
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo.
3. Set **Root Directory** to `frontend`.
4. Add environment variables in Vercel project settings:
   ```
   VITE_SUPABASE_URL      = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key
   VITE_API_URL           = https://your-backend.onrender.com
   ```
5. Deploy. Done.

### Backend → Render

1. Push the `backend/` folder to GitHub.
2. Go to [render.com](https://render.com) → New → Web Service.
3. Connect your repo. Set:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Starter ($7/mo)** — required for the ML model's RAM
4. Add environment variables:
   ```
   SUPABASE_URL        = https://your-project.supabase.co
   SUPABASE_SERVICE_KEY = your-service-role-key
   ALLOWED_ORIGINS     = https://your-app.vercel.app
   ```
5. Deploy. First deploy will be slow (model download). Subsequent cold starts ~30s.

---

## How the AI Matching Works

1. **PDF Parsing**: `pdfplumber` extracts raw text from the uploaded PDF.
2. **Skill Extraction**: Regex matches against 80+ technical and 20+ soft skill patterns, with synonym normalization (e.g. "js" → "javascript").
3. **TF-IDF Score**: `sklearn` TF-IDF vectorizer computes keyword-level cosine similarity between resume and JD.
4. **Semantic Score**: `sentence-transformers` (`all-MiniLM-L6-v2`) encodes both texts as embeddings, then computes cosine similarity — catches meaning even when exact words differ.
5. **Composite Score**: `40% semantic + 30% TF-IDF + 20% technical skills + 10% soft skills`
6. **Role Prediction**: Matches extracted skills against predefined role→skill-set mappings.
7. **Suggestions**: Generated based on missing skills, low scores, and terminology gaps.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET  | `/health` | Health check |
| POST | `/analyze` | Analyze resume (multipart/form-data: `resume`, `job_description`, `user_email`) |
| GET  | `/history/{email}` | Get analysis history for a user |

---

## Common Issues

| Problem | Fix |
|---------|-----|
| Backend OOM on Render | Upgrade to Starter plan ($7/mo) |
| "No text extracted from PDF" | The PDF is image-based (scanned). Use a text-based PDF. |
| CORS errors | Add your Vercel URL to `ALLOWED_ORIGINS` in backend `.env` |
| Supabase auth not working | Check that email auth is enabled in Supabase dashboard |
| Model download timeout | First run downloads ~90MB. Run locally first to cache. |

---

## License
This project is created for educational, portfolio, and learning purposes.

---

## ⭐ Support

If you like this project, consider giving it a star on GitHub.

