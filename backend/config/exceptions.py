"""
Custom DRF exception handler.

Goals:
* Never leak stack traces / internal details to API clients.
* Always return a JSON body with a predictable shape.
* Log 5xx errors with context so they are actionable in production.
"""

import logging

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def codo_exception_handler(exc, context):
    """Return a consistent, safe error payload for every unhandled exception."""
    # Let DRF handle the exceptions it knows about (validation, auth, 404, ...).
    response = exception_handler(exc, context)

    if response is None:
        # Anything DRF didn't recognise is a genuine bug / 500.
        view = context.get("view")
        logger.exception(
            "Unhandled %s in %s",
            exc.__class__.__name__,
            view.__class__.__name__ if view else "unknown view",
            exc_info=exc,
        )
        return Response(
            {
                "error": "internal_server_error",
                "detail": "An unexpected error occurred. Please try again later.",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            exception=exc,
        )

    # Wrap DRF's payload so clients can rely on a stable envelope.
    if isinstance(response.data, dict):
        payload = response.data
        # Some DRF errors already use {"detail": ...}; keep that shape.
        if "detail" not in payload:
            payload = {**payload, "error": _derive_error_code(response.status_code)}
    else:
        payload = {
            "error": _derive_error_code(response.status_code),
            "detail": response.data,
        }

    response.data = payload
    return response


def _derive_error_code(status_code):
    return {
        400: "validation_error",
        401: "not_authenticated",
        403: "permission_denied",
        404: "not_found",
        405: "method_not_allowed",
        409: "conflict",
        429: "throttled",
    }.get(status_code, "error")
