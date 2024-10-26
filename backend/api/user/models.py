from uuid import uuid4
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin



class UserProfile(models.Model):
    user = models.OneToOneField("api.User", on_delete=models.CASCADE)

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

    @staticmethod
    def get_user_profile(user_id: int) -> "UserProfile | None":
        try:
            return UserProfile.objects.get(user_id=user_id)
        except UserProfile.DoesNotExist:
            return None


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
        return f'[User {self.uid} {self.email}]'
