from rest_framework import generics
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from . import serializers
from .models import Profile, Post, Comment

class CreateUserView(generics.CreateAPIView):
  serializer_class = serializers.UserSerializer
  # For not JWT Auth allowed user to create new user 
  permission_classes = (AllowAny,)

class ProfileViewSet(viewsets.ModelViewSet):
  queryset = Profile.objects.all()
  serializer_class = serializers.ProfileSerializer

  # set Loggedin User to userProfile
  def perform_create(self, serializer):
      serializer.save(userProfile=self.request.user)

class MyProfileListView(generics.ListAPIView):
  queryset = Profile.objects.all()
  serializer_class = serializers.ProfileSerializer

  # get Loggedin User
  def get_queryset(self):
      return self.queryset.filter(userProfile=self.request.user)

class PostViewSet(viewsets.ModelViewSet):
  queryset = Post.objects.all()
  serializer_class = serializers.PostSerializer

  # set Loggedin User to userPost when User Posted
  def perform_create(self, serializer):
      serializer.save(userPost=self.request.user)
  
class CommentViewSet(viewsets.ModelViewSet):
  queryset = Comment.objects.all()
  serializer_class = serializers.CommentSerializer

  # set Loggedin User to userComment when User commented
  def perform_create(self, serializer):
      serializer.save(userComment=self.request.user)