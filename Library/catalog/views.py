from .models import Book
from .serializer import BookSerializer
from rest_framework import generics,permissions
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request):
        return Response(
            {
                'id': request.user.id,
                'username': request.user.username,
                'is_staff': request.user.is_staff,
            }
        )

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