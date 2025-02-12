# Generated by Django 5.1.2 on 2024-10-30 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_proposal_cv_file_proposal_video_file'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='proposal',
            name='cv_file',
        ),
        migrations.AddField(
            model_name='proposal',
            name='proposal_file',
            field=models.FileField(blank=True, help_text='Upload a proposal document related to this proposal.', null=True, upload_to='proposals/', verbose_name='Proposal File'),
        ),
    ]
