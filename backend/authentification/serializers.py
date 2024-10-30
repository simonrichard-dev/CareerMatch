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

    def create(self, validated_data):
        user_profile = UserProfile.objects.create(**validated_data)
        return user_profile


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
    
    def update(self, instance: UserProfile, validated_data: dict):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.address = validated_data.get('address', instance.address)
        instance.zip_code = validated_data.get('zip_code', instance.zip_code)
        instance.user_goal_type = validated_data.get('user_goal_type', instance.user_goal_type)
        instance.save()
        return instance


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
