from django.contrib import admin
from .models import News
from .models import Reporter


@admin.register(Reporter)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'good', 'bad', 'star']  # display 리스트 지정


@admin.register(News)
class LabelAdmin(admin.ModelAdmin):
    list_display = ['id', 'url', 'reporter', 'good', 'bad', 'created_at', 'updated_at']  # display 리스트 지정