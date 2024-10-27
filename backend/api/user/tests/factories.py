import factory

from api.user.models import User
from api.user.models import UserProfile


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker('email')


class SuperUserFactory(UserFactory):
    is_staff = True
    is_superuser = True


class UserProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserProfile

    first_name = factory.Faker('name')
    last_name = factory.Faker('name')
