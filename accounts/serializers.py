from rest_framework import serializers
from django.core.validators import RegexValidator
from .models import User


phone_validator = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Enter a valid phone number with country code. e.g. +919876543210"
)


class SignupSerializer(serializers.ModelSerializer):

    password         = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = [
            'username',
            'email',
            'phone_number',
            'role',
            'password',
            'confirm_password',
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('This username is already taken.')
        return value

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError('This phone number is already registered.')
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['role'] = 'user'    
        user = User.objects.create_user(
            username     = validated_data['username'],
            email        = validated_data['email'],
            phone_number = validated_data['phone_number'],
            role         = validated_data.get('role', 'user'),
            password     = validated_data['password'],
        )
        return user


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid username or password.')

        if not user.check_password(password):
            raise serializers.ValidationError('Invalid username or password.')

        if not user.is_active:
            raise serializers.ValidationError('Account is not active. Please verify your phone number.')

        data['user'] = user
        return data


class UserDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model  = User
        fields = [
            'id',
            'username',
            'email',
            'phone_number',
            'role',
            'is_active',
            'is_verified',
            'created_at',
        ]
        read_only_fields = fields