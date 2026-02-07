from django.urls import path
from .views import ListingListCreateAPIView, ListingDetailAPIView

urlpatterns = [
    path('listings/', ListingListCreateAPIView.as_view(), name='listing-list'),
    path('listings/<int:pk>/', ListingDetailAPIView.as_view(), name='listing-detail'),
]