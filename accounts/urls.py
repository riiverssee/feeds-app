from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SignUpView,
    LoginView,
    LogoutView,
    AdminUsersView,
    AdminBlockUserView,
    AdminDeleteUserView,
)

urlpatterns = [

    # --- AUTH ---
    path('auth/register/',      SignUpView.as_view(),    name='register'),
    path('auth/login/',         LoginView.as_view(),     name='login'),
    path('auth/logout/',        LogoutView.as_view(),    name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # --- ADMIN ---
    path('admin/users/',                 AdminUsersView.as_view(),     name='admin-users'),
    path('admin/users/<int:pk>/block/',  AdminBlockUserView.as_view(), name='admin-block-user'),
    path('admin/users/<int:pk>/delete/', AdminDeleteUserView.as_view(),name='admin-delete-user'),
]