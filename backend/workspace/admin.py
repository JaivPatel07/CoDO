from django.contrib import admin
from .models import WorkSpace,GroupMessage,WorkSpaceRepository
# Register your models here.

admin.site.register(WorkSpace)
admin.site.register(GroupMessage)
admin.site.register(WorkSpaceRepository)