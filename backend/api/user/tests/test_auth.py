from django.utils import timezone

from backend.test import TestCase

from ..models import User
from .factories import UserFactory


class TestAuthentificationUser(TestCase):
    def test_register(self):
        # no data -> 400
        resp = self.client.post('/api/users/auth/register/')
        self.assertEqual(resp.status_code, 400)

        # email already exist -> 400
        resp = self.client.post('/api/users/auth/register/', {
            'email': self.superuser.email,
            'password': '0000',
        })
        self.assertEqual(resp.status_code, 400)

        # work -> 201
        user_data = {
            'email': 'email_test@careermatch.com',
            'password': '0000',
        }
        resp = self.client.post('/api/users/auth/register/', user_data)
        self.assertEqual(resp.status_code, 201)

        user = User.objects.get(pk=resp.data['data']['user']['id'])
        self.assertEqual(user.email, user_data['email'])
        self.assertIsNone(user.profile)
    
    def test_register_profile(self):
        # no login -> 401
        resp = self.client.post('/api/users/register_profile/')
        self.assertEqual(resp.status_code, 401)

        # create user test
        user_data = {
            'email': 'email_test2@careermatch.com',
            'password': '0000',
        }
        resp = self.client.post('/api/users/auth/register/', user_data)
        self.assertEqual(resp.status_code, 201)
        user = User.get_user(resp.data['data']['user']['id'])

        self.client.login(user)

        profile_data = {
            'first_name': 'Bob',
            'last_name': 'Bibi',
        }

        # work -> 201
        resp = self.client.post('/api/users/register_profile/', profile_data)
        self.assertEqual(resp.status_code, 201)
        
        user = User.get_user(resp.data['data']['user']['id'])
        profile = user.profile

        self.assertIsNotNone(profile)
        for key in [
            'first_name',
            'last_name',
        ]:
            with self.subTest(key=key):
                self.assertEqual(getattr(profile, key), profile_data[key])
