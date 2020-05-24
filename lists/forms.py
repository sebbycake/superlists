from django import forms
from .models import Item, List
from django.core.exceptions import ValidationError

EMPTY_ITEM_ERROR = "You can't have an empty list item"

DUPLICATE_ITEM_ERROR = "You've already got this in your list"


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
                    'placeholder': 'Enter a to-do item',
                    'class': 'form-control input-lg',
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


# class ExistingListItemForm(ItemForm):

#     def __init__(self, for_list, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.instance.list = for_list

#     def clean_text(self):
#         text = self.cleaned_data['text']
#         return text.lower()

#     def validate_unique(self):
#         try:
#             self.instance.validate_unique()
#         except ValidationError as e:
#             e.error_dict = {'text': [DUPLICATE_ITEM_ERROR]}
#             self._update_errors(e)

#     def save(self):
#         return forms.models.ModelForm.save(self)
