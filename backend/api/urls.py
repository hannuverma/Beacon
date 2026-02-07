from django.urls import path
from .views import ListingListCreateAPIView, ListingDetailAPIView, export_all, signup_user, signup_host, login

urlpatterns = [
    path('listings/', ListingListCreateAPIView.as_view(), name='listing-list'),
    path('listings/<int:pk>/', ListingDetailAPIView.as_view(), name='listing-detail'),
    path('export/', export_all, name='export-all'),
    path('signup/user/', signup_user, name='signup-user'),
    path('signup/host/', signup_host, name='signup-host'),
    path('login/', login, name='login'),
]