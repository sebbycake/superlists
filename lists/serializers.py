from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator
from .models import Item, List
from user.models import CustomUser

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'
        
    def validate(self, data):
        """
        Check for case insensitive unique together for text and list model fields
        """
        duplicate_exists = Item.objects.filter(text__iexact=data['text']).filter(list=data['list']).exists()
        if duplicate_exists:
            raise serializers.ValidationError('This item already exists in your list')
        return data
    

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

