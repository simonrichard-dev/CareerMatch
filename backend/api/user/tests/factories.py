from django.contrib.auth import get_user_model

import factory

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker('email')


class SuperUserFactory(UserFactory):
    is_staff = True
    is_superuser = True
