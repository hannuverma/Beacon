from django.shortcuts import render
from rest_framework import generics
from .models import Listing, Category
from .serializers import ListingSerializer

class ListingListCreateAPIView(generics.ListCreateAPIView):

    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

    def get_queryset(self):

        queryset = Listing.objects.all()
        category_name = self.request.query_params.get('cat')
        if category_name:
            queryset = queryset.filter(category__name=category_name)
        return queryset

class ListingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Listing.objects.all()
    serializer_class = ListingSerializer