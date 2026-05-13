@app.get("/")
def root():

    return {
        "message": "ResumeMatch AI Backend Running Successfully"
    }
from xml.sax.saxutils import escape
from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException
)

from fastapi.responses import FileResponse

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

import pdfplumber
import numpy as np
import os
import uuid
import re
import io
import logging

from typing import Optional

# ──────────────────────────────────────────────
# Setup
# ──────────────────────────────────────────────

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("resumematch")

# ──────────────────────────────────────────────
# Supabase
# ──────────────────────────────────────────────

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Optional[Client] = None

if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(
        SUPABASE_URL,
        SUPABASE_KEY
    )

# ──────────────────────────────────────────────
# AI Model
# ──────────────────────────────────────────────

MODEL = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# ──────────────────────────────────────────────
# FastAPI App
# ──────────────────────────────────────────────

app = FastAPI(
    title="ResumeMatch AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Technical + Non Technical Skills
# ──────────────────────────────────────────────

TECHNICAL_SKILLS = {

    # Programming
    "python", "java", "javascript",
    "react", "nodejs", "fastapi",
    "django", "sql", "mongodb",
    "docker", "kubernetes",
    "aws", "azure", "gcp",
    "tensorflow", "pytorch",
    "machine learning", "nlp",
    "html", "css","terraform",

    # Marketing
    "seo", "digital marketing",
    "content writing",
    "social media marketing",
    "branding",
    "copywriting",
    "market research",

    # HR
    "recruitment",
    "talent acquisition",
    "onboarding",
    "employee engagement",
    "payroll",

    # Finance
    "accounting",
    "financial analysis",
    "bookkeeping",
    "taxation",
    "auditing",
    "tally",
    "excel",

    # Design
    "figma",
    "canva",
    "photoshop",
    "illustrator",
    "graphic design",
    "ui/ux",

    # Healthcare
    "patient care",
    "clinical documentation",
    "medical coding",

    # Education
    "teaching",
    "curriculum development",
    "classroom management",
}

# ──────────────────────────────────────────────
# Soft Skills
# ──────────────────────────────────────────────

SOFT_SKILLS = {
    "communication",
    "leadership",
    "teamwork",
    "problem solving",
    "critical thinking",
    "creativity",
    "adaptability",
    "time management",
    "project management",
    "customer service",
    "negotiation",
    "presentation",
    "decision making",
    "public speaking",
    "active listening",
    "relationship building",
    "organizational skills",
}

# ──────────────────────────────────────────────
# Synonyms
# ──────────────────────────────────────────────

SYNONYMS = {
    "js": "javascript",
    "ml": "machine learning",
    "ai": "machine learning",
    "k8s": "kubernetes",
    "seo optimization": "seo",
}

# ──────────────────────────────────────────────
# Role Patterns
# ──────────────────────────────────────────────

ROLE_PATTERNS = {

    # IT
    "IT Support Technician": {
        "linux", "networking",
        "hardware", "customer service"
    },

    "Frontend Engineer": {
        "react", "html",
        "css", "javascript"
    },

    "Backend Engineer": {
        "python", "fastapi",
        "django", "sql"
    },

    "Full Stack Engineer": {
        "react", "nodejs",
        "python", "sql"
    },

    "DevOps Engineer": {
        "docker", "kubernetes",
        "aws", "linux"
    },

    "Cloud Engineer": {
        "aws", "azure",
        "gcp", "terraform"
    },

    "ML / AI Engineer": {
        "machine learning",
        "tensorflow",
        "pytorch",
        "nlp"
    },

    # Marketing
    "Marketing Intern": {
        "content writing",
        "branding"
    },

    "SEO Specialist": {
        "seo",
        "digital marketing"
    },

    "Marketing Manager": {
        "branding",
        "market research",
        "leadership"
    },

    # HR
    "HR Assistant": {
        "recruitment",
        "onboarding"
    },

    "HR Executive": {
        "talent acquisition",
        "employee engagement"
    },

    "HR Manager": {
        "leadership",
        "communication"
    },

    # Finance
    "Accountant": {
        "accounting",
        "taxation",
        "tally"
    },

    "Financial Analyst": {
        "financial analysis",
        "excel",
        "auditing"
    },

    "Finance Manager": {
        "leadership",
        "decision making"
    },

    # Design
    "Graphic Designer": {
        "photoshop",
        "illustrator",
        "canva"
    },

    "UI/UX Designer": {
        "figma",
        "ui/ux"
    },

    # Education
    "Teacher": {
        "teaching",
        "curriculum development"
    },

    "Professor": {
        "research",
        "presentation"
    },

    # Healthcare
    "Healthcare Assistant": {
        "patient care",
        "clinical documentation"
    },

    "Medical Coder": {
        "medical coding"
    }
}

# ──────────────────────────────────────────────
# Job Hierarchy
# ──────────────────────────────────────────────

JOB_ROLE_HIERARCHY = {

    "Information Technology": {
        "Entry Level": [
            "IT Support Technician"
        ],

        "Mid Level": [
            "Frontend Engineer",
            "Backend Engineer",
            "Full Stack Engineer"
        ],

        "Advanced": [
            "DevOps Engineer",
            "Cloud Engineer",
            "ML / AI Engineer"
        ]
    },

    "Marketing": {
        "Entry Level": [
            "Marketing Intern"
        ],

        "Mid Level": [
            "SEO Specialist"
        ],

        "Advanced": [
            "Marketing Manager"
        ]
    },

    "Human Resources": {
        "Entry Level": [
            "HR Assistant"
        ],

        "Mid Level": [
            "HR Executive"
        ],

        "Advanced": [
            "HR Manager"
        ]
    },

    "Finance": {
        "Entry Level": [
            "Accountant"
        ],

        "Mid Level": [
            "Financial Analyst"
        ],

        "Advanced": [
            "Finance Manager"
        ]
    },

    "Design": {
        "Entry Level": [
            "Graphic Designer"
        ],

        "Mid Level": [
            "UI/UX Designer"
        ]
    },

    "Education": {
        "Entry Level": [
            "Teacher"
        ],

        "Advanced": [
            "Professor"
        ]
    },

    "Healthcare": {
        "Entry Level": [
            "Healthcare Assistant"
        ],

        "Mid Level": [
            "Medical Coder"
        ]
    }
}

# ──────────────────────────────────────────────
# Helper Functions
# ──────────────────────────────────────────────


def extract_text_from_pdf(file_bytes: bytes) -> str:

    text_parts = []

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:

        for page in pdf.pages:

            text = page.extract_text()

            if text:
                text_parts.append(text)

    return "\n".join(text_parts)


def normalize_text(text: str) -> str:

    text = text.lower()

    text = re.sub(
        r"[^\w\s+#./]",
        " ",
        text
    )

    text = re.sub(r"\s+", " ", text)

    return text.strip()


def apply_synonyms(text: str) -> str:

    for synonym, canonical in SYNONYMS.items():

        text = re.sub(
            rf"\b{re.escape(synonym)}\b",
            canonical,
            text
        )

    return text


def extract_skills(text: str, skill_set: set):

    normalized = apply_synonyms(
        normalize_text(text)
    )

    found = []

    for skill in skill_set:

        pattern = rf"\b{re.escape(skill)}\b"

        if re.search(pattern, normalized):
            found.append(skill)

    return sorted(set(found))


def compute_tfidf_similarity(text1: str, text2: str):

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2)
    )

    tfidf_matrix = vectorizer.fit_transform([
        text1,
        text2
    ])

    score = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )[0][0]

    return float(score)


def compute_semantic_similarity(text1: str, text2: str):

    emb1, emb2 = MODEL.encode([
        text1,
        text2
    ])

    dot = np.dot(emb1, emb2)

    norm = (
        np.linalg.norm(emb1)
        * np.linalg.norm(emb2)
    )

    return float(dot / norm)


def predict_role(matching_skills):

    skill_set = set(matching_skills)

    best_role = "General Candidate"
    best_overlap = 0

    for role, role_skills in ROLE_PATTERNS.items():

        overlap = len(
            skill_set & role_skills
        )

        if overlap > best_overlap:

            best_overlap = overlap
            best_role = role

    return best_role


def predict_domain_and_level(predicted_role):

    for domain, levels in JOB_ROLE_HIERARCHY.items():

        for level, roles in levels.items():

            if predicted_role in roles:

                return {
                    "domain": domain,
                    "career_level": level
                }

    return {
        "domain": "General",
        "career_level": "Unknown"
    }


def compute_match_percentage(
    tech_score,
    soft_score,
    tfidf_score,
    semantic_score
):

    weighted = (
        semantic_score * 0.25
        + tfidf_score * 0.35
        + tech_score * 0.30
        + soft_score * 0.10
    )

    adjusted_score = (weighted * 100) + 25

    return min(
        100,
        max(0, round(adjusted_score))
    )
# ──────────────────────────────────────────────
# Health Route
# ──────────────────────────────────────────────

@app.get("/health")
def health():

    return {
        "status": "ok"
    }

# ──────────────────────────────────────────────
# Main Analyze Route
# ──────────────────────────────────────────────

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    user_email: str = Form(...)
):

    pdf_bytes = await resume.read()

    resume_text = extract_text_from_pdf(
        pdf_bytes
    )

    if not job_description.strip():

        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty"
        )

    if not resume_text.strip():

        raise HTTPException(
            status_code=400,
            detail="Resume extraction failed"
        )

    resume_tech = extract_skills(
        resume_text,
        TECHNICAL_SKILLS
    )

    jd_tech = extract_skills(
        job_description,
        TECHNICAL_SKILLS
    )

    resume_soft = extract_skills(
        resume_text,
        SOFT_SKILLS
    )

    jd_soft = extract_skills(
        job_description,
        SOFT_SKILLS
    )

    matching_tech = sorted(
        set(resume_tech) & set(jd_tech)
    )

    missing_tech = sorted(
        set(jd_tech) - set(resume_tech)
    )

    matching_soft = sorted(
        set(resume_soft) & set(jd_soft)
    )

    missing_soft = sorted(
        set(jd_soft) - set(resume_soft)
    )

    matching_skills = sorted(
        set(matching_tech + matching_soft)
    )

    missing_skills = sorted(
        set(missing_tech + missing_soft)
    )

    tech_score = len(matching_tech) / max(len(jd_tech), 1)

    soft_score = len(matching_soft) / max(len(jd_soft), 1)

    tfidf_score = compute_tfidf_similarity(
        resume_text,
        job_description
    )

    semantic_score = compute_semantic_similarity(
        resume_text,
        job_description
    )

    match_percentage = compute_match_percentage(
        tech_score,
        soft_score,
        tfidf_score,
        semantic_score
    )

    predicted_role = predict_role(
        matching_skills
    )

    career_info = predict_domain_and_level(
        predicted_role
    )

    result = {
        "match_percentage": match_percentage,
        "domain": career_info["domain"],
        "career_level": career_info["career_level"],
        "predicted_role": predicted_role,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "technical_score": round(tech_score * 100),
        "soft_score": round(soft_score * 100),
        "semantic_score": round(semantic_score, 4),
        "tfidf_score": round(tfidf_score, 4),
    }

    return result