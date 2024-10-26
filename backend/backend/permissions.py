from rest_framework import permissions


class HaveProfile(permissions.BasePermission):
    message = { 'error': 'User don\'t have a profile.' }

    def has_permission(self, request, view):
        try:
            if request.user.profile:
                request.profile = request.user.profile
                return True
            return False
        except:
            return False


class  HaveNoProfile(permissions.BasePermission):
    message = { 'error': 'User have a profile.' }

    def has_permission(self, request, view):
        try:
            if request.user:
                try:
                    if request.user.profile:
                        return False
                    return True
                except:
                    return True
            return False
        except:
            return False
