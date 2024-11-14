from django.utils import timezone

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from backend.manager.UserProposalManager import UserManagerProposal
from backend.permissions import HaveProfile

from api.proposal.serializers import ProposalMatchingSerializer
from api.user.models import UserMatch
from api.proposal.models import Proposal

from .serializers import PostUserMatchingSerializer
from .serializers import UpdateUserMatchingSerializer


class MatchingViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    permission_classes = (
        permissions.IsAuthenticated,
        HaveProfile,
    )
    serializer_class = None

    def same_author_proposal(self, proposal: Proposal):
        return proposal.author_id == self.request.user.id
    
    def list(self, request):
        manager = UserManagerProposal(request.user)
        proposals = manager.generate_matching()

        serializer = ProposalMatchingSerializer(proposals, many=True)

        return Response({ "matching": serializer.data })

    def post(self, request):
        serializer = PostUserMatchingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        proposal = serializer.validated_data['proposal']
        if (self.same_author_proposal(serializer.validated_data['proposal'])):
            return Response({
                'error': 'User cannot match with own proposal.',
            }, status=status.HTTP_406_NOT_ACCEPTABLE)

        if UserMatch.get_user_match(request.user.id, proposal.id):
            return Response({
                'error': 'User match already exists.',
            }, status=status.HTTP_406_NOT_ACCEPTABLE)

        serializer.save(user=request.user)

        return Response({
            'message': 'User match registered successfully.',
            'data': serializer.data,
        }, status=status.HTTP_201_CREATED)
    
    def put(self, request):
        serializer = UpdateUserMatchingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user_match = UserMatch.get_user_match(request.user.id, serializer.validated_data['proposal'].id)
        if not user_match:
            return Response({
                'error': 'User match not found.',
            }, status=status.HTTP_404_NOT_FOUND)
        
        user_match.state = serializer.validated_data['state']
        user_match.save()

        return Response({
            'message': 'User match updated successfully.',
            'data': serializer.data,
        }, status=status.HTTP_200_OK)
