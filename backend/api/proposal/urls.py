from rest_framework.routers import DefaultRouter

from .views import TagViewSet


router = DefaultRouter(trailing_slash=True)
router.register('tags', TagViewSet, basename='tag')
# router.register('', ProposalViewSet, basename='proposal')
urlpatterns = router.urls
