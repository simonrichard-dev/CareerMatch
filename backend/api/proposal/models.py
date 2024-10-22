from django.db import models

from backend.models import BaseModel


class Tag(BaseModel):
    name = models.CharField(max_length=28)
