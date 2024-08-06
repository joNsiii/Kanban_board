from rest_framework import serializers
from .models import TodoItem
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
    
    

# class KanbanBoardSerializer(serializers.ModelSerializer):
#     creator = serializers.ReadOnlyField(source='creator.username')
#     created_at = serializers.ReadOnlyField()
#     assigned_users = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    
#     class Meta:
#         model = KanbanBoard
#         fields = ['title', 'creator', 'assigned_users', 'created_at']
        
#     def create(self, validated_data):
#         user = self.context['request'].user
#         kanbanboard = KanbanBoard.objects.create(
#             title=validated_data['title'],
#             creator=user
#         ) 
#         return kanbanboard   
        
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
    
    