from django.db import models


class UserGoalType(models.IntegerChoices):
    CV = 1, 'CV'
    ANNOUNCEMENT = 2, 'Announcement'


class ProposalType(models.IntegerChoices):
    CV = 1, 'CV'
    ANNOUNCEMENT = 2, 'Announcement'


class TagCategory(models.IntegerChoices):
    TYPE = 1, 'Type'
    TECHNO = 2, 'Techno'
    CONTRAT = 3, 'Contrat'


class UserMatchState(models.IntegerChoices):
    MATCHED = 1, 'Matched'
    DISMATCHED = 2, 'Dismatched'


class UserNotificationState(models.IntegerChoices):
    READ = 1, 'Read'
    UNREAD = 2, 'Unread'
