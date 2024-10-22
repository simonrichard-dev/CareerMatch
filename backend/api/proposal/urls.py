from rest_framework.routers import DefaultRouter

from .views import TagViewSet


router = DefaultRouter(trailing_slash=True)
# router.register('', ProposalView, basename='proposal')
router.register('tags', TagViewSet, basename='tag')
urlpatterns = router.urls
