"""
Django settings for the CoDO project.

Every environment-specific value is read from the environment (via a ``.env``
file in the project root) so the same code can run locally, in staging and in
production.  Security-sensitive settings default to the *safe* value; when you
deliberately need a looser setting for local development you opt in explicitly
through ``.env`` (see ``.env.example``).
"""

from pathlib import Path
from datetime import timedelta

import os

from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from the .env file (never committed).
load_dotenv(BASE_DIR / ".env")


# ── Tiny env helpers ──────────────────────────────────────────────────────────
def env_str(key, default=""):
    return os.getenv(key, default)


def env_bool(key, default=False):
    raw = os.getenv(key)
    if raw is None:
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


def env_int(key, default):
    try:
        return int(os.getenv(key, default))
    except (TypeError, ValueError):
        return default


def env_list(key, default=None):
    """Parse a comma-separated env var into a clean list of strings."""
    raw = os.getenv(key)
    if not raw:
        return list(default or [])
    return [item.strip() for item in raw.split(",") if item.strip()]


# ── Core ──────────────────────────────────────────────────────────────────────
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env_bool("DEBUG", False)

# SECURITY WARNING: keep the secret key used in production secret!
_secret_key = env_str("SECRET_KEY")
if _secret_key:
    SECRET_KEY = _secret_key
elif DEBUG:
    # Local development fallback only — never used once DEBUG is turned off.
    SECRET_KEY = "django-insecure-dev-only-key-do-not-use-in-production"
else:
    raise RuntimeError(
        "SECRET_KEY is not set. Refusing to start in non-debug mode without a "
        "secret key. Generate one with:\n"
        "  python -c \"from django.core.management.utils import "
        "get_random_secret_key; print(get_random_secret_key())\""
    )

ALLOWED_HOSTS = env_list(
    "ALLOWED_HOSTS",
    ["localhost", "127.0.0.1", "[::1]", "testserver"] if DEBUG else [],
)

CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", [])


# ── Application definition ────────────────────────────────────────────────────
INSTALLED_APPS = [
    "daphne",
    "channels",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",
    "rest_framework",
    # Required by SIMPLE_JWT["BLACKLIST_AFTER_ROTATION"] — without it the
    # logout endpoint cannot write to the blacklist table.
    "rest_framework_simplejwt.token_blacklist",

    "profiles",
    "accounts",
    "OrganizationProfile",
    "event",
    "usercollabration",
    "notification",
    "network",
    "teams",
    "chat",
    "workspace",
    "saved",
    # "django_extensions",
    # 'dashboard',
]

GITHUB_CLIENT_ID = env_str("GIT_HUB_ID")
GITHUB_CLIENT_SECRET = env_str("GIT_HUB_SECRET_KEY")


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# WebSockets are served through Daphne; WSGI is kept for `runserver` fallbacks.
ASGI_APPLICATION = "config.asgi.application"
WSGI_APPLICATION = "config.wsgi.application"


# ── Channels / WebSocket layer ────────────────────────────────────────────────
# In-memory layers only work for a single process. Point REDIS_URL at a real
# Redis instance to run multiple workers (required in production).
REDIS_URL = env_str("REDIS_URL")
if REDIS_URL:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {"hosts": [REDIS_URL]},
        }
    }
else:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels.layers.InMemoryChannelLayer",
        }
    }


# ── Caching ───────────────────────────────────────────────────────────────────
# LocMem is per-process. Use REDIS_URL (or a separate CACHE_URL) for a shared
# cache once you run more than one worker.
if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": REDIS_URL,
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "codo-git-cache",
        }
    }

# GitHub profile/GraphQL cache TTL (seconds) — 10 minutes
GIT_PROFILE_CACHE_TTL = env_int("GIT_PROFILE_CACHE_TTL", 600)


# ── Database ──────────────────────────────────────────────────────────────────
# SQLite is the default local-development database. PostgreSQL-specific
# DB_* environment variables are intentionally ignored in this configuration.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# ── Password validation ───────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ── Internationalization ──────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = env_str("TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True


# ── Static & media files ──────────────────────────────────────────────────────
STATIC_URL = "static/"
# `collectstatic` target for production.
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "accounts.User"


# ── CORS ──────────────────────────────────────────────────────────────────────
# Never combine CORS_ALLOW_ALL_ORIGINS with credentials — browsers reject it and
# it silently breaks every authenticated request. Origins come from .env.
CORS_ALLOW_ALL_ORIGINS = env_bool("CORS_ALLOW_ALL_ORIGINS", False)
CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
)
CORS_ALLOW_CREDENTIALS = True


# ── Django REST Framework ─────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    # Sensible defaults so list endpoints can't be forced to dump the whole
    # table into memory.
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": env_int("API_PAGE_SIZE", 20),
    # Basic abuse protection. Tune the rates in .env if they are too strict.
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "anon": env_str("DRF_ANON_THROTTLE", "60/min"),
        "user": env_str("DRF_USER_THROTTLE", "600/min"),
    },
    # Return validation errors as a flat {"field": ["message"]} map.
    "EXCEPTION_HANDLER": "config.exceptions.codo_exception_handler",
}


# ── JWT ───────────────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=env_int("JWT_ACCESS_MINUTES", 60)),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=env_int("JWT_REFRESH_DAYS", 7)),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# ── Email ─────────────────────────────────────────────────────────────────────
EMAIL_BACKEND = env_str(
    "EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"
)
EMAIL_HOST = env_str("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = env_int("EMAIL_PORT", 587)
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
EMAIL_HOST_USER = env_str("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env_str("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = env_str("DEFAULT_FROM_EMAIL", EMAIL_HOST_USER or "no-reply@codo.local")
EMAIL_TIMEOUT = env_int("EMAIL_TIMEOUT", 15)


# ── Upload limits (protect against oversized payloads) ────────────────────────
DATA_UPLOAD_MAX_MEMORY_SIZE = env_int("DATA_UPLOAD_MAX_MEMORY_SIZE", 10 * 1024 * 1024)
FILE_UPLOAD_MAX_MEMORY_SIZE = env_int("FILE_UPLOAD_MAX_MEMORY_SIZE", 10 * 1024 * 1024)


# ── Security hardening (only enforced when DEBUG is off) ──────────────────────
if not DEBUG:
    SECURE_SSL_REDIRECT = env_bool("SECURE_SSL_REDIRECT", True)
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    # "Lax" keeps OAuth/GitHub callbacks working while still blocking CSRF.
    SESSION_COOKIE_SAMESITE = "Lax"
    CSRF_COOKIE_SAMESITE = "Lax"

    SECURE_HSTS_SECONDS = env_int("SECURE_HSTS_SECONDS", 31536000)  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
    X_FRAME_OPTIONS = "DENY"
else:
    # Local dev: cookies over plain http, no forced redirects.
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_SSL_REDIRECT = False
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"


# ── Logging ───────────────────────────────────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {name} [{process:d}] {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "filters": {
        "require_debug_false": {
            "()": "django.utils.log.RequireDebugFalse",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
        # Errors are written to a rotating file so they survive restarts.
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": BASE_DIR / "logs" / "codo.log",
            "maxBytes": env_int("LOG_MAX_BYTES", 5 * 1024 * 1024),
            "backupCount": env_int("LOG_BACKUP_COUNT", 5),
            "formatter": "verbose",
            "filters": ["require_debug_false"],
            "delay": True,
        },
        "mail_admins": {
            "class": "django.utils.log.AdminEmailHandler",
            "filters": ["require_debug_false"],
            "include_html": False,
        },
    },
    "root": {
        "handlers": ["console"] + (["file"] if not DEBUG else []),
        "level": env_str("LOG_LEVEL", "INFO"),
    },
    "loggers": {
        "django": {
            "handlers": ["console"] + (["file"] if not DEBUG else []),
            "level": env_str("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console", "file", "mail_admins"] if not DEBUG else ["console"],
            "level": "ERROR",
            "propagate": False,
        },
        # WebSocket / Channels internals are noisy at INFO.
        "daphne": {"handlers": ["console"], "level": "WARNING", "propagate": False},
    },
}

# Make sure the log directory exists before the RotatingFileHandler opens it.
if not DEBUG:
    (BASE_DIR / "logs").mkdir(parents=True, exist_ok=True)


# ── Admin notifications ───────────────────────────────────────────────────────
ADMINS = [
    (name.strip(), email.strip())
    for name, email in (
        pair.split(":", 1) for pair in env_list("ADMINS") if ":" in pair
    )
]
MANAGERS = ADMINS
