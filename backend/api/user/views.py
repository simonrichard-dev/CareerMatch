from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response

from backend.permissions import HaveProfile

from .models import User
from .serializers import UserSerializer
from .serializers import UserSerializerBase

class UserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = User.objects.all().filter(is_active=True)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserSerializer
        return UserSerializerBase


class MeUserViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        data = UserSerializer(self.request.user).data
        return Response(data, status=status.HTTP_200_OK)
