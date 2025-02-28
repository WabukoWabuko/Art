from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Artwork, Purchase, Event, CommunityInsight, ArtistSpotlight
from .serializers import ArtworkSerializer, PurchaseSerializer, EventSerializer, CommunityInsightSerializer, ArtistSpotlightSerializer
from rest_framework.response import Response
from rest_framework import status

def public_insight_create(request):
    if request.method == 'POST':
        serializer = CommunityInsightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Insight submitted successfully! An admin will review it."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

def public_purchase_create(request):
    if request.method == 'POST':
        serializer = PurchaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Purchase submitted successfully! An admin will review it."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class ArtworkViewSet(viewsets.ModelViewSet):
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Public can list and view artworks
        return [IsAdminUser()]  # Only admins can create, update, delete

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [IsAdminUser]  # Only admins can manage purchases
    

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Public can list and view events
        return [IsAdminUser()]  # Only admins can create, update, delete

class CommunityInsightViewSet(viewsets.ModelViewSet):
    queryset = CommunityInsight.objects.all()
    serializer_class = CommunityInsightSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Public can list and view insights
        return [IsAdminUser()]  # Only admins can create, update, delete

class ArtistSpotlightViewSet(viewsets.ModelViewSet):
    queryset = ArtistSpotlight.objects.all()
    serializer_class = ArtistSpotlightSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Public can list and view spotlights
        return [IsAdminUser()]  # Only admins can create, update, delete
