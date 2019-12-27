from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Item, List
from django.core.exceptions import ValidationError


# Create your views here.
def home_page(request):
    return render(request, 'home.html')

def view_list(request, list_id):
    list_ = List.objects.get(id=list_id)
    if request.method == 'POST':
        Item.objects.create(text=request.POST['item_text'], list=list_)
        return redirect(f'/lists/{list_.id}/')
    context = {
        'list': list_
    }
    return render(request, 'list.html', context)

def new_list(request):
    list_ = List.objects.create()
    new_item_text = request.POST['item_text']
    item = Item.objects.create(text=new_item_text, list=list_)
    try:
        item.full_clean()
        item.save()
    except ValidationError:
        list_.delete()
        error = "You can't have an empty list item"
        context = {
            'error': error
        }
        return render(request, 'home.html', context)
    return redirect(f'/lists/{list_.id}/')

