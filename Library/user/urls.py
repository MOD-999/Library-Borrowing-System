from django.urls import path
from .views import CurrentUserView,RegisterView,CheckUsernameView

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("register/", RegisterView.as_view(), name="user-registration"),
    path("check-username/", CheckUsernameView.as_view(), name="check-username"),
]
