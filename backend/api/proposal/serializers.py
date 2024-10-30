from rest_framework import serializers

from api.user.serializers import UserSerializer

from .models import Tag
from .models import Proposal


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name',)


class ProposalSerializerBase(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = Proposal
        fields = (
            'id',
            'created_at',
            'updated_at',
            'title',
            'description',
            'tags',
        )


class ProposalSerializer(ProposalSerializerBase):
    author = UserSerializer()

    class Meta(ProposalSerializerBase.Meta):
        fields = (
            'id',
            'created_at',
            'updated_at',
            'title',
            'description',
            'author',
            'tags',
        )


class ProposalUpsertSerializer(ProposalSerializerBase):
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False
    )

    class Meta(ProposalSerializerBase.Meta):
        fields = ('title', 'description', 'tags',)

    def validate(self, data):
        return data