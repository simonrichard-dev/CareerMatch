from backend.test import TestCase

from api.proposal.tests.factories import ProposalFactory
from api.user.models import UserMatch
from api.user.tests.factories import UserFactory
from api.user.tests.factories import UserProfileFactory

from backend.choices import UserGoalType
from backend.choices import UserMatchState
from backend.choices import ProposalType


class TestMeUserViewSet(TestCase):
    def setUp(self):
        super().setUp()
        self.user_announcement = UserFactory()
        UserProfileFactory(
            user=self.user_announcement,
            user_goal_type=UserGoalType.ANNOUNCEMENT,
        )

        self.proposal1 = ProposalFactory(
            author=self.superuser,
            is_published=True,
            type = ProposalType.CV
        )
        self.proposal2 = ProposalFactory(
            author=self.superuser,
            is_published=True,
            type = ProposalType.CV
        )
        self.proposal3 = ProposalFactory(
            author=self.user_withprofile,
            is_published=True,
            type = ProposalType.CV
        )

        self.proposal4 = ProposalFactory(
            author=self.user_withprofile,
            is_published=True,
            type = ProposalType.ANNOUNCEMENT
        )
        self.proposal5 = ProposalFactory(
            author=self.user_withprofile,
            is_published=True,
            type = ProposalType.ANNOUNCEMENT
        )

    def test_list(self):
        # no login -> 401
        resp = self.client.get('/api/matching/')
        self.assertEqual(resp.status_code, 401)

        # no profile -> 403
        self.client.login(self.user_noprofile)
        resp = self.client.get('/api/matching/')
        self.assertEqual(resp.status_code, 403)

        # work -> 200
        self.client.login(self.user_withprofile)
        resp = self.client.get('/api/matching/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data['matching']), 2)
        self.assertEqual(
            set(item['id'] for item in resp.data['matching']),
            {
                self.proposal1.id,
                self.proposal2.id
            },
        )

        # work -> 200
        self.client.login(self.superuser)
        resp = self.client.get('/api/matching/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data['matching']), 1)
        self.assertEqual(
            set(item['id'] for item in resp.data['matching']),
            {
                self.proposal3.id,
            },
        )
    
    def test_post(self):
        matching_data = {
            'proposal': self.proposal1.id,
            'state': UserMatchState.MATCHED,
        }
        # no login -> 401
        resp = self.client.post('/api/matching/', matching_data)
        self.assertEqual(resp.status_code, 401)

        # no profile -> 403
        self.client.login(self.user_noprofile)
        resp = self.client.post('/api/matching/', matching_data)
        self.assertEqual(resp.status_code, 403)

        # work -> 200
        self.client.login(self.user_withprofile)
        resp = self.client.post('/api/matching/', matching_data)
        self.assertEqual(resp.status_code, 201)

        # already matched -> 406
        resp = self.client.post('/api/matching/', matching_data)
        self.assertEqual(resp.status_code, 406)

        # same author to match -> 406
        self.client.login(self.superuser)
        resp = self.client.post('/api/matching/', matching_data)
        self.assertEqual(resp.status_code, 406)

    def test_update(self):
        user_match = UserMatch.objects.create(
            user=self.user_withprofile,
            proposal=self.proposal1,
            state=UserMatchState.MATCHED,
        )
        
        matching_data = {
            'proposal': user_match.proposal.id,
            'state': UserMatchState.DISMATCHED,
        }
        # no login -> 401
        resp = self.client.put('/api/matching/', matching_data)
        self.assertEqual(resp.status_code, 401)

        # no profile -> 403
        self.client.login(self.user_noprofile)
        resp = self.client.put('/api/matching/', matching_data)
        self.assertEqual(resp.status_code, 403)

        # not exist -> 404
        self.client.login(self.superuser)
        resp = self.client.put('/api/matching/', matching_data)
        self.assertEqual(resp.status_code, 404)

        # work -> 200
        self.client.login(self.user_withprofile)
        resp = self.client.put('/api/matching/', matching_data)
        self.assertEqual(resp.status_code, 200)

        user_match.refresh_from_db()

        self.assertEqual(user_match.state, UserMatchState.DISMATCHED)

    def test_list_announcement(self):
        self.client.login(self.user_announcement)
        resp = self.client.get('/api/matching/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data['matching']), 2)
        self.assertEqual(
            set(item['id'] for item in resp.data['matching']),
            {
                self.proposal4.id,
                self.proposal5.id
            },
        )