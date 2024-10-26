from django.urls import path

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .views import UserViewSet
from .views import UserRegisterViewSet
from .views import UserProfileRegisterViewSet


router = DefaultRouter(trailing_slash=True)
router.register('', UserViewSet, basename='user')

urlpatterns = [
    path('auth/', TokenObtainPairView.as_view(), name='user_auth'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='user_auth_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='user_auth_verify'),
    path('auth/register/', UserRegisterViewSet.as_view(), name='user_register'),

    path('register_profile/', UserProfileRegisterViewSet.as_view(), name='user_register_profile'),
] + router.urls