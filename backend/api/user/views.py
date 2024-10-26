from rest_framework import viewsets, mixins
from rest_framework import permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from backend.permissions import HaveNoProfile

from .models import User
from .models import UserProfile
from .serializers import UserSerializer
from .serializers import UserSerializerBase
from .serializers import PostUserProfileRegisterSerializer
from .serializers import PostUserRegisterSerializer


class UserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserSerializer
        return UserSerializerBase


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
        return [permissions.IsAuthenticated()]

    def get_serializer(self, *args, **kwargs):
        if self.request.method == 'PUT':
            kwargs['partial'] = True
        return PostUserProfileRegisterSerializer(*args, **kwargs)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        UserProfile.objects.create(**serializer.validated_data, user=request.user)

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

        UserProfile.objects.create(**serializer.validated_data, user=request.user)

        return Response({
            'message': 'User profile updated successfully.',
            'data': {
                'payload': serializer.data,
                'user': UserSerializer(request.user).data
            }
        }, status=status.HTTP_201_CREATED)
