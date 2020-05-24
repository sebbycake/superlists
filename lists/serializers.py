from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator
from .models import Item, List


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'

        validators = [
            UniqueTogetherValidator(
                queryset=Item.objects.all(),
                fields=['text', 'list', ],
                message="This item already exists in your list",
            )
        ]

    def validate_text(self, value):
        value = value.lower()
        return value


class ListSerializer(serializers.ModelSerializer):

    slug = serializers.SlugField(
        max_length=100,
        validators=[
            UniqueValidator(
                queryset=List.objects.all(),
                lookup='iexact',
                message='This name already exists!'
            )
        ]
    )

    class Meta:
        model = List
        fields = '__all__'
