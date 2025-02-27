# Generated by Django 5.0.7 on 2024-08-03 15:47

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_todoitem_category'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='todoitem',
            name='description',
            field=models.CharField(default='', max_length=500),
        ),
        migrations.AlterField(
            model_name='todoitem',
            name='category',
            field=models.CharField(default='todo', max_length=15),
        ),
        migrations.AlterField(
            model_name='todoitem',
            name='created_at',
            field=models.DateField(default=datetime.date(2024, 8, 3)),
        ),
        migrations.AlterField(
            model_name='todoitem',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creator', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='todoitem',
            name='priority',
            field=models.CharField(default='low', max_length=4),
        ),
        migrations.DeleteModel(
            name='KanbanBoard',
        ),
    ]
