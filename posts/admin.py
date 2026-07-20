from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display  = ['author', 'status', 'created_at']
    list_filter   = ['status']
    search_fields = ['author__username', 'content']
    ordering      = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']