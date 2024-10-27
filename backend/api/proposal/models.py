from django.db import models

from backend.models import BaseModel


class Tag(BaseModel):
    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        ordering = ('name',)

    name = models.CharField(
        verbose_name='Name',
        max_length=28
    )


class Proposal(BaseModel):
    class Meta:
        verbose_name = 'Proposal'
        verbose_name_plural = 'Proposals'
        ordering = ('-updated_at',)

    title = models.CharField(
        verbose_name='Title',
        max_length=100
    )
    description = models.TextField(
        verbose_name='Description',
        max_length=500
    )
