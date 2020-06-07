from django.shortcuts import render, redirect, get_object_or_404
from .forms import ListForm, ItemForm
from .models import Item, List
from django.contrib.auth.decorators import login_required

# DRF API
from .serializers import ItemSerializer, ListSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.


def home_page(request):
    return render(request, 'lists/home.html', {'form': ListForm()})


def list_detail(request, list_id, list_slug):
    try:
        list_ = List.objects.get(id=list_id)
    except List.DoesNotExist:
        return render(request, 'http404.html')
    form = ItemForm()
    context = {
        'list': list_,
        'form': form
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
    name = request.GET.get('name' or None)
    data = {
        'is_taken': List.objects.filter(name__iexact=name).exists()
    }
    return Response(data, status=200)


@api_view(['POST'])
def ajax_list_create_view(request):
    # deserialize request.POST object
    print('inside create view', flush=True)
    serializer = ListSerializer(data=request.POST)
    print(serializer, flush=True)
    print(serializer.is_valid())
    print(serializer.errors)
    if serializer.is_valid(raise_exception=True):
        print('inside is valid', flush=True)
        print(request.user.id)
        serializer.save(user=request.user or None)
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
    # retrieve the obj from the QuerySet
    item = item.first()
    item.delete()
    return Response({"message": "TODO is removed."}, status=200)
