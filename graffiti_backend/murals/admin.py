from django.contrib import admin
from .models import Artwork, Purchase, Event, Insight, ArtistSpotlight

admin.site.register(Artwork)
admin.site.register(Purchase)
admin.site.register(Event)
admin.site.register(Insight)
admin.site.register(ArtistSpotlight)
