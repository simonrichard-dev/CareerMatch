from django.urls import include
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .views import UserRegisterViewSet
from .views import UserProfileRegisterViewSet

urlpatterns = [
    path('register/', UserRegisterViewSet.as_view(), name='user_register'),
    path('login/', TokenObtainPairView.as_view(), name='user_auth'),

    path('refresh/', TokenRefreshView.as_view(), name='user_auth_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='user_auth_verify'),

    path('profile/', UserProfileRegisterViewSet.as_view(), name='user_register_profile'),
]