def calculate_ats(text, skills):

    score = 0

    suggestions = []

    text = text.lower()

    breakdown = {
        "Contact Information": 0,
        "Technical Skills": 0,
        "Projects": 0,
        "Education": 0,
        "Experience": 0
    }

    # =========================
    # Contact (10)
    # =========================

    if "@" in text:
        breakdown["Contact Information"] += 5
    else:
        suggestions.append("Add an email address.")

    if any(char.isdigit() for char in text):
        breakdown["Contact Information"] += 5
    else:
        suggestions.append("Add a phone number.")

    # =========================
    # Skills (40)
    # =========================

    skill_points = min(len(skills) * 4, 40)

    breakdown["Technical Skills"] = skill_points

    if len(skills) < 8:
        suggestions.append(
            "Add more technical skills relevant to your role."
        )

    # =========================
    # Projects (20)
    # =========================

    if "project" in text:

        breakdown["Projects"] = 20

    else:

        suggestions.append(
            "Include a Projects section."
        )

    # =========================
    # Education (10)
    # =========================

    if "education" in text:

        breakdown["Education"] = 10

    else:

        suggestions.append(
            "Include your Education section."
        )

    # =========================
    # Experience (20)
    # =========================

    if "experience" in text:

        breakdown["Experience"] = 20

    else:

        suggestions.append(
            "Add internship or work experience."
        )

    score = sum(breakdown.values())

    return min(score,100), suggestions, breakdown