from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import exception_handler

def exception_handler_rest(exc, context):
    if isinstance(exc, AuthenticationFailed):
        return Response({
            "error": "Invalid token",
            "status_code": 401
        }, status=401)

    # By default
    response = exception_handler(exc, context)

    if response is not None:
        response.data['status_code'] = response.status_code

    return response