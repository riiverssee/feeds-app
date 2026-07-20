from django.urls import path
from .views import (
    PostCreateView,
    MyPostsView,
    OtherUsersFeedView,
    PostUpdateView,
    PostDeleteView,
    AdminPendingPostsView,
    AdminApprovePostView,
    AdminRejectPostView,
    AdminDeletePostView,
)

urlpatterns = [

    # --- USER ---
    path('posts/create/',        PostCreateView.as_view(),    name='post-create'),
    path('posts/my-posts/',      MyPostsView.as_view(),       name='my-posts'),
    path('posts/feed/',          OtherUsersFeedView.as_view(),name='feed'),
    path('posts/<int:pk>/update/',PostUpdateView.as_view(),   name='post-update'),
    path('posts/<int:pk>/delete/',PostDeleteView.as_view(),   name='post-delete'),

    # --- ADMIN ---
    path('admin/posts/pending/',              AdminPendingPostsView.as_view(), name='admin-pending-posts'),
    path('admin/posts/<int:pk>/approve/',     AdminApprovePostView.as_view(),  name='admin-approve-post'),
    path('admin/posts/<int:pk>/reject/',      AdminRejectPostView.as_view(),   name='admin-reject-post'),
    path('admin/posts/<int:pk>/delete/',      AdminDeletePostView.as_view(),   name='admin-delete-post'),
]