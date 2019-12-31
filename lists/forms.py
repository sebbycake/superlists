from django import forms
from .models import Item

# class ItemForm(forms.Form):
#     item_text = forms.CharField(
#         widget=forms.fields.TextInput(
#             attrs={
#                 'placeholder': 'Enter a to-do item',
#                 'class': 'form-control input-lg',
#                 }
#         )
#     )

EMPTY_ITEM_ERROR = "You can't have an empty list item"

class ItemForm(forms.ModelForm):

    class Meta:
        model = Item
        fields = ('text',)
        widgets = {
            'text': forms.fields.TextInput(
                attrs = {
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