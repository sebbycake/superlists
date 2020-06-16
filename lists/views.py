from django.shortcuts import render, redirect, get_object_or_404
from .forms import ListForm, ItemForm
from .models import Item, List
from django.contrib.auth.decorators import login_required
from django.views.generic.base import TemplateView

# DRF API
from .serializers import ItemSerializer, ListSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.


def home_page(request):
    return render(request, 'lists/home.html', {'form': ListForm()})

def list_detail(request, list_id, list_slug):
    try:
        list_ = List.objects.get(id=list_id)
    except List.DoesNotExist:
        return render(request, 'http404.html')

    # check whether the todo belongs to the list by the current auth user
    # if it does, display todo form and delete button
    if request.user.is_authenticated:
        # auth user can remove his own todos 
        exists = List.objects.filter(pk=list_id).filter(user=request.user).exists()
        # and also remove non-auth todos
        if not exists:
            exists = List.objects.filter(pk=list_id).filter(user=None).exists()
    else:
        # non auth user can remove non-auth user todos
        exists = List.objects.filter(pk=list_id).filter(user=None).exists()
    form = ItemForm()
    context = {
        'list': list_,
        'form': form,
        'exists': exists,
    }
    return render(request, 'lists/list.html', context)

@login_required
def user_list_detail(request):
    lists = List.objects.filter(user=request.user)
    context = {
        'lists': lists
    }
    return render(request, 'lists/user_list_detail.html', context)


@api_view(['GET'])
def ajax_list_find(request):
    """
    Check for unique together for list name and user
    """
    name = request.GET.get('name' or None)
    if request.user.is_authenticated:
        is_taken = List.objects.filter(name__iexact=name).filter(user=request.user).exists()
    else: 
        is_taken = List.objects.filter(name__iexact=name).filter(user=None).exists()
    data = {
        'is_taken': is_taken
    }
    return Response(data, status=200)


@api_view(['POST'])
def ajax_list_create_view(request):
    # deserialize request.POST object
    serializer = ListSerializer(data=request.POST)
    if serializer.is_valid(raise_exception=True):
        if request.user.is_authenticated:
            serializer.save(user=request.user)
        else:
            serializer.save()
        return Response(serializer.data, status=201)
    return Response({"message": "Duplicate list name"}, status=400)


@api_view(['POST'])
def ajax_create_view(request):
    # deserialize request.POST object
    serializer = ItemSerializer(data=request.POST)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data, status=201)
    return Response({"message": "Duplicate item in list"}, status=400)


@api_view(['DELETE', 'POST'])
def ajax_delete_view(request, item_id):
    item = Item.objects.filter(pk=item_id)
    if not item.exists():
        return Response({}, status=404)
    item = item.first()
    item.delete()
    return Response({"message": "TODO is removed."}, status=200)


@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def ajax_delete_list_view(request, list_id):
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