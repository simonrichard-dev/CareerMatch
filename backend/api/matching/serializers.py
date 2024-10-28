from rest_framework import serializers

from api.user.serializers import UserSerializer
from api.user.models import UserMatch
from api.proposal.serializers import ProposalSerializer

from backend.choices import UserMatchState

class UserMatchSerializerBase(serializers.ModelSerializer):
    class Meta:
        model = UserMatch
        fields = ('id', 'state',)


class UserMatchSerializer(UserMatchSerializerBase):
    user = UserSerializer()
    proposal = ProposalSerializer()

    class Meta(UserMatchSerializerBase.Meta):
        model = UserMatch
        fields = ('id', 'state', 'user', 'proposal',)


class PostUserMatchingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMatch
        fields = (
            'state',
            'proposal',
        )

    def create(self, validated_data):
        user_match = UserMatch.objects.create(**validated_data)
        return user_match


class UpdateUserMatchingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMatch
        fields = (
            'state',
            'proposal',
        )
        extra_kwargs = {
            'state': {'required': False},
            'proposal': {'required': False},
        }

