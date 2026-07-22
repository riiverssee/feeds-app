from rest_framework.views       import APIView
from rest_framework.response    import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework             import status
from rest_framework_simplejwt.tokens     import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
import traceback


from .models       import User
from .serializers  import (
    SignupSerializer,
    LoginSerializer,
    UserDetailSerializer,
)
from .permissions  import IsAdminUser

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }


# ─────────────────────────────────────────
# 1. SIGNUP
# ─────────────────────────────────────────

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        return Response({
          'message': 'Account created successfully.',
           'tokens': get_tokens_for_user(user),
            'user': {
                'id':           user.id,
                'username':     user.username,
                'email':        user.email,
                'phone_number': user.phone_number,
                'role':         user.role,
            }
        }, status=status.HTTP_201_CREATED)

# class SignUpView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         try:
#             serializer = SignupSerializer(data=request.data)

#             if not serializer.is_valid():
#                 return Response(serializer.errors, status=400)

#             user = serializer.save()

#             return Response({
#                 "message": "Account created successfully.",
#                 "tokens": get_tokens_for_user(user),
#             }, status=201)

#         except Exception as e:
#             return Response({
#                 "error": str(e),
#                 "traceback": traceback.format_exc(),
#             }, status=500)



# ─────────────────────────────────────────
# 4. LOGIN
# ─────────────────────────────────────────

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']

        return Response({
            'message': 'Login successful.',
            'tokens':  get_tokens_for_user(user),
            'user': {
                'id':           user.id,
                'username':     user.username,
                'email':        user.email,
                'phone_number': user.phone_number,
                'role':         user.role,
            }
        }, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# 5. LOGOUT
# ─────────────────────────────────────────

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {'error': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {'message': 'Logged out successfully.'},
            status=status.HTTP_200_OK
        )


# ─────────────────────────────────────────
# 6. ADMIN — ALL USERS
# ─────────────────────────────────────────

class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users      = User.objects.all().order_by('-created_at')
        serializer = UserDetailSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# 7. ADMIN — BLOCK / UNBLOCK USER
# ─────────────────────────────────────────

class AdminBlockUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        user.is_active = not user.is_active
        user.save()

        return Response({
            'message': f"User {'unblocked' if user.is_active else 'blocked'} successfully.",
            'is_active': user.is_active
        }, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# 8. ADMIN — DELETE USER
# ─────────────────────────────────────────

class AdminDeleteUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        user.delete()
        return Response(
            {'message': 'User deleted successfully.'},
            status=status.HTTP_200_OK
        )