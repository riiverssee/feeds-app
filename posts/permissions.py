from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """Allow access only to the author of the post."""
    message = 'You do not have permission to modify this post.'

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user


class IsAdminUser(BasePermission):
    """Allow access only to admin users."""
    message = 'Access denied. Admin only.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_admin
        )