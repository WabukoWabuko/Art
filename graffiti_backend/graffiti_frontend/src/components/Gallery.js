import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Gallery() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/artworks/')
      .then(response => setArtworks(response.data))
      .catch(error => console.error('Error fetching artworks:', error));
  }, []);

  return (
    <div className="container gallery-page">
      <h1 className="text-center mb-4 display-4 text-primary fw-bold">Gallery</h1>
      <p className="text-center lead text-muted">Explore our captivating collection of graffiti art—both available and sold masterpieces that tell urban stories.</p>
      <div className="row g-4">
        {artworks.map(artwork => (
          <div className="col-md-4" key={artwork.id}>
            <div className="modern-card art-card">
              <img src={artwork.image} className="card-img-top art-image" alt={artwork.title} />
              <div className="card-body p-4">
                <h5 className="card-title">{artwork.title}</h5>
                <p className="card-text text-muted">{artwork.description}</p>
                <p className="fw-bold">Price: ${artwork.price} - Status: {artwork.status}</p>
                {artwork.status === 'available' && (
                  <button className="btn btn-primary modern-btn w-100" disabled>Purchase (View Only)</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
