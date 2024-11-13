from rest_framework.routers import DefaultRouter

from .views import UserViewSet
from .views import MeUserViewSet
from .views import MeUserMatchesViewSet
from .views import MeUserProposalViewSet
from .views import MeUserNotificationsViewSet
from .views import UserMatchesViewSet


router = DefaultRouter(trailing_slash=True)
router.register('matches', UserMatchesViewSet, basename='matches')
router.register('me/proposals', MeUserProposalViewSet, basename='me_proposals')
router.register('me/notifications', MeUserNotificationsViewSet, basename='me_notifications')
router.register('me/matches', MeUserMatchesViewSet, basename='me_matches')
router.register('me', MeUserViewSet, basename='me')
router.register('', UserViewSet, basename='user')
urlpatterns = router.urls