from django.db import models

from backend.models import BaseModel
from backend.choices import TagCategory

from api.user.models import User


class Tag(BaseModel):
    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        ordering = ('name',)

    name = models.CharField(
        max_length=28,
        verbose_name='Name',
        help_text='Name of this tag.',
    )
    category = models.IntegerField(
        choices=TagCategory.choices,
        default=TagCategory.TYPE,
        verbose_name='Category',
        help_text='Category of this tag.',
    )

    def __str__(self):
        return f'[Tag {self.id} # {self.name}]'


class Proposal(BaseModel):
    class Meta:
        verbose_name = 'Proposal'
        verbose_name_plural = 'Proposals'
        ordering = ('-updated_at',)

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Author',
        help_text='Author of this proposal.',
    )
    is_published = models.BooleanField(
        default=False,
        verbose_name='Publish Flag',
        help_text='If this value set True, users can access this proposal.',
    )

    tags = models.ManyToManyField(
        Tag,
        related_name='tags',
        verbose_name='Tags',
        help_text='Tags related of this proposal.',
    )

    proposal_file = models.FileField(
        upload_to='proposals/',
        null=True,
        blank=True,
        verbose_name='Proposal File',
        help_text='Upload a proposal document related to this proposal.',
    )

    video_file = models.FileField(
        upload_to='videos/',
        null=True,
        blank=True,
        verbose_name='Video File',
        help_text='Upload a video file related to this proposal.',
    )

    @staticmethod
    def get_proposal(proposal_id: int) -> "Proposal | None":
        try:
            return Proposal.objects.get(
                pk=proposal_id,
                is_published=True,
            )
        except Proposal.DoesNotExist:
            return None
    
    @staticmethod
    def get_proposals_by_user(user_id: int) -> "list[User] | None":
        try:
            return Proposal.objects.filter(
                user_id=user_id,
                is_published=True,
            )
        except Proposal.DoesNotExist:
            return None

    def __str__(self):
        return f'[Proposal {self.id} # {self.title}] # {self.author.id}]'
