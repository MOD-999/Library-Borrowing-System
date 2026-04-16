from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=150)
    category = models.CharField(max_length=150)
    image = models.ImageField(upload_to="book_images/", blank=True, null=True)
    description = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)

