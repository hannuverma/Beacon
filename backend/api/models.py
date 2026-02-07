from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField


class Category(models.Model):
    NAME_CHOICES = [
        ('musical', 'Musical'),
        ('dance', 'Dance'),
        ('art', 'Art'),
        ('shop', 'Shop'),
        ('service', 'Service'),
    ]
    name = models.CharField(max_length=50, choices=NAME_CHOICES)
    icon_url = models.URLField(blank=True) # For custom map pins

    def __str__(self):
        return self.name

class HostProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = PhoneNumberField(blank=False, null=True, unique=True)
    bio = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.category}"

class Listing(models.Model):
    LISTING_TYPES = [('event', 'Event'), ('service', 'Service')]
    
    host = models.ForeignKey(HostProfile, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    listing_type = models.CharField(max_length=10, choices=LISTING_TYPES)
    
    # Location Data
    # PointField stores (longitude, latitude)
    latitude = models.FloatField(help_text="Latitude for map pin")
    longitude = models.FloatField(help_text="Longitude for map pin")
    address = models.CharField(max_length=255)
    
    # Timing (Events have dates; services might have 'hours')
    event_date = models.DateTimeField(null=True, blank=True)
    booking_link = models.URLField()
    image = models.ImageField(upload_to='listings/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title