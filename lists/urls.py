from django.contrib import admin
from django.urls import path
from lists import views

urlpatterns = [
    path('new', views.new_list, name='new_list'),
    path('<slug:list_slug>/', views.list_detail, name='list_detail'),
    path('api/create/', views.ajax_create_view, name="create_todo"),
    path('api/delete/<int:item_id>/', views.ajax_delete_view, name="delete_todo"),
]
