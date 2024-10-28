from rest_framework.routers import DefaultRouter

from .views import MatchingViewSet


router = DefaultRouter(trailing_slash=True)
router.register('', MatchingViewSet, basename='matching')
urlpatterns = router.urls
