import React from 'react';

function Contact() {
  return (
    <div className="container contact-page">
      <h1 className="text-center mb-4 display-4 text-primary fw-bold">Contact Us</h1>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="modern-card p-4">
            <h3 className="text-primary fw-bold">Get in Touch</h3>
            <p className="text-muted">We’d love to hear from you! Reach out for collaborations, inquiries, or to share your graffiti journey.</p>
            <p className="text-muted"><i className="fas fa-envelope"></i> <a href="mailto:thee_UrbanKreative@artworld.com" className="text-decoration-none text-muted">thee_UrbanKreative@artworld.com</a></p>
            <p className="text-muted"><i className="fas fa-phone-alt"></i> +254 123 456 789</p>
            <p className="text-muted"><i className="fas fa-map-marker-alt"></i> 45 Urban Walls, Allsops, Nairobi</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="modern-card p-4">
            <h3 className="text-primary fw-bold">Send Us a Message</h3>
            <form className="form-modern">
              <input type="text" className="form-control mb-3" placeholder="Your Name" required />
              <input type="email" className="form-control mb-3" placeholder="Your Email" required />
              <textarea className="form-control mb-3" placeholder="Your Message" rows="4" required />
              <button type="submit" className="btn btn-primary modern-btn w-100">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
