from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from backend.permissions import HaveProfile
from backend.permissions import HaveNoProfile

from api.user.models import UserProfile
from api.user.serializers import UserSerializer

from .serializers import PostUserProfileRegisterSerializer
from .serializers import PostUserRegisterSerializer
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
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), HaveNoProfile()]
        return [permissions.IsAuthenticated(), HaveProfile()]

    def get_serializer(self, *args, **kwargs):
        if self.request.method == 'POST':
            return PostUserProfileRegisterSerializer(*args, **kwargs)
        return PutUserProfileRegisterSerializer(*args, **kwargs)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=request.user)

        return Response({
            'message': 'User profile registered successfully.',
            'data': {
                'payload': serializer.data,
                'user': UserSerializer(request.user).data
            }
        }, status=status.HTTP_201_CREATED)

    def put(self, request):
        user_profile = request.user.profile
        serializer = self.get_serializer(user_profile, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response({
            'message': 'User profile updated successfully.',
            'data': {
                'payload': serializer.data,
                'user': UserSerializer(request.user).data
            }
        }, status=status.HTTP_201_CREATED)
