# Generated by Django 5.1.2 on 2024-11-07 14:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_usermatch_state'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='proposal',
            name='description',
        ),
        migrations.RemoveField(
            model_name='proposal',
            name='title',
        ),
    ]
