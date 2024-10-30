from django.db import models


class UserGoalType(models.IntegerChoices):
    COLLABORATOR = 1, 'Collaborator'
    COLLABORATION = 2, 'Collaboration'


class TagCategory(models.IntegerChoices):
    TYPE = 1, 'Type'
    TECHNO = 2, 'Techno'
    CONTRAT = 3, 'Contrat'


class UserMatchState(models.IntegerChoices):
    MATCHED = 1, 'Matched'
    DISMATCHED = 2, 'Dismatched'
    MAYBE = 3, 'Maybe'
