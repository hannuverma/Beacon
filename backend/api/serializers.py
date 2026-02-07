from rest_framework import serializers
from .models import Vendor, UserProfile

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['id', 'name', 'category', 'address', 'lat', 'lng', 'is_open', 'expected_purchases', 'expected_earnings']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email', 'home_address', 'home_lat', 'home_lng']
