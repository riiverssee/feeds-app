from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display  = ['username', 'email', 'role', 'is_active', 'is_staff']
    list_filter   = ['role', 'is_active', 'is_staff']
    search_fields = ['username', 'email']
    ordering      = ['-created_at']

    fieldsets = (
        (None,           {'fields': ('username', 'password')}),
        ('Personal',     {'fields': ('email', 'phone_number')}),
        ('Role',         {'fields': ('role',)}),
        ('Permissions',  {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified')}),
        ('Timestamps',   {'fields': ('created_at', 'updated_at')}),
    )
    readonly_fields = ['created_at', 'updated_at']

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone_number', 'role', 'password1', 'password2'),
        }),
    )