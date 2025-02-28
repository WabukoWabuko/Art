from rest_framework import serializers
from .models import Artwork, Purchase, Event, Insight, ArtistSpotlight, CommunityInsight

class CommunityInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityInsight
        fields = '__all__'

class ArtworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artwork
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = '__all__'

class ArtistSpotlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistSpotlight
        fields = '__all__'
