from rest_framework.permissions import BasePermission, SAFE_METHODS

class ManagerPermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='manager').exists()

class UserPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.method in ['POST', 'PUT', 'PATCH']:
            return request.user.groups.filter(name='user').exists()
        return False

class PublicPermission(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
