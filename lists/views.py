from django.shortcuts import render
from .forms import ListForm, ItemForm
from .models import Item, List
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from datetime import datetime
from user.models import CustomUser

# send email with dynamic html message
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

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
    shared_user_exists = False
    non_user_exists = List.objects.filter(
        id=list_id).filter(user=None).exists()
    if request.user.is_authenticated:
        user_exists = List.objects.filter(
            id=list_id).filter(user=request.user).exists()
        shared_user_exists = list_.shared_users.filter(
            id=request.user.id).exists()
    form = ItemForm()
    context = {
        'list': list_,
        'form': form,
        'non_user_exists': non_user_exists,
        'user_exists': user_exists,
        'shared_user_exists': shared_user_exists,
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ajax_share_list_view(request, list_id):
    """
    API view to share list with other users to edit
    """
    list_ = List.objects.filter(pk=list_id)
    if list_.exists():
        # check that the list belongs to the current auth user
        if list_.filter(user=request.user):
            list_ = list_.first()
            user_email = request.POST['user_email']
            shared_user = CustomUser.objects.filter(email__exact=user_email)
            # checks that the shared_user with the given email exists
            if shared_user.exists():
                shared_user = shared_user.first()
                # checks that the new shared user is not the owner himself
                if shared_user is not list_.user:
                    # checks that new shared user is not in the current list
                    if shared_user not in list_.shared_users.all():
                        # add shared_user to shared_users m2m field
                        list_.shared_users.add(shared_user)
                        list_.save()
                        
                        # send email
                        subject = f'[SimpleList] {list_.name} - Invitation to edit'
                        html_message = render_to_string('lists/invitation_to_edit.html', {'user': list_.user, 'list': list_})
                        plain_message = strip_tags(html_message)
                        from_email = 'listeefy@gmail.com'
                        send_mail(subject, plain_message, from_email, [user_email], html_message=html_message)

                        return Response({"user_email": user_email, "user_id": shared_user.id}, status=200)
                    else:
                        return Response({"message": "User is already in the shared list."}, status=400)
                else:
                    return Response({"message": "You can't add the owner of the list"}, status=400)
            else:
                return Response({"message": "User with this email is not found"}, status=404)
        else:
            return Response({"message": "You are not authorized to remove this."}, status=403)
    return Response({}, status=404)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def ajax_share_list_delete_view(request, list_id):
    """
    API view to remove shared users
    """
    shared_user_id = request.POST['user_id']
    list_ = List.objects.get(id=list_id)
    shared_user = CustomUser.objects.get(id=shared_user_id)
    list_.shared_users.remove(shared_user)
    return Response({"message": "success"}, status=200)


# ------------------------
# create, update and delete items views

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

@api_view(['UPDATE', 'POST'])
def ajax_item_update_view(request, item_id):
    """
    API view to update item on a list
    """
    item = Item.objects.filter(pk=item_id)
    item_text = request.POST['text']
    if not item.exists():
        return Response({}, status=404)
    item = item.first()
    # update item's text
    item.text = item_text
    item.save()
    return Response({"message": "Item is updated."}, status=200)

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
    return Response({"message": "Item is removed."}, status=200)

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
