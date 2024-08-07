from django.shortcuts import get_object_or_404
from .models import Contact, TodoItem
from .serializer import  ContactSerializer, TodoItemSerializer
from rest_framework.response import Response
from rest_framework import status
from .serializer import UserSerializer
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import logout


# Create your views here.
class LoginView(ObtainAuthToken):
    def post(self, request):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
        })


class RegisterUserView(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
      authentication_classes = [TokenAuthentication]
      def get(self, request):
          if request.method == 'GET':
              users = User.objects.all()
              serializer = UserSerializer(users, many=True)
              return Response(serializer.data, status=status.HTTP_201_CREATED)


class TodoItemView(APIView):
    authentication_classes = [TokenAuthentication]  
    def post(self, request):
        if request.method == 'POST':
            serializer = TodoItemSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def get(self, request):
        if request.method == 'GET':
            todo = TodoItem.objects.all()
            serializer = TodoItemSerializer(todo, many=True)
            print(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def put(self, request, pk):
        todo_item = get_object_or_404(TodoItem, pk=pk)
        serializer = TodoItemSerializer(todo_item, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        if request.method == 'DELETE':
            todo_item = get_object_or_404(TodoItem, pk=pk)
            todo_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    
class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    def post(self, request):
        if request.method == 'POST':
            logout(request)
            return Response({'message': 'Logout successfully'}, status=status.HTTP_200_OK)
        

class ContactViewSet(APIView):
    authentication_classes = [TokenAuthentication]
    
    def get(self, request):
        contacts = Contact.objects.filter(owner=request.user)
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        contact = get_object_or_404(Contact, pk=pk)
        serializer = ContactSerializer(contact, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        if request.method == 'DELETE':
            contact = get_object_or_404(Contact, pk=pk)
            contact.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)