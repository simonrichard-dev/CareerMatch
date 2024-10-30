from django.utils import timezone

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser

from backend.permissions import HaveProfile

from .models import Tag
from .models import Proposal
from .serializers import TagSerializer
from .serializers import ProposalSerializer
from .serializers import ProposalSerializerBase
from .serializers import ProposalUpsertSerializer


class TagViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pagination_class = None


class ProposalViewSet(viewsets.ModelViewSet):
    parser_class = (FileUploadParser,)

    def get_queryset(self):
        if self.action in {'list', 'retrieve'}:
            return Proposal.objects.filter(
                deleted_at__isnull=True,
                is_published=True,
            )
        return Proposal.objects.filter(
            deleted_at__isnull=True,
            is_published=True,
            author=self.request.user,
        )

    def get_permissions(self):
        if self.action in {'list', 'retrieve'}:
            return super().get_permissions()
        return (
            permissions.IsAuthenticated(),
            HaveProfile(),
        )

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProposalSerializer
        elif self.action == 'list':
            return ProposalSerializerBase
        return ProposalUpsertSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_create(serializer)
        response_serializer = ProposalSerializer(serializer.instance)

        return Response(
            {
                "message": "Proposal created.",
                "data": response_serializer.data,
            },
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
    
        self.perform_update(serializer)
        response_serializer = ProposalSerializer(serializer.instance)

        return Response(
            {
                "message": "Proposal updated.",
                "data": response_serializer.data,
            },
            status=status.HTTP_202_ACCEPTED
        )

    def perform_create(self, serializer: ProposalUpsertSerializer):
        serializer.save(
            author=self.request.user,
            is_published=True,
        )

    def perform_destroy(self, instance: Proposal):
        instance.deleted_at = timezone.now()
        instance.save()
