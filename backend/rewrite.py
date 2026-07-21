def generate_rewrite(role, sections, skills):

    rewrite = {}

    # ==========================================
    # PROFESSIONAL SUMMARY
    # ==========================================

    if not sections.get("summary"):

        rewrite["summary"] = (
            f"Passionate {role} with a strong foundation in modern technologies. "
            f"Skilled in problem solving, teamwork, and software development. "
            f"Eager to contribute to innovative projects while continuously learning "
            f"and improving technical expertise."
        )

    # ==========================================
    # PROJECT SUGGESTIONS
    # ==========================================

    if not sections.get("projects"):

        if role == "Frontend Developer":

            rewrite["projects"] = [

                "Responsive Portfolio Website using HTML, CSS, JavaScript and React.",

                "Task Management Web App with authentication and CRUD operations.",

                "Weather Dashboard using React and REST APIs."

            ]

        elif role == "Backend Developer":

            rewrite["projects"] = [

                "REST API using FastAPI and MongoDB.",

                "Authentication System with JWT.",

                "Blog API with CRUD operations."

            ]

        else:

            rewrite["projects"] = [

                "Full Stack Web Application",

                "AI Resume Analyzer",

                "E-Commerce Website"

            ]

    # ==========================================
    # SKILL RECOMMENDATIONS
    # ==========================================

    if len(skills) < 8:

        rewrite["skills"] = [

            "Git",

            "GitHub",

            "Docker",

            "REST API",

            "SQL",

            "Problem Solving"

        ]

    # ==========================================
    # CERTIFICATIONS
    # ==========================================

    if not sections.get("certifications"):

        rewrite["certifications"] = [

            "Google Career Certificate",

            "AWS Cloud Practitioner",

            "Meta Front-End Developer",

            "Microsoft Azure Fundamentals"

        ]

    return rewrite
