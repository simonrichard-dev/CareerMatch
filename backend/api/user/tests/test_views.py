from backend.test import TestCase

from api.user.tests.factories import UserFactory
from api.user.tests.factories import UserMatchFactory
from api.proposal.tests.factories import ProposalFactory

from backend.choices import UserMatchState


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


class TestMeUserMatchesViewSet(TestCase):
    def setUp(self):
        super().setUp()
        self.proposal1 = ProposalFactory(
            author=self.superuser,
            is_published=True,
            title='Test Proposal 1',
            description='Test Description 1',
        )
        self.proposal2 = ProposalFactory(
            author=self.superuser,
            is_published=True,
            title='Test Proposal 2',
            description='Test Description 2',
        )
        self.match1 = UserMatchFactory(
            user=self.user_withprofile,
            proposal=self.proposal1,
            state=UserMatchState.MATCHED,
        )
        self.match2 = UserMatchFactory(
            user=self.user_withprofile,
            proposal=self.proposal2,
            state=UserMatchState.MAYBE,
        )

        self.proposal3 = ProposalFactory(
            author=self.user_withprofile,
            is_published=True,
            title='Test Proposal 3',
            description='Test Description 3',
        )
        self.match3 = UserMatchFactory(
            user=self.superuser,
            proposal=self.proposal3,
            state=UserMatchState.MATCHED,
        )

    def test_list(self):
        # no login -> 401
        resp = self.client.get('/api/users/me/matches/')
        self.assertEqual(resp.status_code, 401)

        # work -> 200
        self.client.login(self.user_withprofile)
        resp = self.client.get('/api/users/me/matches/')
        self.assertEqual(resp.status_code, 200)

        self.assertEqual(
            set(item['id'] for item in resp.data['matches']),
            {
                self.match1.id,
                self.match2.id
            },
        )
        self.assertEqual(
            set(item['id'] for item in resp.data['matches_received']),
            {
                self.match3.id
            },
        )

    def test_destroy(self):
        # no login -> 401
        resp = self.client.delete(f'/api/users/me/matches/{self.match1.id}/')
        self.assertEqual(resp.status_code, 401)

        # not author -> 404
        self.client.login(self.superuser)
        resp = self.client.delete(f'/api/users/me/matches/{self.match1.id}/')
        self.assertEqual(resp.status_code, 404)

        # work -> 204
        self.client.login(self.user_withprofile)
        resp = self.client.delete(f'/api/users/me/matches/{self.match1.id}/')
        self.assertEqual(resp.status_code, 204)
        