from rest_framework import serializers
from .models import Contact, TodoItem
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
        )
        return user

        
class TodoItemSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source='creator.username')
    created_at = serializers.ReadOnlyField()
    assigned_users = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = TodoItem
        fields = '__all__'

    def create(self, validated_data):
        assigned_usernames = self.context['request'].data.get('assigned_users', [])
        user = self.context['request'].user
        assigned_users = User.objects.filter(username__in=assigned_usernames)
        todo = TodoItem.objects.create(**validated_data, creator=user)
        todo.assigned_users.set(assigned_users)
        return todo

    def update(self, instance, validated_data):
        assigned_usernames = self.context['request'].data.get('assigned_users', [])
        assigned_users = User.objects.filter(username__in=assigned_usernames)
        instance = super().update(instance, validated_data)
        instance.assigned_users.set(assigned_users)
        return instance
    

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id','contact_username', 'contact_email', 'contact_phone' ]

    def create(self, validated_data):
        contact_username = validated_data.pop('contact_username')
        user = User.objects.get(username=contact_username)
        if user:
            contact = Contact.objects.create(contact_username=contact_username, **validated_data)
            return contact
        return serializers.ValidationError("User does not exist.")
    
    def update(self, instance, validated_data):
        contact_username = validated_data.get('contact_username', instance.contact_username)
        instance.contact_username = contact_username
        
        instance.contact_email = validated_data.get('contact_email', instance.contact_email)
        instance.contact_phone = validated_data.get('contact_phone', instance.contact_phone)
        
        instance.save()
        return instance