from django.contrib import admin
from .models import Team,TeamMembers,TeamInvite
# Register your models here.

admin.site.register(Team)
admin.site.register(TeamMembers)
admin.site.register(TeamInvite)