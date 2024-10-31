from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response

from backend.permissions import HaveProfile
from backend.choices import UserMatchState
from backend.choices import UserNotificationState

from .models import User
from .models import UserMatch
from .models import UserNotification
from .serializers import UserSerializer
from .serializers import UserSerializerBase
from .serializers import UserMatchSerializer
from .serializers import UserNotificationSerializer

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


class MeUserMatchesViewSet(
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    permission_classes = [
        permissions.IsAuthenticated,
        HaveProfile
    ]

    def get_queryset(self):
        return UserMatch.objects.filter(
            user=self.request.user
        )

    def list(self, request):
        list_matched_received = UserMatch.objects.filter(
            proposal__author=self.request.user,
            state=UserMatchState.MATCHED
        )
        list_matches = UserMatch.objects.filter(
            user=self.request.user,
            state=UserMatchState.MATCHED
        )
        return Response({
            'matches': UserMatchSerializer(list_matches, many=True).data,
            'matches_received': UserMatchSerializer(list_matched_received, many=True).data
        }, status=status.HTTP_200_OK)


class MeUserNotificationsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    permission_classes = [
        permissions.IsAuthenticated,
        HaveProfile
    ]

    def get_queryset(self):
        return UserNotification.objects.filter(
            user=self.request.user
        )

    def list(self, request):
        list_notifications = self.get_queryset()
        return Response(
            UserNotificationSerializer(list_notifications, many=True).data,
            status=status.HTTP_200_OK
        )

    def create(self, request):
        for notification in self.get_queryset().filter(state=UserNotificationState.UNREAD):
            notification.state = UserNotificationState.READ
            notification.save()
        return Response(status=status.HTTP_201_CREATED)
