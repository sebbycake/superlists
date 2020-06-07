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

    def validate_text(self, value):
        value = value.lower()
        return value


class ListSerializer(serializers.ModelSerializer):

    # name = serializers.CharField(
    #     max_length=63,
    #     validators=[
    #         UniqueValidator(
    #             queryset=List.objects.all(),
    #             lookup='iexact',
    #             message='This name already exists!'
    #         )
    #     ]
    # )

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

