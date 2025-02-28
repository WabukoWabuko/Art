from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArtworkViewSet, PurchaseViewSet, EventViewSet, CommunityInsightViewSet, ArtistSpotlightViewSet, public_purchase_create, public_insight_create

router = DefaultRouter()
router.register(r'artworks', ArtworkViewSet)
router.register(r'purchases', PurchaseViewSet)
router.register(r'events', EventViewSet)
router.register(r'insights', CommunityInsightViewSet)
router.register(r'artist-spotlights', ArtistSpotlightViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('public-purchases/', public_purchase_create, name='public_purchase_create'),
    path('public-insights/', public_insight_create, name='public_insight_create'),
]
