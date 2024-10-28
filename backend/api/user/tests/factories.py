import factory

from api.user.models import User
from api.user.models import UserProfile

from backend.choices import UserGoalType


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
    address = factory.Faker('address')
    zip_code = factory.Faker('zipcode')
    user_goal_type = UserGoalType.COLLABORATOR
