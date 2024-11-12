import os
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile

from backend.test import TestCase

from api.proposal.models import Proposal
from api.proposal.serializers import ProposalSerializer

IMAGE_PATH = os.path.join(settings.BASE_DIR, "media/proposals/cv_1.pdf")


class TestProposalViewSet(TestCase):
    def test_create(self):
        with open(IMAGE_PATH, 'rb') as infile:
            proposal_file = SimpleUploadedFile("test.pdf", infile.read(), content_type="application/pdf")

            # no login -> 401
            resp = self.client.post('/api/proposals/')
            self.assertEqual(resp.status_code, 401)

            # user no profile -> 403
            self.client.login(self.user_noprofile)
            resp = self.client.post('/api/proposals/')
            self.assertEqual(resp.status_code, 403)

            # work -> 201
            proposal_data = {
                "proposal_file": proposal_file
            }
            self.client.login(self.user_withprofile)
            resp = self.client.post('/api/proposals/', proposal_data, content_type=None, format='multipart')
            self.assertEqual(resp.status_code, 201)

            proposal = Proposal.get_proposal(resp.data['data']['id'])

            # for key in [
            #     'title',
            #     'description',
            # ]:
            #     with self.subTest(key=key):
            #         self.assertEqual(getattr(proposal, key), resp.data['data'][key])

    def test_create_with_video(self):
        with open(IMAGE_PATH, 'rb') as infile:
            proposal_file = SimpleUploadedFile("test.pdf", infile.read(), content_type="application/pdf")
            video_file = SimpleUploadedFile("test.mp4", b"Video content", content_type="video/mp4")

            # work -> 201
            proposal_data = {
                "proposal_file": proposal_file,
                "video_file": video_file,
            }
            self.client.login(self.user_withprofile)
            resp = self.client.post('/api/proposals/', proposal_data, content_type=None, format='multipart')
            self.assertEqual(resp.status_code, 201)

            proposal = Proposal.get_proposal(resp.data['data']['id'])
            serializer = ProposalSerializer(proposal)
            print(serializer.data)

            # for key in [
            #     'title',
            #     'description',
            # ]:
            #     with self.subTest(key=key):
            #         self.assertEqual(getattr(proposal, key), resp.data['data'][key])

    # def test_update(self):
    #     proposal = Proposal.objects.create(
    #         is_published=True,
    #         author=self.superuser,
    #     )
    #     update_data = {
    #         "tags": [1, 2],
    #     }

    #     # no login -> 401
    #     resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
    #     self.assertEqual(resp.status_code, 401)

    #     # user no profile -> 403
    #     self.client.login(self.user_noprofile)
    #     resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
    #     self.assertEqual(resp.status_code, 403)

    #     # not author user -> 404
    #     self.client.login(self.user_withprofile)
    #     resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
    #     self.assertEqual(resp.status_code, 404)

    #     # work -> 202
    #     self.client.login(self.superuser)
    #     resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
    #     self.assertEqual(resp.status_code, 202)

    #     proposal.refresh_from_db()

    #     for key in [
    #         'tags',
    #     ]:
    #         with self.subTest(key=key):
    #             self.assertEqual(getattr(proposal, key), resp.data["data"][key])

    # def test_partial_update(self):
    #     proposal = Proposal.objects.create(
    #         is_published=True,
    #         author=self.superuser,
    #         title='Title proposal',
    #         description='Description proposal',
    #     )
    #     update_data = {
    #         "title": "Title proposal updated",
    #     }

    #     # work -> 202
    #     self.client.login(self.superuser)
    #     resp = self.client.patch(f'/api/proposals/{proposal.id}/', update_data)
    #     self.assertEqual(resp.status_code, 202)

    #     proposal.refresh_from_db()

    #     self.assertEqual(proposal.title, resp.data["data"]["title"])
    
    def test_destroy(self):
        proposal = Proposal.objects.create(
            is_published=True,
            author=self.superuser,
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
