from django.contrib import admin
from .models import UserProfile,GitHubTokens
# Register your models here.
admin.site.register(UserProfile)
admin.site.register(GitHubTokens)