from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def profile_to_text(profile):
    return f"""
preferred_role:{profile.preferred_role}

selectedSkills:{profile.selectedSkills}

experience:{profile.experience}

country:{profile.country}

bio:{profile.bio}

college:{profile.college}
    """

def profile_to_vector(profile):
    text = profile_to_text(profile)
    return model.encode(text).tolist()