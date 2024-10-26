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


class PostUserProfileRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }



class PostUserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
