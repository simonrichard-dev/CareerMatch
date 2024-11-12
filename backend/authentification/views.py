from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from api.user.models import UserProfile
from api.user.serializers import UserSerializer

from .serializers import PostUserRegisterSerializer
from .serializers import PostUserProfileRegisterSerializer
from .serializers import PutUserProfileRegisterSerializer


class UserRegisterViewSet(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PostUserRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User registered successfully.',
            'data': {
                'user': UserSerializer(user).data,
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        }, status=status.HTTP_201_CREATED)

class UserProfileRegisterViewSet(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_profile = request.user.profile
        if user_profile:
            method = "updated"
            serializer = PutUserProfileRegisterSerializer(data=request.data)
        else:
            method = "registered"
            serializer = PostUserProfileRegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if method == "registered":
            self.perform_create(serializer)
        elif method == "updated":
            self.perform_update(serializer)

        return Response({
            'message': f'User profile {method} successfully.',
            'data': {
                'payload': serializer.data,
                'user': UserSerializer(request.user).data
            }
        }, status=status.HTTP_201_CREATED)
    
    def perform_create(self, serializer: PostUserProfileRegisterSerializer):
        UserProfile.objects.create(
            user=self.request.user,
            first_name=serializer.validated_data['first_name'],
            last_name=serializer.validated_data['last_name'],
            address=serializer.validated_data['address'],
            zip_code=serializer.validated_data['zip_code'],
            user_goal_type=serializer.validated_data['user_goal_type']
        )

    def perform_update(self, serializer: PostUserProfileRegisterSerializer):
        user_profile: UserProfile = self.request.user.profile
        user_profile.first_name = serializer.validated_data.get('first_name', user_profile.first_name)
        user_profile.last_name = serializer.validated_data.get('last_name', user_profile.last_name)
        user_profile.address = serializer.validated_data.get('address', user_profile.address)
        user_profile.zip_code = serializer.validated_data.get('zip_code', user_profile.zip_code)
        user_profile.user_goal_type = serializer.validated_data.get('user_goal_type', user_profile.user_goal_type)
        user_profile.save()
        return user_profile
