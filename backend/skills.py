import json

with open("skills.json", "r") as file:
    SKILLS = json.load(file)


def detect_skills(text):

    text = text.lower()

    found = []

    for category in SKILLS.values():

        for skill in category:

            if skill.lower() in text:

                found.append(skill)

    return sorted(list(set(found)))

import json

with open("roles.json", "r") as file:
    ROLES = json.load(file)

def get_missing_skills(found_skills, role):

    required = ROLES.get(role, [])

    missing = []

    for skill in required:

        if skill not in found_skills:

            missing.append(skill)

    return missing