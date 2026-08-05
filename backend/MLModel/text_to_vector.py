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

def collab_to_text(collabe,team):
    return f"""
event_description:{collabe.description}
skills:{team.skills}

role:{team.roles}

country:{collabe.event_type}
    """

def profile_to_vector(profile):
    text = profile_to_text(profile)
    return model.encode(text).tolist()

def collabe_to_vector(collabe,team):
    text = collab_to_text(collabe,team)
    return model.encode(text).tolist()