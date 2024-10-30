import factory

from api.proposal.models import Tag
from api.proposal.models import Proposal

from backend.choices import TagCategory


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag

    name = factory.Faker('word')
    category = TagCategory.TYPE


class ProposalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Proposal

    title = factory.Faker('sentence')
    description = factory.Faker('text')
