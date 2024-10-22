from rest_framework import viewsets, mixins
from rest_framework import permissions, viewsets

from .models import Tag
from .serializers import TagSerializer


class TagViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Tag.objects.all().order_by('-name')
    serializer_class = TagSerializer
