from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response

from backend.permissions import HaveProfile
from backend.choices import UserMatchState
from backend.choices import UserNotificationState

from api.proposal.models import Proposal
from api.proposal.serializers import ProposalSerializer

from .models import User
from .models import UserMatch
from .models import UserNotification
from .serializers import UserSerializer
from .serializers import UserSerializerBase
from .serializers import UserMatchSerializer
from .serializers import UserNotificationSerializer
from .serializers import UpdateUserMatchSerializer

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


class MeUserProposalViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = ProposalSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        HaveProfile
    ]

    def get_queryset(self):
        return Proposal.objects.filter(
            author=self.request.user,
            is_published=True,
            deleted_at__isnull=True
        )


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


class UserMatchesViewSet(
    viewsets.GenericViewSet
):
    permission_classes = [
        # permissions.IsAuthenticated,
        # HaveProfile
    ]
    serializer_class = UserMatchSerializer

    def get_queryset(self):
        return UserMatch.objects.filter(
            proposal__author=self.request.user
        )

    def get_proposal(self, proposal_id: int) -> Proposal:
        try:
            return UserMatch.objects.get(pk=proposal_id)
        except UserMatch.DoesNotExist:
            return None

    def update(self, request):
        serializer = UpdateUserMatchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        proposal = self.get_proposal(serializer.validated_data['proposal'])
        if (proposal.author.id != request.user.id):
            return Response({
                'error': 'L\'utilisateur n\'est pas l\'auteur de cette proposition.',
            }, status=status.HTTP_406_NOT_ACCEPTABLE)

        proposal.status = serializer.validated_data['status']
        return Response({
            'message': "OK!"
        }, status=status.HTTP_200_OK)