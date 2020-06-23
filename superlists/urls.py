"""superlists URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
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
from django.urls import path, include
from lists import views as list_views, urls as list_urls
from user import urls as user_urls
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # home page
    path('', list_views.home_page, name='home'),

    # static pages
    path('about', TemplateView.as_view(template_name='about.html'), name='about'),
    path('terms', TemplateView.as_view(template_name='terms_of_service.html'), name='terms_of_service'),
    path('privacy', TemplateView.as_view(template_name='privacy_policy.html'), name='privacy_policy'),

    # list pages
    path('lists/', include(list_urls)),

    # account auth pages
    path('account/', include(user_urls)),
]