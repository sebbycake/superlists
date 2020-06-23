from django import forms
from .models import Item, List
from django.core.exceptions import ValidationError

EMPTY_ITEM_ERROR = "You can't have an empty list item"

class ListForm(forms.ModelForm):

    class Meta:
        model = List
        fields = ('name',)
        widgets = {
            'name': forms.fields.TextInput(
                attrs={
                    'placeholder': 'Create your unique list name!',
                    'class': 'form-control input-lg',
                }
            )
        }
        error_messages = {
            'name': {'required': EMPTY_ITEM_ERROR}
        }

    def clean_name(self):
        name = self.cleaned_data['name']
        return name.lower()


class ItemForm(forms.ModelForm):

    class Meta:
        model = Item
        fields = ('text',)
        widgets = {
            'text': forms.fields.TextInput(
                attrs={
                    'placeholder': 'Enter an item',
                    'class': 'todo_item',
                }
            )
        }
        error_messages = {
            'text': {'required': EMPTY_ITEM_ERROR}
        }

    # implement our custom save method to save item's list
    def save(self, for_list):
        self.instance.list = for_list
        return super().save()
