from api.user.models import User
from api.user.models import UserMatch

from api.proposal.models import Proposal

from backend.choices import ProposalType
from backend.choices import UserGoalType


class UserManagerProposal:
    user: User
    user_id: int

    def __init__(self, user: User):
        self.user = user
        self.user_id = user.id
    
    def get_user_matches(self):
        return UserMatch.get_user_matches(self.user_id)

    def generate_matching(self):
        user_matches = self.get_user_matches()
        user_matches_ids = [user_match.proposal_id for user_match in user_matches]

        type_proposal = ProposalType.CV
        if self.user.profile.user_goal_type == UserGoalType.ANNOUNCEMENT:
            type_proposal = ProposalType.ANNOUNCEMENT

        proposals = Proposal.objects.filter(
            is_published=True,
            deleted_at=None,
            type=type_proposal
        ).exclude(id__in=user_matches_ids).exclude(author_id=self.user_id)

        return proposals
