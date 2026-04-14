from django.shortcuts import render
from rest_framework import generics,permissions
from .models import BorrowRequest, statusChoices
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
        if instance.status == statusChoices.A:            
            book = instance.book
            book.is_available = False
            book.save()