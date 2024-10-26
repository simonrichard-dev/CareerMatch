from django.urls import include
from django.urls import path

urlpatterns = [
    path('users/', include('api.user.urls')),
    path('proposals/', include('api.proposal.urls')),
]