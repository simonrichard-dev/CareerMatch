import json

from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from rest_framework_simplejwt.tokens import RefreshToken

from api.user.tests.factories import SuperUserFactory
from api.user.tests.factories import UserFactory
from api.user.tests.factories import UserProfileFactory


class Client(APIClient):
    def login(self, user):
        token = str(RefreshToken.for_user(user).access_token)
        self.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def logout(self):
        self.credentials()

    def post(
        self,
        path,
        data=None,
        format=None,
        content_type='application/json',
        follow=False,
        **extra,
    ):
        if content_type == 'application/json':
            data = json.dumps(data)
        return super(Client, self).post(
            path, data, format, content_type, follow, **extra
        )

    def patch(
        self,
        path,
        data=None,
        format=None,
        content_type='application/json',
        follow=False,
        **extra,
    ):
        if content_type == 'application/json':
            data = json.dumps(data)
        return super(Client, self).patch(
            path,
            data,
            format,
            content_type,
            follow,
            **extra,
        )

    def delete(
        self,
        path,
        data=None,
        format=None,
        content_type='application/json',
        follow=False,
        **extra,
    ):
        if content_type == 'application/json':
            data = json.dumps(data)
        return super(Client, self).delete(
            path,
            data,
            format,
            content_type,
            follow,
            **extra,
        )


class TestCase(APITestCase):
    client_class = Client

    def setUp(self) -> None:
        super().setUp()
        self.superuser = SuperUserFactory()
        UserProfileFactory(user=self.superuser)

        self.user_noprofile = SuperUserFactory()

        self.user_withprofile = UserFactory()
        UserProfileFactory(user=self.user_withprofile)
