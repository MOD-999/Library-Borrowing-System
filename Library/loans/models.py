from django.conf import settings
from django.db import models


# Create your models here.

class BorrowRequest(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    book = models.ForeignKey(
        "catalog.Book",
        on_delete=models.CASCADE,
        related_name="borrow_requests"
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="my_requests"
    )

    request_date = models.DateTimeField(auto_now_add=True)
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    def __str__(self):
        return f"{self.user.username} requested {self.book.title}"