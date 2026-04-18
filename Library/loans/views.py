from django.shortcuts import render
from rest_framework import generics,permissions
from .models import BorrowRequest
from .serializer import BorrowRequestSerializer
from rest_framework.permissions import BasePermission
# Create your views here.

class IsStaffForUpdate(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ["PUT","PATCH"]: # only staff can update (PUT/PATCH)
            return request.user.is_staff
        return obj.user == request.user or request.user.is_staff #owner can view and delete

class BorrowListCreateAPI (generics.ListCreateAPIView):
    serializer_class = BorrowRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return BorrowRequest.objects.all()
        return BorrowRequest.objects.filter(user = self.request.user)

    def perform_create(self, serializer):
        return serializer.save(user = self.request.user)
    
class BorrowDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BorrowRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffForUpdate]

    def get_queryset(self):
        if self.request.user.is_staff:
            return BorrowRequest.objects.all()
        return BorrowRequest.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save()
        book = instance.book
        
        # If Approved, mark book as unavailable and reject other pending requests
        if instance.status == "Approved":            
            book.is_available = False
            book.save()
            # Reject all other pending requests for this book
            BorrowRequest.objects.filter(
                book=book,
                status="Pending"
            ).exclude(id=instance.id).update(status="Rejected")
        # If Rejected, make book available again
        elif instance.status == "Rejected":
            # Check if there are any other approved requests for this book
            approved_count = BorrowRequest.objects.filter(
                book=book,
                status="Approved"
            ).count()
            # Only make available if no approved requests exist
            if approved_count == 0:
                book.is_available = True
                book.save()