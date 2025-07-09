from rest_framework.permissions import BasePermission


class UnAuthenticated(BasePermission):
    """
    Only allow the Non-Authenticated user
    """
    def has_permission(self, request, view):
        return not bool(request.user and request.user.is_authenticated)