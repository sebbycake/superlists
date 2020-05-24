from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import Item

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'

        validators = [
            UniqueTogetherValidator(
                queryset=Item.objects.all(),
                fields=['text', 'list',],
                message="This item already exists in your list",
            )
        ]

    def validate_text(self, value):
        value = value.lower()
        return value