import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [artworks, setArtworks] = useState([]);
  const [purchaseData, setPurchaseData] = useState({ buyer_name: '', buyer_email: '', buyer_phone: '', buyer_comment: '', rating: '★★★★☆' });
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [spotlightArtists, setSpotlightArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/artworks/')
      .then(response => setArtworks(response.data))
      .catch(error => console.error('Error fetching artworks:', error));

    // Fetch current week's spotlight artists
    axios.get('http://localhost:8000/api/artist-spotlights/?ordering=-week_start&limit=3')
      .then(response => setSpotlightArtists(response.data))
      .catch(error => console.error('Error fetching spotlight artists:', error));

    // Fetch public events
    axios.get('http://localhost:8000/api/events/')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));

    // Fetch public insights
    axios.get('http://localhost:8000/api/insights/')
      .then(response => setInsights(response.data))
      .catch(error => console.error('Error fetching insights:', error));
  }, []);

  const handlePurchase = (e, artworkId) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/public-purchases/', {
      ...purchaseData,
      artwork: artworkId
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        alert('Purchase submitted successfully! An admin will review it.');
        setPurchaseData({ buyer_name: '', buyer_email: '', buyer_phone: '', buyer_comment: '', rating: '★★★★☆' });
        setSelectedArtwork(null);
      })
      .catch(error => {
        console.error('Error submitting purchase:', error.response ? error.response.data : error.message);
        alert('Error submitting purchase: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
      });
  };

  const handleInsightSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/insights/', {
      userName: purchaseData.buyer_name,
      userComment: purchaseData.buyer_comment,
      rating: purchaseData.rating
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        alert('Insight submitted successfully! An admin will review it.');
        setPurchaseData({ ...purchaseData, buyer_comment: '', rating: '★★★★☆' });
      })
      .catch(error => {
        console.error('Error submitting insight:', error.response ? error.response.data : error.message);
        alert('Error submitting insight: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
      });
  };

  return (
    <div>
      {/* Carousel - Images sliding */}
      <div id="hero-carousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active c-item">
            <img src="assets/images/1.jpg" className="d-block w-100 c-img" alt="Slide 1" />
            <div className="carousel-caption top-0 mt-4">
              <p className="mt-5 fs-3 text-uppercase">Explore the Streets in Color</p>
              <h1 className="display-1 fw-bolder text-capitalize">The Spirit of Graffiti</h1>
              <button className="btn btn-primary px-4 py-2 fs-5 mt-5">Explore Gallery</button>
            </div>
          </div>
          <div className="carousel-item c-item">
            <img src="assets/images/2.jpg" className="d-block w-100 c-img" alt="Slide 2" />
            <div className="carousel-caption top-0 mt-4">
              <p className="mt-5 fs-3 text-uppercase">Reveal the Hidden Graffiti Gems</p>
              <h1 className="display-1 fw-bolder text-capitalize">The Vibe of Street Art</h1>
              <button className="btn btn-primary px-4 py-2 fs-5 mt-5">Explore Gallery</button>
            </div>
          </div>
          <div className="carousel-item c-item">
            <img src="assets/images/3.jpg" className="d-block w-100 c-img" alt="Slide 3" />
            <div className="carousel-caption top-0 mt-4">
              <p className="mt-5 fs-3 text-uppercase">Find the Untold Stories in Graffiti</p>
              <h1 className="display-1 fw-bolder text-capitalize">Soul of the Spray</h1>
              <button className="btn btn-primary px-4 py-2 fs-5 mt-5">Explore Gallery</button>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#hero-carousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#hero-carousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {/* End of Carousel */}

      {/* Upcoming Events (Dynamic) */}
      <section className="upcoming-events text-center py-5">
        <h2 className="fw-bold mb-5">Upcoming Events</h2>
        <div className="container">
          <div className="row g-4">
            {events.map(event => (
              <div className="col-md-6" key={event.id}>
                <div className="modern-card h-100">
                  <div className="row g-0">
                    <div className={`col-4 d-flex align-items-center justify-content-center bg-${event.color} text-${event.color === 'warning' ? 'dark' : 'white'}`}>
                      <div className="text-center py-4">
                        <div className="day fs-1 fw-bold">{event.date.split('-')[2]}</div>
                        <div className="month text-uppercase">{event.month}</div>
                        <div className="year">{event.year}</div>
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="card-body p-4">
                        <h3 className="card-title fw-bold">{event.title}</h3>
                        <p className="card-text">{event.description}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Time:</strong> {event.time}</p>
                        <a href="#" className={`btn btn-${event.color} modern-btn ${event.color === 'warning' ? 'text-dark' : ''}`}>Learn More</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* End of Upcoming Events */}

      {/* Recent Art Uploads (Dynamic Artworks) */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Recent Art Uploads</h2>
        <div className="row g-4">
          {artworks.map(artwork => (
            <div className="col-md-4" key={artwork.id}>
              <div className="modern-card art-card">
                <img src={artwork.image} className="card-img-top art-image" alt={artwork.title} />
                <div className="card-body p-4">
                  <h5 className="card-title">{artwork.title}</h5>
                  <p className="card-text text-muted">{artwork.description}</p>
                  <p className="fw-bold">Price: ${artwork.price} {artwork.is_sold ? '(Sold)' : '(Available)'}</p>
                  <button
                    className="btn btn-primary modern-btn w-100"
                    onClick={() => setSelectedArtwork(artwork.id === selectedArtwork ? null : artwork.id)}
                  >
                    {selectedArtwork === artwork.id ? 'Cancel' : 'Purchase'}
                  </button>
                  {selectedArtwork === artwork.id && (
                    <form className="form-modern mt-3" onSubmit={(e) => handlePurchase(e, artwork.id)}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name"
                        value={purchaseData.buyer_name}
                        onChange={(e) => setPurchaseData({ ...purchaseData, buyer_name: e.target.value })}
                        required
                      />
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Your Email"
                        value={purchaseData.buyer_email}
                        onChange={(e) => setPurchaseData({ ...purchaseData, buyer_email: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Phone"
                        value={purchaseData.buyer_phone}
                        onChange={(e) => setPurchaseData({ ...purchaseData, buyer_phone: e.target.value })}
                        required
                      />
                      <button type="submit" className="btn btn-success modern-btn w-100">Submit Purchase</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End of Recent Art Uploads */}

      {/* Artist Spotlight (Dynamic, Editable by Admin) */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Artist Spotlight</h2>
        <div className="row g-4">
          {spotlightArtists.map(artist => (
            <div className="col-md-4" key={artist.id}>
              <div className="modern-card artist-card">
                <img src={artist.image} className="card-img-top artist-image" alt={artist.name} />
                <div className="card-body p-4">
                  <h5 className="card-title">{artist.name}</h5>
                  <p className="card-text text-muted">{artist.description}</p>
                  <a href={artist.portfolio_url || '#'} className="btn btn-primary modern-btn">View Portfolio</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End of Artist Spotlight */}

      {/* Community Insights (Carousel) */}
      <div id="insights-carousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
        <h2 className="text-center mb-4">Community Insights</h2>
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#insights-carousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          {insights.map((_, index) => (
            <button key={index} type="button" data-bs-target="#insights-carousel" data-bs-slide-to={index + 1} aria-label={`Slide ${index + 2}`}></button>
          ))}
        </div>
        <div className="carousel-inner">
          {insights.map((insight, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <div className="d-flex flex-column align-items-center text-center">
                <div className="modern-card">
                  <div className="card-body p-4">
                    <h5 className="card-title">{insight.userName}</h5>
                    <p className="card-text text-muted">{insight.userComment}</p>
                    <div className="rating">
                      <strong>Rating:</strong> {insight.rating}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#insights-carousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#insights-carousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {/* End of Community Insights */}

      {/* Share Your Insight (Public) */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Share Your Insight</h2>
        <form className="modern-card p-4" onSubmit={handleInsightSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Your Name"
            value={purchaseData.buyer_name}
            onChange={(e) => setPurchaseData({ ...purchaseData, buyer_name: e.target.value })}
            required
          />
          <textarea
            className="form-control mb-3"
            placeholder="Your Comment"
            value={purchaseData.buyer_comment}
            onChange={(e) => setPurchaseData({ ...purchaseData, buyer_comment: e.target.value })}
            rows="3"
            required
          />
          <select
            className="form-control mb-3"
            value={purchaseData.rating}
            onChange={(e) => setPurchaseData({ ...purchaseData, rating: e.target.value })}
            required
          >
            <option value="★★★★☆">★★★★☆</option>
            <option value="★★★★★">★★★★★</option>
            <option value="★★★☆☆">★★★☆☆</option>
            <option value="★★☆☆☆">★★☆☆☆</option>
            <option value="★☆☆☆☆">★☆☆☆☆</option>
          </select>
          <button type="submit" className="btn btn-primary modern-btn w-100">Submit Insight</button>
        </form>
      </div>
      {/* End of Share Your Insight */}

      {/* Footer */}
      <footer className="bg-dark text-light pt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5 className="text-uppercase">About Us</h5>
              <p>Our platform celebrates street culture, featuring emerging and established graffiti artists from around the world. Join us as we explore urban art in vibrant colors and bold statements.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="text-uppercase">Explore More</h5>
              <ul className="list-unstyled">
                <li><a href="/gallery/assets" className="text-light">Featured Artists</a></li>
                <li><a href="/gallery/assets" className="text-light">Street Galleries</a></li>
                <li><a href="/gallery/events" className="text-light">Events</a></li>
                <li><a href="#" className="text-light">Submit Your Art</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="text-uppercase">Contact Us</h5>
              <p><i className="fas fa-envelope"></i> thee_UrbanKreative@artworld.com</p>
              <p><i className="fas fa-map-marker-alt"></i> 45 Urban Walls, Allsops, Nairobi</p>
              <p><i className="fas fa-phone-alt"></i> +254123456789</p>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 text-center">
              <h5 className="text-uppercase">Connect with Us</h5>
              <a href="https://www.facebook.com" target="_blank" className="text-light mx-2">
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
              <a href="https://www.twitter.com" target="_blank" className="text-light mx-2">
                <i className="fab fa-twitter"></i> X
              </a>
              <a href="https://www.instagram.com" target="_blank" className="text-light mx-2">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="https://www.linkedin.com" target="_blank" className="text-light mx-2">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a href="https://www.youtube.com" target="_blank" className="text-light mx-2">
                <i className="fab fa-youtube"></i> YouTube
              </a>
              <a href="https://www.pinterest.com" target="_blank" className="text-light mx-2">
                <i className="fab fa-pinterest"></i> Pinterest
              </a>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 text-center">
              <p className="mb-0">© 2025 thee_UrbanKreative. All Rights Reserved. Creativity Unleashed.</p>
            </div>
          </div>
        </div>
      </footer>
      {/* End of Footer */}
    </div>
  );
}

export default Home;
