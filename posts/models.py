from django.db import models
from accounts.models import User
# Create your models here.

class Post(models.Model):
    STATUS_CHOICE = [
    ('pending',  'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
]
    
    author = models.ForeignKey(User, on_delete=models.CASCADE,related_name='posts')
    image = models.ImageField(upload_to='media/',null=True, blank=True)
    content = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICE,default='pending')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'posts'
        ordering = ['-created_at']
    
  
    def __str__(self):
        return f"{self.author.username} | {self.status} | {self.created_at.date()}"