from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created Time',
        help_text='Datetime of creation of this record.',
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated Time',
        help_text='Datetime of last update of this record.',
    )
    deleted_at = models.DateTimeField(
        null=True,
        verbose_name='Deleted Time',
        help_text='Datetime of deletion of this record.'
        ' null mean "not deleted".',
    )

    class Meta:
        abstract=True
