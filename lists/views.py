from django.shortcuts import render, redirect, get_object_or_404
from .forms import ListForm, ItemForm, ExistingListItemForm
from .models import Item, List
from django.core.exceptions import ValidationError

# Create your views here.
def home_page(request):
    return render(request, 'home.html', {'form': ListForm()})

def view_list(request, list_slug):
    list_ = List.objects.get(slug=list_slug)
    form = ExistingListItemForm(for_list=list_)
    if request.method == 'POST':
        form = ExistingListItemForm(for_list=list_, data=request.POST)
        if form.is_valid():
            form.save()
            return redirect(list_)
    return render(request, 'list.html', {'list': list_, 'form': form})


def new_list(request):
    form = ListForm(data=request.POST)
    if form.is_valid():
        list_ = form.save()
        return redirect(list_)
    else:
        return render(request, 'home.html', {'form': form})

def delete_todo(request, item_id):
    todo = get_object_or_404(Item, id=item_id)
    list_ = get_object_or_404(List, id=todo.list.id)
    if request.method == 'POST':
        todo.delete()
        return redirect(list_)
    return render(request, 'list.html')