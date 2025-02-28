import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [artworks, setArtworks] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [events, setEvents] = useState([]);
  const [insights, setInsights] = useState([]);
  const [artistSpotlights, setArtistSpotlights] = useState([]);
  const [formData, setFormData] = useState({ 
    model: 'artwork', 
    title: '', 
    description: '', 
    price: '', 
    image: null, 
    buyer_name: '', 
    buyer_email: '', 
    buyer_phone: '', 
    artworkId: '', 
    date: '', 
    month: '', 
    year: '', 
    location: '', 
    time: '', 
    color: 'danger',
    userName: '',
    userComment: '',
    rating: '★★★★☆',
    name: '', // For ArtistSpotlight
    portfolio_url: '' // For ArtistSpotlight
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('artworks');
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    fetchArtworks();
    fetchPurchases();
    fetchEvents();
    fetchInsights();
    fetchArtistSpotlights();
  }, [token, navigate]);

  const fetchArtworks = () => {
    axios.get('http://localhost:8000/api/artworks/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setArtworks(response.data))
      .catch(error => console.error('Error fetching artworks:', error));
  };

  const fetchPurchases = () => {
    axios.get('http://localhost:8000/api/purchases/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setPurchases(response.data))
      .catch(error => console.error('Error fetching purchases:', error));
  };

  const fetchEvents = () => {
    axios.get('http://localhost:8000/api/events/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  };

  const fetchInsights = () => {
    axios.get('http://localhost:8000/api/insights/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setInsights(response.data))
      .catch(error => console.error('Error fetching insights:', error));
  };

  const fetchArtistSpotlights = () => {
    axios.get('http://localhost:8000/api/artist-spotlights/?ordering=-week_start&limit=3', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setArtistSpotlights(response.data))
      .catch(error => console.error('Error fetching artist spotlights:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.model === 'artwork') {
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('is_sold', false); // Default to not sold
      if (formData.image) data.append('image', formData.image);
    } else if (formData.model === 'purchase') {
      data.append('buyer_name', formData.buyer_name);
      data.append('buyer_email', formData.buyer_email);
      data.append('buyer_phone', formData.buyer_phone);
      data.append('artwork', formData.artworkId);
    } else if (formData.model === 'event') {
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date', formData.date);
      data.append('month', formData.month);
      data.append('year', formData.year);
      data.append('location', formData.location);
      data.append('time', formData.time);
      data.append('color', formData.color);
    } else if (formData.model === 'insight') {
      data.append('userName', formData.userName);
      data.append('userComment', formData.userComment);
      data.append('rating', formData.rating);
    } else if (formData.model === 'artist-spotlight') {
      data.append('name', formData.name); // Use 'name' for ArtistSpotlight
      data.append('description', formData.description);
      if (formData.image) data.append('image', formData.image);
      data.append('portfolio_url', formData.portfolio_url || '');
      data.append('week_start', new Date().toISOString().split('T')[0]); // Set current week
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const url = formData.model === 'artwork' 
      ? editingId ? `http://localhost:8000/api/artworks/${editingId}/` : 'http://localhost:8000/api/artworks/'
      : formData.model === 'purchase' 
      ? editingId ? `http://localhost:8000/api/purchases/${editingId}/` : 'http://localhost:8000/api/purchases/'
      : formData.model === 'event' 
      ? editingId ? `http://localhost:8000/api/events/${editingId}/` : 'http://localhost:8000/api/events/'
      : formData.model === 'insight' 
      ? editingId ? `http://localhost:8000/api/insights/${editingId}/` : 'http://localhost:8000/api/insights/'
      : editingId ? `http://localhost:8000/api/artist-spotlights/${editingId}/` : 'http://localhost:8000/api/artist-spotlights/';

    const method = editingId ? axios.put : axios.post;

    method(url, data, config)
      .then(() => {
        if (formData.model === 'artwork') fetchArtworks();
        else if (formData.model === 'purchase') fetchPurchases();
        else if (formData.model === 'event') fetchEvents();
        else if (formData.model === 'insight') fetchInsights();
        else fetchArtistSpotlights();
        resetForm();
      })
      .catch(error => {
        console.error(`Error ${editingId ? 'updating' : 'creating'} ${formData.model}:`, error.response ? error.response.data : error.message);
        alert(`Error ${editingId ? 'updating' : 'creating'} ${formData.model}: ` + (error.response ? JSON.stringify(error.response.data) : error.message));
      });
  };

  const handleDelete = (id, model) => {
    axios.delete(`${model === 'artwork' ? 'http://localhost:8000/api/artworks/' : model === 'purchase' ? 'http://localhost:8000/api/purchases/' : model === 'event' ? 'http://localhost:8000/api/events/' : model === 'insight' ? 'http://localhost:8000/api/insights/' : 'http://localhost:8000/api/artist-spotlights/'}${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        if (model === 'artwork') fetchArtworks();
        else if (model === 'purchase') fetchPurchases();
        else if (model === 'event') fetchEvents();
        else if (model === 'insight') fetchInsights();
        else fetchArtistSpotlights();
      })
      .catch(error => {
        console.error(`Error deleting ${model}:`, error.response ? error.response.data : error.message);
        alert(`Error deleting ${model}: ` + (error.response ? JSON.stringify(error.response.data) : error.message));
      });
  };

  const handleEdit = (item, model) => {
    setEditingId(item.id);
    setFormData({
      model,
      ...(model === 'artwork' 
        ? { title: item.title, description: item.description, price: item.price, image: null, is_sold: item.is_sold }
        : model === 'purchase' 
        ? { buyer_name: item.buyer_name, buyer_email: item.buyer_email, buyer_phone: item.buyer_phone, artworkId: item.artwork }
        : model === 'event' 
        ? { title: item.title, description: item.description, date: item.date, month: item.month, year: item.year, location: item.location, time: item.time, color: item.color }
        : model === 'insight' 
        ? { userName: item.userName, userComment: item.userComment, rating: item.rating }
        : { name: item.name, description: item.description, image: null, portfolio_url: item.portfolio_url })
    });
    setActiveTab(model + 's');
  };

  const resetForm = () => {
    setFormData({ 
      model: 'artwork', 
      title: '', 
      description: '', 
      price: '', 
      image: null, 
      buyer_name: '', 
      buyer_email: '', 
      buyer_phone: '', 
      artworkId: '', 
      date: '', 
      month: '', 
      year: '', 
      location: '', 
      time: '', 
      color: 'danger',
      userName: '',
      userComment: '',
      rating: '★★★★☆',
      name: '',
      portfolio_url: ''
    });
    setEditingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login', { replace: true });
  };

  if (!token) {
    return null;
  }

  return (
    <div className="container-fluid py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="text-center flex-grow-1 text-primary">Admin Dashboard</h1>
        <button className="btn btn-danger modern-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
      </div>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'artworks' ? 'active' : ''}`}
            onClick={() => { setActiveTab('artworks'); resetForm(); setFormData({ ...formData, model: 'artwork' }); }}
          >
            Artworks
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => { setActiveTab('purchases'); resetForm(); setFormData({ ...formData, model: 'purchase' }); }}
          >
            Purchases
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => { setActiveTab('events'); resetForm(); setFormData({ ...formData, model: 'event' }); }}
          >
            Events
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => { setActiveTab('insights'); resetForm(); setFormData({ ...formData, model: 'insight' }); }}
          >
            Insights
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'artist-spotlights' ? 'active' : ''}`}
            onClick={() => { setActiveTab('artist-spotlights'); resetForm(); setFormData({ ...formData, model: 'artist-spotlight' }); }}
          >
            Artist Spotlights
          </button>
        </li>
      </ul>
      <div className="row">
        <div className="col-md-3">
          <div className="card p-4 bg-dark text-light sticky-top" style={{ top: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)' }}>
            <h2 className="h4 mb-4">
              {editingId 
                ? `Edit ${formData.model === 'artwork' ? 'Artwork' : formData.model === 'purchase' ? 'Purchase' : formData.model === 'event' ? 'Event' : formData.model === 'insight' ? 'Insight' : 'Artist Spotlight'}` 
                : `Add ${formData.model === 'artwork' ? 'Artwork' : formData.model === 'purchase' ? 'Purchase' : formData.model === 'event' ? 'Event' : formData.model === 'insight' ? 'Insight' : 'Artist Spotlight'}`}
            </h2>
            <form className="form-modern" onSubmit={handleSubmit}>
              {formData.model === 'artwork' ? (
                <>
                  <input
                    type="text"
                    className="form-control bg-light text-dark"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <textarea
                    className="form-control bg-light text-dark"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    required
                  />
                  <input
                    type="number"
                    className="form-control bg-light text-dark"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                  <input
                    type="file"
                    className="form-control bg-light text-dark"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  />
                </>
              ) : formData.model === 'purchase' ? (
                <>
                  <input
                    type="text"
                    className="form-control bg-light text-dark"
                    placeholder="Buyer Name"
                    value={formData.buyer_name}
                    onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    className="form-control bg-light text-dark"
                    placeholder="Buyer Email"
                    value={formData.buyer_email}
                    onChange={(e) => setFormData({ ...formData, buyer_email: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-control bg-light text-dark"
                    placeholder="Buyer Phone"
                    value={formData.buyer_phone}
                    onChange={(e) => setFormData({ ...formData, buyer_phone: e.target.value })}
                    required
                  />
                  <select
                    className="form-control bg-light text-dark"
                    value={formData.artworkId}
                    onChange={(e) => setFormData({ ...formData, artworkId: e.target.value })}
                    required
                  >
                    <option value="">Select Artwork</option>
                    {artworks.map(artwork => (
                      <option key={artwork.id} value={artwork.id}>{artwork.title}</option>
                    ))}
                  </select>
                </>
              ) : formData.model === 'event' ? (
                <>
                  <input
                    type="text"
                    className="form-control bg-light text-dark"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <textarea
                    className="form-control bg-light text-dark"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    required
                  />
                  <input
                    type="date"
                    className="form-control bg-light text-dark"
                    placeholder="Date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-control bg-light text-dark"
                    placeholder="Month (e.g., Oct)"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="form-control bg-light text-dark"
                    placeholder="Year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-control bg-light text-dark"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-control bg-light text-dark"
                    placeholder="Time (e.g., 10:00 AM - 6:00 PM)"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                  <select
                    className="form-control bg-light text-dark"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    required
                  >
                    <option value="danger">Danger (Red)</option>
                    <option value="warning">Warning (Yellow)</option>
                  </select>
                </>
              ) : formData.model === 'insight' ? (
                <>
                  <input
                    type="text"
                    className="form-control bg-light text-dark"
                    placeholder="User Name"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    required
                  />
                  <textarea
                    className="form-control bg-light text-dark"
                    placeholder="Comment"
                    value={formData.userComment}
                    onChange={(e) => setFormData({ ...formData, userComment: e.target.value })}
                    rows="3"
                    required
                  />
                  <select
                    className="form-control bg-light text-dark"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    required
                  >
                    <option value="★★★★☆">★★★★☆</option>
                    <option value="★★★★★">★★★★★</option>
                    <option value="★★★☆☆">★★★☆☆</option>
                    <option value="★★☆☆☆">★★☆☆☆</option>
                    <option value="★☆☆☆☆">★☆☆☆☆</option>
                  </select>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className="form-control bg-light text-dark"
                    placeholder="Artist Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <textarea
                    className="form-control bg-light text-dark"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    required
                  />
                  <input
                    type="file"
                    className="form-control bg-light text-dark"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  />
                  <input
                    type="url"
                    className="form-control bg-light text-dark"
                    placeholder="Portfolio URL (optional)"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  />
                </>
              )}
              <button type="submit" className="btn btn-primary modern-btn w-100 mt-3">
                {editingId ? 'Update' : `Add ${formData.model === 'artist-spotlight' ? 'Artist Spotlight' : formData.model.charAt(0).toUpperCase() + formData.model.slice(1)}`}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary modern-btn w-100 mt-2" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
        <div className="col-md-9">
          <h2 className="mb-4">{activeTab === 'artworks' ? 'Artworks' : activeTab === 'purchases' ? 'Purchases' : activeTab === 'events' ? 'Events' : activeTab === 'insights' ? 'Community Insights' : 'Artist Spotlights'}</h2>
          <div className="row g-4">
            {activeTab === 'artworks' ? (
              artworks.map(artwork => (
                <div className="col-md-4" key={artwork.id}>
                  <div className="card bg-dark text-light" style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)' }}>
                    <img src={artwork.image} className="card-img-top" style={{ borderRadius: '10px 10px 0 0', objectFit: 'cover', height: '250px' }} alt={artwork.title} />
                    <div className="card-body p-4">
                      <h5 className="card-title">{artwork.title}</h5>
                      <p className="card-text text-muted">{artwork.description}</p>
                      <p className="fw-bold">Price: ${artwork.price} {artwork.is_sold ? '(Sold)' : '(Available)'}</p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-warning modern-btn flex-grow-1" onClick={() => handleEdit(artwork, 'artwork')}>
                          Edit
                        </button>
                        <button className="btn btn-danger modern-btn flex-grow-1" onClick={() => handleDelete(artwork.id, 'artwork')}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : activeTab === 'purchases' ? (
              purchases.map(purchase => (
                <div className="col-md-4" key={purchase.id}>
                  <div className="card bg-dark text-light" style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)' }}>
                    <div className="card-body p-4">
                      <h5 className="card-title">Purchase by {purchase.buyer_name}</h5>
                      <p className="card-text">
                        Artwork: {purchase.artwork.title}<br />
                        Status: Sold<br />
                        Email: {purchase.buyer_email}<br />
                        Phone: {purchase.buyer_phone}<br />
                        Date: {new Date(purchase.purchased_at).toLocaleString()}
                      </p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-warning modern-btn flex-grow-1" onClick={() => handleEdit(purchase, 'purchase')}>
                          Edit
                        </button>
                        <button className="btn btn-danger modern-btn flex-grow-1" onClick={() => handleDelete(purchase.id, 'purchase')}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : activeTab === 'events' ? (
              events.map(event => (
                <div className="col-md-6" key={event.id}>
                  <div className="card h-100" style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
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
                          <div className="mt-2 d-flex gap-2">
                            <button className="btn btn-warning modern-btn flex-grow-1" onClick={() => handleEdit(event, 'event')}>
                              Edit
                            </button>
                            <button className="btn btn-danger modern-btn flex-grow-1" onClick={() => handleDelete(event.id, 'event')}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : activeTab === 'insights' ? (
              <div>
                <div id="insights-carousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
                  <div className="carousel-inner">
                    {insights.map((insight, index) => (
                      <div className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <div className="d-flex flex-column align-items-center text-center">
                          <div className="card bg-dark text-light" style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', width: '100%' }}>
                            <div className="card-body p-4">
                              <h5 className="card-title">{insight.userName}</h5>
                              <p className="card-text text-muted">{insight.userComment}</p>
                              <div className="rating">
                                <strong>Rating:</strong> {insight.rating}
                              </div>
                              <div className="mt-2 d-flex gap-2 justify-content-center">
                                <button className="btn btn-warning modern-btn" onClick={() => handleEdit(insight, 'insight')}>
                                  Edit
                                </button>
                                <button className="btn btn-danger modern-btn" onClick={() => handleDelete(insight.id, 'insight')}>
                                  Delete
                                </button>
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
                <div className="container mt-5">
                  <h2 className="text-center mb-4 text-primary">Share Your Insight</h2>
                  <form className="card p-4 bg-dark text-light" style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)' }} onSubmit={(e) => {
                    e.preventDefault();
                    axios.post('http://localhost:8000/api/insights/', {
                      userName: formData.userName,
                      userComment: formData.userComment,
                      rating: formData.rating
                    }, {
                      headers: { 'Content-Type': 'application/json' }
                    })
                      .then(() => {
                        alert('Insight submitted successfully! An admin will review it.');
                        resetForm();
                      })
                      .catch(error => {
                        console.error('Error submitting insight:', error.response ? error.response.data : error.message);
                        alert('Error submitting insight: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
                      });
                  }}>
                    <input
                      type="text"
                      className="form-control bg-light text-dark mb-3"
                      placeholder="Your Name"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value, model: 'insight' })}
                      required
                    />
                    <textarea
                      className="form-control bg-light text-dark mb-3"
                      placeholder="Your Comment"
                      value={formData.userComment}
                      onChange={(e) => setFormData({ ...formData, userComment: e.target.value, model: 'insight' })}
                      rows="3"
                      required
                    />
                    <select
                      className="form-control bg-light text-dark mb-3"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value, model: 'insight' })}
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
              </div>
            ) : (
              artistSpotlights.map(artist => (
                <div className="col-md-4" key={artist.id}>
                  <div className="card bg-dark text-light" style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)' }}>
                    <img src={artist.image} className="card-img-top" style={{ borderRadius: '10px 10px 0 0', objectFit: 'cover', height: '250px' }} alt={artist.name} />
                    <div className="card-body p-4">
                      <h5 className="card-title">{artist.name}</h5>
                      <p className="card-text text-muted">{artist.description}</p>
                      <p className="fw-bold">Portfolio: {artist.portfolio_url || 'Not provided'}</p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-warning modern-btn flex-grow-1" onClick={() => handleEdit(artist, 'artist-spotlight')}>
                          Edit
                        </button>
                        <button className="btn btn-danger modern-btn flex-grow-1" onClick={() => handleDelete(artist.id, 'artist-spotlight')}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
