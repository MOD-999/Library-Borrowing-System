from .models import Book
from .serializer import BookSerializer
from rest_framework import generics,permissions

# Create your views here.

class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request,view):
        if request.method in permissions.SAFE_METHODS: 
            return True
        return request.user.is_staff


class BookListCreateAPI(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsStaffOrReadOnly]

class BookDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsStaffOrReadOnly]