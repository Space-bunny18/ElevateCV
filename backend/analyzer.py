def detect_sections(text):

    text = text.lower()

    section_keywords = {

    "contact": [
        "@",
        "email",
        "phone",
        "mobile",
        "linkedin",
        "github"
    ],

    "summary": [
        "summary",
        "objective",
        "profile",
        "about me",
        "professional summary"
    ],

    "education": [
        "education",
        "university",
        "college",
        "bachelor",
        "master",
        "b.tech",
        "btech",
        "degree"
    ],

    "experience": [
        "experience",
        "internship",
        "intern",
        "employment",
        "work experience"
    ],

    "projects": [
        "project",
        "projects",
        "academic project",
        "personal project"
    ],

    "skills": [
        "skills",
        "technical skills",
        "technologies",
        "programming languages"
    ],

    "certifications": [
        "certification",
        "certificate",
        "certificates",
        "certifications"
    ]

}

    detected = {}

    for section, keywords in section_keywords.items():

        detected[section] = any(keyword in text for keyword in keywords)

    return detected

def analyze_resume(text, skills, sections, role):

    strengths = []
    weaknesses = []
    recommendations = []

    # ==========================================
    # STRENGTHS
    # ==========================================

    if len(skills) >= 8:
        strengths.append(
            "Strong technical skill set detected."
        )

    if sections.get("contact"):
        strengths.append(
            "Contact information is present."
        )

    if sections.get("education"):
        strengths.append(
            "Education section is included."
        )

    if sections.get("projects"):
        strengths.append(
            "Projects section is available."
        )

    if sections.get("experience"):
        strengths.append(
            "Work experience section is included."
        )

    if sections.get("summary"):
        strengths.append(
            "Professional summary found."
        )

    # ==========================================
    # WEAKNESSES
    # ==========================================

    if len(skills) < 5:
        weaknesses.append(
            "Very few technical skills were detected."
        )

    if not sections.get("projects"):
        weaknesses.append(
            "Projects section is missing."
        )

    if not sections.get("experience"):
        weaknesses.append(
            "Work experience is missing."
        )

    if not sections.get("summary"):
        weaknesses.append(
            "Professional summary is missing."
        )

    if not sections.get("certifications"):
        weaknesses.append(
            "No certifications were found."
        )

    # ==========================================
    # AI RECOMMENDATIONS
    # ==========================================

    if len(skills) < 8:
        recommendations.append(
            "Add more technical skills relevant to your target role."
        )

    if not sections.get("projects"):
        recommendations.append(
            "Include 2-3 strong projects with measurable outcomes."
        )

    if not sections.get("experience"):
        recommendations.append(
            "Mention internships, freelance work, or practical experience."
        )

    if not sections.get("summary"):
        recommendations.append(
            "Write a professional summary at the beginning of your resume."
        )

    if not sections.get("certifications"):
        recommendations.append(
            "Add relevant certifications to strengthen your profile."
        )

    recommendations.append(
        "Use strong action verbs like Developed, Built, Designed, Led, or Implemented."
    )
    # ==========================================
    # RECRUITER VERDICT
    # ==========================================

    verdict = ""

    if len(weaknesses) == 0:

        verdict = "Excellent resume."

    elif len(weaknesses) <= 2:

        verdict = "Good resume with a strong foundation."

    elif len(weaknesses) <= 4:

        verdict = "Your resume has potential, but several important sections are missing."

    else:

        verdict = "Your resume requires major improvements."
    
    # ==========================================
    # AI SUMMARY
    # ==========================================

    summary = f"Your resume is targeting the {role} role. "

    if strengths:
        summary += (
            f"It performs well in areas such as {', '.join(strengths[:2]).lower()}."
        )

    if weaknesses:
        summary += (
            f" However, recruiters may be concerned because {', '.join(weaknesses[:3]).lower()}."
        )

    summary += " "

    summary += verdict

    return strengths, weaknesses, recommendations, verdict, summary