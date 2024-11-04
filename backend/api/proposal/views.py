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
        process_pdf_to_pictures(
            serializer.instance.proposal_file.path,
            serializer.instance.proposal_file.name.replace('proposals/', '')
        )

    def perform_destroy(self, instance: Proposal):
        instance.deleted_at = timezone.now()
        instance.save()


def process_pdf_to_pictures(pdf_path: str, pdf_file: str):
    from pdf2image import convert_from_path
    images = convert_from_path(pdf_path)

    path = pdf_path.replace(pdf_file.replace('/', '\\'), '')
    file_name = pdf_file.replace('.pdf', '')

    for i in range(len(images)):
        images[i].save(path + '/imgs/' + file_name + "_" + str(i) +'.jpg', 'JPEG')
