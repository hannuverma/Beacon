from rest_framework import serializers
from .models import Listing, Category, HostProfile


class CategorySerializer(serializers.ModelSerializer):
	class Meta:
		model = Category
		fields = "__all__"


class HostProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = HostProfile
		fields = "__all__"


class ListingSerializer(serializers.ModelSerializer):
	class Meta:
		model = Listing
		fields = "__all__"


