from rest_framework import serializers

from .models import User
from .models import UserProfile
from .models import UserMatch
from .models import UserNotification

from api.proposal.models import Proposal


class UserProfileSerializer(serializers.ModelSerializer):
    proposal = serializers.SerializerMethodField()
    
    def get_proposal(self, obj: UserProfile):
        try:
            from api.proposal.serializers import ProposalSerializer
            proposal = Proposal.objects.filter(
                author=obj.user
            ).first()
            return ProposalSerializer(proposal).data
        except Exception:
            return None

    class Meta:
        model = UserProfile
        fields = [
            'first_name',
            'last_name',
            'address',
            'zip_code',
            'user_goal_type',
            'proposal',
        ]


class UserSerializerBase(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']


class UserSerializer(UserSerializerBase):
    profile = UserProfileSerializer(read_only=True)

    class Meta(UserSerializerBase.Meta):
        model = User
        fields = ['id', 'email', 'profile']


class UserMatchSerializerBase(serializers.ModelSerializer):
    class Meta:
        model = UserMatch
        fields = ['id', 'user_id', 'proposal_id', 'state', 'status']


class UserMatchSerializer(UserMatchSerializerBase):
    user = UserSerializer(read_only=True)
    proposal = serializers.SerializerMethodField()

    def get_proposal(self, obj: UserMatch):
        from api.proposal.serializers import ProposalSerializer
        return ProposalSerializer(obj.proposal).data

    class Meta(UserMatchSerializerBase.Meta):
        fields = ['id', 'user', 'proposal', 'state', 'status']


class UserNotificationSerializer(serializers.ModelSerializer):
    user = UserSerializerBase(read_only=True)
    proposal = serializers.SerializerMethodField()

    def get_proposal(self, obj: UserMatch):
        from api.proposal.serializers import ProposalSerializerBase
        return ProposalSerializerBase(obj.proposal).data

    class Meta:
        model = UserNotification
        fields = ['id', 'created_at', 'user', 'proposal', 'state']


class UpdateUserMatchSerializer(serializers.Serializer):
    match = serializers.IntegerField(required=True)
    status = serializers.IntegerField(required=True)
