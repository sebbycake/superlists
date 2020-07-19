from django.contrib import admin
from django.urls import path
from lists import views

urlpatterns = [

    # list detail views
    path('<int:list_id>/<slug:list_slug>/', views.list_detail, name='list_detail'),
    path('user/', views.user_list_detail, name='user_list_detail'),
    path('shared-with-me/', views.user_shared_lists_detail, name='user_shared_lists_detail'),

    # list api views
    path('api/list/find/', views.ajax_list_find, name='find_list_name'),
    path('api/list/create/', views.ajax_list_create_view, name='new_list'),
    path('api/list/delete/<int:list_id>/', views.ajax_delete_list_view, name='delete_list'),
    path('api/list/share/<int:list_id>/', views.ajax_share_list_view, name='share_list'),
    path('api/list/share/<int:list_id>/delete/', views.ajax_share_list_delete_view, name='share_list_delete'),

    # item api views
    path('api/item/create/', views.ajax_item_create_view, name="create_item"),
    path('api/item/update/<int:item_id>/', views.ajax_item_update_view, name='update_item'),
    path('api/item/delete/<int:item_id>/', views.ajax_item_delete_view, name="delete_item"),
    path('api/item/pin/<int:item_id>/', views.ajax_item_pin_view, name='pin_item'),
    
]
