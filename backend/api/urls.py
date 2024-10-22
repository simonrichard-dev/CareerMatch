from django.urls import include
from django.urls import path

urlpatterns = [
    path('proposal/', include('api.proposal.urls')),
]