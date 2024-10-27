from rest_framework import serializers

from .models import User
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name']


class UserSerializerBase(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']


class UserSerializer(UserSerializerBase):
    profile = UserProfileSerializer(read_only=True)

    class Meta(UserSerializerBase.Meta):
        model = User
        fields = ['id', 'email', 'profile']
