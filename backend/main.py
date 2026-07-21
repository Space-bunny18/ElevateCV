from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from rewrite import generate_rewrite
import shutil
import os

from parser import extract_text
from skills import detect_skills, get_missing_skills
from ats import calculate_ats
from analyzer import detect_sections, analyze_resume

app = FastAPI(title="ElevateCV API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "../uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "Welcome to ElevateCV API 🚀",
        "status": "Running"
    }


@app.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    role: str = Form(...)
):

    # Save uploaded PDF
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    text = extract_text(file_path)

    # Detect skills
    skills = detect_skills(text)

    # Missing skills
    missing_skills = get_missing_skills(skills, role)

    # ATS Score
    score, suggestions, breakdown = calculate_ats(text, skills)

    # Detect Sections
    sections = detect_sections(text)

    # Smart AI Analysis
    strengths, weaknesses, recommendations, verdict, summary = analyze_resume(
        text,
        skills,
        sections,
        role
    )
    # AI Rewrite Suggestions
    rewrite = generate_rewrite(
        role,
        sections,
        skills
    )
    # Return response
    return {
        "success": True,
        "filename": file.filename,
        "role": role,
        "score": score,
        "breakdown": breakdown,
        "skills": skills,
        "missingSkills": missing_skills,
        "sections": sections,
        "suggestions": suggestions,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
        "verdict": verdict,
        "summary": summary,
        "rewrite": rewrite,

    }