from django.views.generic import CreateView
from django.urls import reverse_lazy
from .models import CustomUser
from .forms import CustomUserCreationForm

# Create your views here.

class UserCreate(CreateView):
    model = CustomUser
    form_class = CustomUserCreationForm
    template_name = 'user/register.html'
    success_url = reverse_lazy('login')
