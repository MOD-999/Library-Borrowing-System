from django.urls import path
from .views import BorrowListCreateAPI, BorrowDetailAPI

urlpatterns = [
    path("requests/", BorrowListCreateAPI.as_view(), name="request_list_create"),
    path("requests/<int:pk>/", BorrowDetailAPI.as_view(), name="request_detail"),
]