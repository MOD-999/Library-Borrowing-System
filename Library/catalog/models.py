from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=150)
    category = models.CharField(max_length=50)
    is_available = models.BooleanField(default=True)

