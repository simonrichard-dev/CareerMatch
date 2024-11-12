import os
from rest_framework import serializers

from api.user.serializers import UserSerializer

from .models import Tag
from .models import Proposal


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'category',)


class ProposalSerializerBase(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = Proposal
        fields = (
            'id',
            'created_at',
            'updated_at',
            'tags',
        )


class ProposalSerializer(ProposalSerializerBase):
    author = UserSerializer()
    proposal_imgs_files = serializers.SerializerMethodField()

    def get_proposal_imgs_files(self, obj: Proposal):
        file_path = obj.proposal_file.name
        if not file_path:
            return []
        file_name = file_path.split('/')[-1].replace('.pdf', '')
        files = []
        for i in range(0, 3):
            file_path_img = f'media/{os.path.dirname(file_path)}/imgs/{file_name}_{i}.jpg'
            if not os.path.exists(file_path_img):
                break
            files.append(file_path_img)
        return files

    class Meta(ProposalSerializerBase.Meta):
        fields = (
            'id',
            'created_at',
            'updated_at',
            'author',
            'tags',
            'proposal_file',
            'video_file',
            'proposal_imgs_files',
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
        fields = ('tags', 'proposal_file', 'video_file',)

    def validate(self, data):
        return data