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
            'proposal_file',
            'video_file',
        )


class ProposalUpsertSerializer(ProposalSerializerBase):
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False
    )

    proposal_file = serializers.FileField(
        required=True,
        help_text='Upload a proposal file.'
    )
    video_file = serializers.FileField(
        required=False,
        allow_null=True,
        help_text='Upload a video file.'
    )

    class Meta(ProposalSerializerBase.Meta):
        fields = ('title', 'description', 'tags', 'proposal_file', 'video_file',)

    def validate(self, data):
        return data