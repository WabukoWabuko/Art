from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArtworkViewSet, PurchaseViewSet

router = DefaultRouter()
router.register(r'artworks', ArtworkViewSet)
router.register(r'purchases', PurchaseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
