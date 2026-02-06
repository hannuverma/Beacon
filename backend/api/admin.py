from django.contrib import admin
from .models import Category, HostProfile, Listing
# Register your models here.


admin.site.register(Category)
admin.site.register(HostProfile)
admin.site.register(Listing)
