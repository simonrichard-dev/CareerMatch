from backend.test import TestCase

from api.proposal.models import Proposal


class TestProposalViewSet(TestCase):
    def test_create(self):
        # no login -> 401
        resp = self.client.post('/api/proposals/')
        self.assertEqual(resp.status_code, 401)

        # user no profile -> 403
        self.client.login(self.user_noprofile)
        resp = self.client.post('/api/proposals/')
        self.assertEqual(resp.status_code, 403)

        # work -> 201
        proposal_data = {
            "title": "Title proposal",
            "description": "Description proposal",
        }
        self.client.login(self.user_withprofile)
        resp = self.client.post('/api/proposals/', proposal_data)
        self.assertEqual(resp.status_code, 201)

        proposal = Proposal.get_proposal(resp.data['data']['id'])

        for key in [
            'title',
            'description',
        ]:
            with self.subTest(key=key):
                self.assertEqual(getattr(proposal, key), resp.data['data'][key])

    def test_update(self):
        proposal = Proposal.objects.create(
            is_published=True,
            author=self.superuser,
            title='Title proposal',
            description='Description proposal',
        )
        update_data = {
            "title": "Title proposal updated",
            "description": "Description proposal updated",
        }

        # no login -> 401
        resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
        self.assertEqual(resp.status_code, 401)

        # user no profile -> 403
        self.client.login(self.user_noprofile)
        resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
        self.assertEqual(resp.status_code, 403)

        # not author user -> 404
        self.client.login(self.user_withprofile)
        resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
        self.assertEqual(resp.status_code, 404)

        # work -> 202
        self.client.login(self.superuser)
        resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
        self.assertEqual(resp.status_code, 202)

        proposal.refresh_from_db()

        for key in [
            'title',
            'description',
        ]:
            with self.subTest(key=key):
                self.assertEqual(getattr(proposal, key), resp.data["data"][key])

    def test_partial_update(self):
        proposal = Proposal.objects.create(
            is_published=True,
            author=self.superuser,
            title='Title proposal',
            description='Description proposal',
        )
        update_data = {
            "title": "Title proposal updated",
        }

        # work -> 202
        self.client.login(self.superuser)
        resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
        self.assertEqual(resp.status_code, 202)

        proposal.refresh_from_db()

        self.assertEqual(proposal.title, resp.data["data"]["title"])
    
    def test_destroy(self):
        proposal = Proposal.objects.create(
            is_published=True,
            author=self.superuser,
            title='Title proposal',
            description='Description proposal',
        )

        # no login -> 401
        resp = self.client.delete(f'/api/proposals/{proposal.id}/')
        self.assertEqual(resp.status_code, 401)

        # user no profile -> 403
        self.client.login(self.user_noprofile)
        resp = self.client.delete(f'/api/proposals/{proposal.id}/')
        self.assertEqual(resp.status_code, 403)

        # not author user -> 404
        self.client.login(self.user_withprofile)
        resp = self.client.delete(f'/api/proposals/{proposal.id}/')
        self.assertEqual(resp.status_code, 404)

        # work -> 202
        self.client.login(self.superuser)
        resp = self.client.delete(f'/api/proposals/{proposal.id}/')
        self.assertEqual(resp.status_code, 204)
    
        proposal.refresh_from_db()

        self.assertIsNotNone(proposal.deleted_at)
