from django.urls import path
from user import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('register/', views.UserCreate.as_view(), name='user_create'),
    path('login/', auth_views.LoginView.as_view(template_name='user/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='user/logout.html'), name='logout'),
]
