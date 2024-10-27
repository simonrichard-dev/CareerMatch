from rest_framework.routers import DefaultRouter

from .views import UserViewSet
from .views import MeUserViewSet


router = DefaultRouter(trailing_slash=True)
router.register('me', MeUserViewSet, basename='me')
router.register('', UserViewSet, basename='user')
urlpatterns = router.urls