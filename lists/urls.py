from django.contrib import admin
from django.urls import path
from lists import views

urlpatterns = [
    path('api/list/find/', views.ajax_list_find, name='find_list_name'),
    path('api/list/create/', views.ajax_list_create_view, name='new_list'),
    path('<int:list_id>/<slug:list_slug>/', views.list_detail, name='list_detail'),
    path('api/todo/create/', views.ajax_create_view, name="create_todo"),
    path('api/todo/delete/<int:item_id>/', views.ajax_delete_view, name="delete_todo"),
    path('user/', views.user_list_detail, name='user_list_detail'),
    path('api/list/delete/<int:list_id>/', views.ajax_delete_list_view, name='delete_list'),
]
