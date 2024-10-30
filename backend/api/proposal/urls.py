from rest_framework.routers import DefaultRouter

from .views import TagViewSet
from .views import ProposalViewSet


router = DefaultRouter(trailing_slash=True)
router.register('tags', TagViewSet, basename='tag')
router.register('', ProposalViewSet, basename='proposal')
urlpatterns = router.urls
