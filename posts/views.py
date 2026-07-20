from rest_framework.views       import APIView
from rest_framework.response    import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework             import status

from .models       import Post
from .serializers  import PostSerializer, PostCreateSerializer, PostUpdateSerializer
from .permissions  import IsOwner, IsAdminUser


# ─────────────────────────────────────────
# 1. CREATE POST
# ─────────────────────────────────────────

class PostCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PostCreateSerializer(data=request.data, context={'request': request})

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        post = serializer.save()

        return Response({
            'message': 'Post created successfully. Awaiting admin approval.',
            'post':    PostSerializer(post).data
        }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────
# 2. MY POSTS — own posts all statuses
# ─────────────────────────────────────────

class MyPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts      = Post.objects.filter(author=request.user)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# 3. OTHER USERS FEED — approved posts only
# ─────────────────────────────────────────

class OtherUsersFeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.filter(
            status='approved'
        ).exclude(
            author=request.user
        )
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# 4. UPDATE POST — author only
# ─────────────────────────────────────────

class PostUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def patch(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response(
                {'error': 'Post not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # check ownership
        self.check_object_permissions(request, post)

        serializer = PostUpdateSerializer(post, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        post = serializer.save()

        return Response({
            'message': 'Post updated successfully.' if post.status != 'pending'
                       else 'Post updated and sent for re-approval.',
            'post':    PostSerializer(post).data
        }, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# 5. DELETE POST — author only
# ─────────────────────────────────────────

class PostDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def delete(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response(
                {'error': 'Post not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, post)
        post.delete()

        return Response(
            {'message': 'Post deleted successfully.'},
            status=status.HTTP_200_OK
        )


# ─────────────────────────────────────────
# 6. ADMIN — ALL PENDING POSTS
# ─────────────────────────────────────────

class AdminPendingPostsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        posts      = Post.objects.filter(status='pending')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# 7. ADMIN — APPROVE POST
# ─────────────────────────────────────────

class AdminApprovePostView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response(
                {'error': 'Post not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if post.status == 'approved':
            return Response(
                {'error': 'Post is already approved.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        post.status = 'approved'
        post.save()

        return Response({
            'message': 'Post approved successfully.',
            'post':    PostSerializer(post).data
        }, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# 8. ADMIN — REJECT POST
# ─────────────────────────────────────────

class AdminRejectPostView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response(
                {'error': 'Post not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if post.status == 'rejected':
            return Response(
                {'error': 'Post is already rejected.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        post.status = 'rejected'
        post.save()

        return Response({
            'message': 'Post rejected.',
            'post':    PostSerializer(post).data
        }, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# 9. ADMIN — DELETE ANY POST
# ─────────────────────────────────────────

class AdminDeletePostView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response(
                {'error': 'Post not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        post.delete()

        return Response(
            {'message': 'Post deleted successfully.'},
            status=status.HTTP_200_OK
        )