"""
Text -> vector helpers used by the recommendation engine.

The sentence-transformer model used to be instantiated at *import* time, which
meant that merely importing this module (directly or through
``network.views``) triggered a multi-hundred-megabyte download from HuggingFace
and blocked Django's startup.  In production that made the whole API unable to
boot without outbound internet access.

The model is now loaded lazily, exactly once, and only when a vector is
actually needed.  Failures are surfaced as a clear exception instead of
silently producing garbage embeddings.
"""

from threading import Lock

MODEL_NAME = "all-MiniLM-L6-v2"

_model = None
_model_lock = Lock()
_model_error = None


def get_model():
    """Return the shared SentenceTransformer, loading it on first use.

    The lock makes this safe to call from concurrent request threads: only the
    first caller pays the load cost, everyone else waits and then reuses it.
    """
    global _model, _model_error

    if _model is not None:
        return _model

    with _model_lock:
        # Re-check inside the lock — another thread may have loaded it already.
        if _model is not None:
            return _model

        if _model_error is not None:
            raise _model_error

        try:
            from sentence_transformers import SentenceTransformer

            _model = SentenceTransformer(MODEL_NAME)
        except Exception as exc:  # pragma: no cover - depends on the environment
            _model_error = exc
            raise RuntimeError(
                f"Could not load the sentence-transformer model '{MODEL_NAME}'. "
                "Recommendations are unavailable. Original error: "
                f"{exc}"
            ) from exc

    return _model


def _as_text(value):
    """Coerce a possibly-list model field into a plain string."""
    if value is None:
        return ""
    if isinstance(value, (list, tuple, set)):
        return ", ".join(str(v) for v in value)
    return str(value)


def profile_to_text(profile):
    return (
        f"preferred_role:{_as_text(profile.preferred_role)}\n"
        f"selectedSkills:{_as_text(profile.selectedSkills)}\n"
        f"experience:{_as_text(profile.experience)}\n"
        f"country:{_as_text(profile.country)}\n"
        f"bio:{_as_text(profile.bio)}\n"
        f"college:{_as_text(profile.college)}"
    )


def collab_to_text(collabe, team):
    return (
        f"event_description:{_as_text(collabe.description)}\n"
        f"skills:{_as_text(team.skills)}\n"
        f"role:{_as_text(team.roles)}\n"
        f"country:{_as_text(collabe.event_type)}"
    )


def profile_to_vector(profile):
    text = profile_to_text(profile)
    return get_model().encode(text).tolist()


def collabe_to_vector(collabe, team):
    text = collab_to_text(collabe, team)
    return get_model().encode(text).tolist()
