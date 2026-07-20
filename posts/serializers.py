from rest_framework import serializers
from .models import Post


class PostCreateSerializer(serializers.ModelSerializer):
    """Used when creating a new post."""

    class Meta:
        model  = Post
        fields = ['id', 'content', 'image']

    def create(self, validated_data):
        # author is injected from request.user in the view
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class PostUpdateSerializer(serializers.ModelSerializer):
    """Used when editing an existing post."""

    class Meta:
        model  = Post
        fields = ['content', 'image']

    def update(self, instance, validated_data):
        # if post was approved and user edits it, reset to pending for re-review
        if instance.status == 'approved':
            validated_data['status'] = 'pending'
        return super().update(instance, validated_data)


class PostSerializer(serializers.ModelSerializer):
    """Used for reading/displaying posts."""

    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model  = Post
        fields = [
            'id',
            'author_username',
            'content',
            'image',
            'status',
            'created_at',
            'updated_at',
        ]