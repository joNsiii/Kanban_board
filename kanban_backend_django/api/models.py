import datetime
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class KanbanBoard(models.Model):
    title = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    assigned_users = models.ManyToManyField(User, related_name='assigned_users')
    created_at = models.DateField(default=datetime.date.today())

    def __str__(self):
        return self.title
    

class TodoItem(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('mid', 'Mid'),
        ('high', 'High'),
    ]
    CATEGORY_CHOICES = [
        ('todo', 'Todo'),
        ('in_progress', 'in Progress'),
        ('testing', 'Testing'),
        ('done', 'Done'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500, default='', blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='creator')
    assigned_users = models.ManyToManyField(User, blank=True)
    created_at = models.DateField(default=datetime.date.today())
    priority = models.CharField(max_length=4, choices=PRIORITY_CHOICES, default='low')
    category = models.CharField(max_length=15,choices=CATEGORY_CHOICES,default='todo')
    
    
    def __str__(self):
        return self.title
    
class Contact(models.Model):
    owner = models.ForeignKey(User, related_name='contact', on_delete=models.CASCADE)
    contact_username = models.CharField(max_length=255, default='')
    contact_email = models.EmailField(max_length=255, blank=True)
    contact_phone = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.owner.username} -> {self.contact_username}"
    

    