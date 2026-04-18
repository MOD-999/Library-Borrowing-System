"""
URL configuration for Library project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('api/auth/token/', obtain_auth_token, name='api-token-auth'),
    path('api/catalog/', include("catalog.urls")), #http://127.0.0.1:8000/api/catalog/
    path('api/loans/', include("loans.urls")), #http://127.0.0.1:8000/api/loans/
    path('api/user/', include("user.urls")),   #http://127.0.0.1:8000/api/user/
    path('admin/', admin.site.urls),           #http://127.0.0.1:8000/admin/
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
