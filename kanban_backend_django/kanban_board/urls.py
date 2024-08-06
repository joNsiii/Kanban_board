from django.contrib import admin
from django.urls import path
from api.views import LoginView, LogoutView, RegisterUserView, TodoItemView, UserListView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterUserView.as_view()),
    path('login/', LoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('todo/', TodoItemView.as_view()),
    path('users/', UserListView.as_view()),
    path('todo/<int:pk>/', TodoItemView.as_view(), name='todo-detail-update'),
]
