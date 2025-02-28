from django.db import models

class Artwork(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='artworks/')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='available', choices=[('available', 'Available'), ('sold', 'Sold')])

    def __str__(self):
        return self.title

class Purchase(models.Model):
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE)
    buyer_name = models.CharField(max_length=100)
    buyer_email = models.EmailField()
    buyer_phone = models.CharField(max_length=15)
    purchased_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.buyer_name} - {self.artwork.title}"

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    month = models.CharField(max_length=20)
    year = models.IntegerField()
    location = models.CharField(max_length=100)
    time = models.CharField(max_length=50)
    color = models.CharField(max_length=20, default='danger')

    def __str__(self):
        return self.title

class Insight(models.Model):
    author = models.CharField(max_length=100)
    content = models.TextField()
    rating = models.CharField(max_length=10, default='★★★★☆')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author} - {self.content[:50]}..."

class ArtistSpotlight(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='artist_spotlights/')
    portfolio_url = models.URLField(blank=True, null=True)
    featured_week = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name
        
class CommunityInsight(models.Model):
    userName = models.CharField(max_length=100)
    userComment = models.TextField()
    rating = models.CharField(max_length=10, default='★★★★☆')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.userName} - {self.userComment[:20]}"
