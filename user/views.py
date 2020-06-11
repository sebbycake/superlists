from django.views.generic import CreateView
from django.urls import reverse_lazy
from .models import CustomUser
from .forms import CustomUserCreationForm

from django.contrib.auth.views import (LoginView, LogoutView, 
    PasswordChangeView, PasswordChangeDoneView, 
    PasswordResetView, PasswordResetDoneView, 
    PasswordResetConfirmView, PasswordResetCompleteView)

# Create your views here.

# user registration
class UserCreate(CreateView):
    model = CustomUser
    form_class = CustomUserCreationForm
    template_name = 'user/register.html'
    success_url = reverse_lazy('login')


# -------------------------------------------


# user authentication
class LoginView(LoginView):
    template_name = 'user/login.html'

class LogoutView(LogoutView):
    template_name = 'user/logout.html'


# -------------------------------------------


# password change    
class PasswordChangeView(PasswordChangeView):
    template_name = 'user/password_change_form.html'

class PasswordChangeDoneView(PasswordChangeDoneView):
    template_name = 'user/password_change_done.html'


# -------------------------------------------

# password reset
class PasswordResetView(PasswordResetView):
    template_name = 'user/password_reset_form.html'
    subject_template_name = 'user/password_reset_subject.txt'
    email_template_name = 'user/password_reset_email.html'    

class PasswordResetDoneView(PasswordResetDoneView):
    template_name = 'user/password_reset_done.html'

class PasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'user/password_reset_confirm.html'

class PasswordResetCompleteView(PasswordResetCompleteView):
    template_name = 'user/password_reset_complete.html'
