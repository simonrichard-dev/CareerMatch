from rest_framework import serializers

from api.user.models import User
from api.user.models import UserProfile


class PostUserProfileRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            'first_name',
            'last_name',
            'address',
            'zip_code',
            'user_goal_type',
        )
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'address': {'required': True},
            'zip_code': {'required': True},
            'user_goal_type': {'required': True},
        }


class PutUserProfileRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            'first_name',
            'last_name',
            'address',
            'zip_code',
            'user_goal_type',
        )
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'address': {'required': False},
            'zip_code': {'required': False},
            'user_goal_type': {'required': False},
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
