from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver

from backend.choices import UserGoalType
from backend.choices import UserMatchState
from backend.choices import UserNotificationState


class UserProfile(models.Model):
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
        ordering = ('-user__created_at',)

    user = models.OneToOneField(
        "api.User",
        on_delete=models.CASCADE
    )

    first_name = models.CharField(
        verbose_name='First Name',
        max_length=100,
        null=False,
    )
    last_name = models.CharField(
        verbose_name='Last Name',
        max_length=100,
        null=False,
    )
    last_name = models.CharField(
        verbose_name='Last Name',
        max_length=100,
        null=False,
    )
    address = models.CharField(
        verbose_name='Address',
        max_length=100,
        null=False,
    )
    zip_code = models.IntegerField(
        verbose_name='Zip Code',
        null=False,
    )

    user_goal_type = models.IntegerField(
        choices=UserGoalType.choices,
        verbose_name='User Goal Type',
        default=UserGoalType.COLLABORATOR,
        null=False,
    )

    @staticmethod
    def get_user_profile(user_id: int) -> "UserProfile | None":
        try:
            return UserProfile.objects.get(user_id=user_id)
        except UserProfile.DoesNotExist:
            return None
    
    def __str__(self):
        return f'[UserProfile {self.user.id} {self.user.email}]'


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est obligatoire")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ('-created_at',)

    email = models.EmailField(
        verbose_name="Email",
        unique=True
    )

    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    @staticmethod
    def get_user(user_id: int) -> "User | None":
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
    
    @property
    def profile(self) -> UserProfile:
        user_profile = UserProfile.get_user_profile(self.id)
        if not user_profile:
            return None
        return user_profile
 
    @property
    def is_authenticated(self):
        return True
    
    def __str__(self):
        return f'[User {self.id} {self.email}]'


class UserMatch(models.Model):
    class Meta:
        verbose_name = 'User Match'
        verbose_name_plural = 'User Matches'
        ordering = ('-user__updated_at',)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    proposal = models.ForeignKey(
        "api.Proposal",
        on_delete=models.CASCADE
    )

    state = models.IntegerField(
        choices=UserMatchState.choices,
        verbose_name='State',
        null=False,
    )

    @staticmethod
    def get_user_match(user_id: int, proposal_id: int) -> "UserMatch | None":
        try:
            return UserMatch.objects.get(user_id=user_id, proposal_id=proposal_id)
        except UserMatch.DoesNotExist:
            return None
    
    @staticmethod
    def get_user_matches(user_id: int):
        return UserMatch.objects.filter(
            user_id=user_id,
            proposal__is_published=True,
            proposal__deleted_at=None,
        )

    def __str__(self):
        return f'[UserMatch {self.user.id} -> {self.proposal.id} ({self.state.label})]'


class UserNotification(models.Model):
    class Meta:
        verbose_name = 'User Notification'
        verbose_name_plural = 'User Notifications'
        ordering = ('-created_at',)

    created_at = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        null=True
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    proposal = models.ForeignKey(
        "api.Proposal",
        on_delete=models.CASCADE
    )
    state = models.IntegerField(
        choices=UserNotificationState.choices,
        verbose_name='State',
        default=UserNotificationState.UNREAD,
        null=False,
    )


@receiver(post_save, sender=UserMatch) 
def create_notification_match(sender, instance: UserMatch, created, **kwargs):
    if created:
        if instance.state == UserMatchState.MATCHED:
            UserNotification.objects.create(
                user=instance.user,
                proposal=instance.proposal,
            )
