from django.contrib import admin
from .models import  TodoItem

# Register your models here.

# @admin.register(KanbanBoard)
# class KanbanBoardAdmin(admin.ModelAdmin):
#     list_display = ('title', 'creator', 'created_at')
#     search_fields = ('title', 'creator__username')
    
admin.site.register(TodoItem)
