import factory

from api.proposal.models import Tag
from api.proposal.models import Proposal


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag

    name = factory.Faker('word')


class ProposalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Proposal

    title = factory.Faker('sentence')
    description = factory.Faker('text')
