from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator
from .models import Item, List
from user.models import CustomUser

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


class ListSerializer(serializers.ModelSerializer):

    class Meta:
        model = List
        exclude = ('user',)

        # validators = [
        #     UniqueTogetherValidator(
        #         queryset=List.objects.all(),
        #         fields=['name', 'user', ],
        #         message="This list already exists.",
        #     )
        # ]

