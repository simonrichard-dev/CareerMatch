from backend.test import TestCase
from backend.choices import UserGoalType

from api.user.models import User


class TestAuthentificationUser(TestCase):
    def test_register(self):
        # no data -> 400
        resp = self.client.post('/auth/register/')
        self.assertEqual(resp.status_code, 400)

        # email already exist -> 400
        resp = self.client.post('/auth/register/', {
            'email': self.superuser.email,
            'password': '0000',
        })
        self.assertEqual(resp.status_code, 400)

        # work -> 201
        user_data = {
            'email': 'email_test@careermatch.com',
            'password': '0000',
        }
        resp = self.client.post('/auth/register/', user_data)
        self.assertEqual(resp.status_code, 201)

        user = User.objects.get(pk=resp.data['data']['user']['id'])
        self.assertEqual(user.email, user_data['email'])
        self.assertIsNone(user.profile)

    def test_register_profile(self):
        # no login -> 401
        resp = self.client.post('/auth/profile/')
        self.assertEqual(resp.status_code, 401)

        profile_data = {
            'first_name': 'Bob',
            'last_name': 'Bibi',
            'address': '123 rue de la rue',
            'zip_code': 75000,
            'user_goal_type': UserGoalType.CV,
        }
        self.assertIsNone(self.user_noprofile.profile)
        self.assertIsNotNone(self.user_withprofile.profile)

        # work -> 201
        self.client.login(self.user_noprofile)
        resp = self.client.post('/auth/profile/', profile_data)
        self.assertEqual(resp.status_code, 201)

        user = User.get_user(resp.data['data']['user']['id'])
        profile = user.profile

        self.assertIsNotNone(profile)
        for key in [
            'first_name',
            'last_name',
            'address',
            'zip_code',
            'user_goal_type',
        ]:
            with self.subTest(key=key):
                self.assertEqual(getattr(profile, key), profile_data[key])

    def test_update_profile(self):
        # no login -> 401
        resp = self.client.post('/auth/profile/')
        self.assertEqual(resp.status_code, 401)

        profile_data = {
            'first_name': 'Bob updated',
            'address': '123 rue de la rue updated',
        }

        # work -> 201
        self.client.login(self.user_withprofile)
        resp = self.client.post('/auth/profile/', profile_data)
        self.assertEqual(resp.status_code, 201)

        user = User.get_user(resp.data['data']['user']['id'])
        profile = user.profile

        self.assertIsNotNone(profile)
        for key in [
            'first_name',
            'address',
        ]:
            with self.subTest(key=key):
                self.assertEqual(getattr(profile, key), profile_data[key])
