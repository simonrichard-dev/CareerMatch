from backend.test import TestCase

from api.user.tests.factories import UserFactory


class TestUserViewSet(TestCase):
    def test_list(self):
        user = UserFactory()
        UserFactory(is_active=False)

        resp = self.client.get(f'/api/users/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['count'], 4)  # +3 from setUp - 1 no active
        self.assertEqual(
            set(item['id'] for item in resp.data['results']),
            {
                self.superuser.id,
                self.user_withprofile.id,
                self.user_noprofile.id,
                user.id
            },
        )

    def test_retrieve(self):
        user = UserFactory()

        resp = self.client.get(f'/api/users/{user.id}/')
        self.assertEqual(resp.status_code, 200)


class TestMeUserViewSet(TestCase):
    def test_list(self):
        # no login -> 401
        resp = self.client.get('/api/users/me/')
        self.assertEqual(resp.status_code, 401)

        # work -> 200
        self.client.login(self.superuser)
        resp = self.client.get('/api/users/me/')
        self.assertEqual(resp.status_code, 200)

        for key in [
            'id',
            'email',
        ]:
            with self.subTest(key=key):
                self.assertEqual(getattr(self.superuser, key), resp.data[key])