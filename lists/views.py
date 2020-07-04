from django.shortcuts import render
from .forms import ListForm, ItemForm
from .models import Item, List
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from datetime import datetime

# DRF API
from .serializers import ItemSerializer, ListSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.


def home_page(request):
    return render(request, 'lists/home.html', {'form': ListForm()})


def list_detail(request, list_id, list_slug):
    """
    Returns list detail of items
    Case 1:
        If user is not authenticated, he/she can add and delete item of non-auth list
    Case 2: 
        If user is authenticated, he/she can add and delete item of his/her own auth list AND non-auth list
    """
    try:
        # retrieving list object
        list_ = List.objects.get(id=list_id)
    except List.DoesNotExist:
        return render(request, 'http404.html')
    # setting permissions variables based on the cases
    user_exists = False
    non_user_exists = List.objects.filter(id=list_id).filter(user=None).exists()
    if request.user.is_authenticated:
        user_exists = List.objects.filter(id=list_id).filter(user=request.user).exists()
    form = ItemForm()
    context = {
        'list': list_,
        'form': form,
        'non_user_exists': non_user_exists,
        'user_exists': user_exists,
    }
    return render(request, 'lists/list.html', context)


@login_required
def user_list_detail(request):
    """
    Returns all lists by current authenticated user with pagination
    """
    user_lists = List.objects.filter(user=request.user)
    # show 5 lists per page
    paginator = Paginator(user_lists, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    page_range = paginator.page_range
    return render(request, 'lists/user_list_detail.html', {'page_obj': page_obj, 'page_range': page_range})


# ------------------------
# create and delete lists views

@api_view(['GET'])
def ajax_list_find(request):
    """
    Check for unique together for list name and user before creating list
    """
    name = request.GET.get('name' or None)
    if request.user.is_authenticated:
        is_taken = List.objects.filter(
            name__iexact=name).filter(user=request.user).exists()
    else:
        is_taken = List.objects.filter(
            name__iexact=name).filter(user=None).exists()
    data = {
        'is_taken': is_taken
    }
    return Response(data, status=200)


@api_view(['POST'])
def ajax_list_create_view(request):
    """
    API view to create list
    """
    # deserialize request.POST object
    serializer = ListSerializer(data=request.POST)
    if serializer.is_valid(raise_exception=True):
        if request.user.is_authenticated:
            serializer.save(user=request.user)
        else:
            serializer.save()
        return Response(serializer.data, status=201)
    return Response({"message": "Duplicate list name"}, status=400)


@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def ajax_delete_list_view(request, list_id):
    """
    API view to delete list 
    """
    list_ = List.objects.filter(pk=list_id)
    if list_.exists():
        # check that the list belongs to the current auth user
        if list_.filter(user=request.user):
            list_ = list_.first()
            list_.delete()
            return Response({"message": "List item is removed."}, status=200)
        else:
            return Response({"message": "You are not authorized to remove this."}, status=403)
    return Response({}, status=404)


# ------------------------
# create and delete items views

@api_view(['POST'])
def ajax_item_create_view(request):
    """
    API view to create item on a list
    """
    # deserialize request.POST object
    serializer = ItemSerializer(data=request.POST)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data, status=201)
    return Response({"message": "Duplicate item in list"}, status=400)


@api_view(['DELETE', 'POST'])
def ajax_item_delete_view(request, item_id):
    """
    API view to delete item on a list
    """
    item = Item.objects.filter(pk=item_id)
    if not item.exists():
        return Response({}, status=404)
    item = item.first()
    item.delete()
    return Response({"message": "TODO is removed."}, status=200)

@api_view(['POST'])
def ajax_item_pin_view(request, item_id):
    """
    API view to update item's is_pinned value
    """
    # retrieve item object
    item = Item.objects.get(id=item_id)
    # update is_pinned value
    item.is_pinned = not item.is_pinned
    # save the obj
    item.save()
    return Response({'is_pinned': item.is_pinned}, status=200)