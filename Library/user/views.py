from .serializer import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import status
from django.contrib.auth.models import User

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

class RegisterView(APIView):
    permission_classes=[permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data ,status=status.HTTP_201_CREATED)
        return Response(serializer.errors ,status=status.HTTP_400_BAD_REQUEST)
    
class CheckUsernameView(APIView):
    permission_classes= [permissions.AllowAny]

    def get(self, request):
        username = request.query_params.get('username', '')
        exists = User.objects.filter(username=username).exists()
        return Response({'exists': exists})

