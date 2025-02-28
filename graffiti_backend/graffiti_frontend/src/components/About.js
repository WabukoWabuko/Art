import React from 'react';

function About() {
  return (
    <div className="container about-page">
      <h1 className="text-center mb-4 display-4 text-primary fw-bold">About Us</h1>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="modern-card p-4">
            <p className="lead text-muted">Welcome to Graffiti Art, a vibrant platform celebrating the dynamic world of street culture and urban art. We showcase emerging and established graffiti artists, bringing their bold, colorful expressions to a global audience.</p>
            <p className="text-muted">Our mission is to ignite creativity through graffiti, connecting art lovers with the raw energy of the streets. Join us in exploring the stories, techniques, and inspirations behind every spray, mural, and masterpiece.</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="modern-card p-4">
            <h3 className="text-primary fw-bold">Our Vision</h3>
            <p className="text-muted">To transform urban spaces into galleries of self-expression, fostering a community where art thrives and inspires change. We believe in the power of graffiti to speak, heal, and unite.</p>
            <img src="/assets/images/about-art.jpg" className="img-fluid rounded mt-3" alt="Graffiti Art Vision" style={{ maxHeight: '200px', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
