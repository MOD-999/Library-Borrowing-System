from django.urls import path
from .views import BookListCreateAPI, BookDetailAPI, CurrentUserView

urlpatterns = [
    path("books/", BookListCreateAPI.as_view(), name="book-list-create"),
    path("books/<int:pk>/", BookDetailAPI.as_view(), name="book-detail"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
]