from django.contrib import admin

from api.proposal.models import Tag

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
    )
    search_fields = ["name", ]
