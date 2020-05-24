from django.shortcuts import render, redirect, get_object_or_404
from .forms import ListForm, ItemForm
from .models import Item, List

# DRF API
from .serializers import ItemSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.


def home_page(request):
    return render(request, 'home.html', {'form': ListForm()})


def new_list(request):
    form = ListForm(data=request.POST)
    if form.is_valid():
        list_ = form.save()
        return redirect(list_)
    else:
        return render(request, 'home.html', {'form': form})


def list_detail(request, list_slug):
    list_ = get_object_or_404(List, slug=list_slug)
    form = ItemForm()
    context = {
        'list': list_,
        'form': form
    }
    return render(request, 'list.html', context)


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
