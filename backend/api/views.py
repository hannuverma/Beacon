from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Listing, Category, HostProfile
from .serializers import ListingSerializer, CategorySerializer, HostProfileSerializer
from django.contrib.auth.models import User
from rest_framework import status
from django.db import transaction
import traceback
from django.contrib.auth import authenticate


@api_view(["POST"])
def login(request):
    """Login with email and password. Returns user profile."""
    data = request.data
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return Response({"detail": "email and password required"}, status=status.HTTP_400_BAD_REQUEST)

    # Authenticate using username (Django default), but we store email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    # Check password
    if not user.check_password(password):
        return Response({"detail": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    # Determine if user is a host/vendor and include host_profile_id
    host_profile = HostProfile.objects.filter(user=user).first()

    profile = {
        "id": user.id,
        "email": user.email,
        "name": user.first_name or user.username,
        "role": "HOST" if host_profile else "USER",
        "host_profile_id": host_profile.id if host_profile else None,
        "home_location": {
            "address": "",
            "lat": None,
            "lng": None,
        }
    }

    return Response(profile, status=status.HTTP_200_OK)


@api_view(["POST"])
def signup_user(request):
    """Create a normal user (customer). Expects: name, email, password, address, lat, lng (optional)."""
    data = request.data
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    address = data.get("address")
    lat = data.get("lat")
    lng = data.get("lng")

    if not email or not password:
        return Response({"detail": "email and password required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"detail": "user with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    username = email.split("@")[0]
    user = User.objects.create_user(username=username, email=email, password=password, first_name=(name or ""))

    profile = {
        "id": user.id,
        "email": user.email,
        "name": user.first_name or username,
        "role": "USER",
        "host_profile_id": None,
        "home_location": {
            "address": address or "",
            "lat": lat,
            "lng": lng,
        }
    }

    return Response(profile, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def signup_host(request):
    """Create a host (vendor): creates User and HostProfile. Expects: name, email, password, phone_number, bio, category (name or id), address, latitude, longitude."""
    data = request.data
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone_number")
    bio = data.get("bio")
    category_name = data.get("category")
    address = data.get("address")
    lat = data.get("latitude")
    lng = data.get("longitude")

    if not email or not password:
        return Response({"detail": "email and password required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"detail": "user with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        username = email.split("@")[0]
        with transaction.atomic():
            user = User.objects.create_user(username=username, email=email, password=password, first_name=(name or ""))

            # resolve category
            category_obj = None
            if category_name:
                try:
                    # try by id (allow int or string)
                    category_obj = Category.objects.get(id=category_name)
                except Exception:
                    try:
                        category_obj = Category.objects.get(name=category_name)
                    except Exception:
                        category_obj = None

            # Ensure phone is None or string
            phone_val = phone if phone not in (None, "") else None

            host = HostProfile.objects.create(user=user, phone_number=phone_val, bio=(bio or ""), category=category_obj)

            resp = {
                "id": user.id,
                "email": user.email,
                "name": user.first_name or username,
                "role": "HOST",
                "host_profile_id": host.id,
                "business_location": {
                    "address": address or "",
                    "lat": lat,
                    "lng": lng,
                }
            }

            return Response(resp, status=status.HTTP_201_CREATED)
    except Exception as e:
        # If creation failed, attempt to cleanup partially created user
        try:
            if 'user' in locals() and user and user.id:
                user.delete()
        except Exception:
            pass
        tb = traceback.format_exc()
        return Response({"detail": "Server error during host signup", "error": str(e), "trace": tb}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


@api_view(["GET"])
def export_all(request):
    """Return all categories, host profiles and listings as JSON."""
    categories = Category.objects.all()
    hosts = HostProfile.objects.all()
    listings = Listing.objects.all()

    cat_ser = CategorySerializer(categories, many=True)
    host_ser = HostProfileSerializer(hosts, many=True)
    list_ser = ListingSerializer(listings, many=True).data

    # Enrich listings with host display name for frontend convenience
    enriched = []
    for raw, obj in zip(list_ser, listings):
        host_user = obj.host.user
        host_name = host_user.first_name or host_user.username
        raw["host_name"] = host_name
        enriched.append(raw)

    return Response({
        "categories": cat_ser.data,
        "hosts": host_ser.data,
        "listings": enriched,
    })