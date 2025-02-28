import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import About from './components/About';
import Contact from './components/Contact';
import Gallery from './components/Gallery';

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Grafitti</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 grid gap-0 column-gap-lg-5">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Gallery
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/gallery">All Art</Link></li>
                  <li><Link className="dropdown-item" to="/gallery/events">Events</Link></li>
                </ul>
              </li>
              {isAuthenticated && (
                <li className="nav-item px-5">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
              )}
            </ul>
            <form className="d-flex" role="search" onSubmit={(e) => { e.preventDefault(); alert('Search functionality to be implemented'); }}>
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/events" element={<GalleryEvents />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function GalleryEvents() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 display-4 text-primary fw-bold">Gallery - Events</h1>
      <p className="text-center lead text-muted">Discover our vibrant graffiti events, past and present, celebrating urban art in style.</p>
      <div className="row g-4">
        {/* Events would be fetched dynamically or hardcoded here for simplicity */}
        <div className="col-md-6">
          <div className="modern-card h-100">
            <div className="row g-0">
              <div className="col-4 d-flex align-items-center justify-content-center bg-danger text-white">
                <div className="text-center py-4">
                  <div className="day fs-1 fw-bolder">24</div>
                  <div className="month text-uppercase">Oct</div>
                  <div className="year">2025</div>
                </div>
              </div>
              <div className="col-8">
                <div className="card-body p-4">
                  <h3 className="card-title fw-bold">Urban Graffiti Expo</h3>
                  <p className="card-text text-muted">Join the biggest graffiti expo featuring top street artists worldwide.</p>
                  <p><strong>Location:</strong> Downtown Art District</p>
                  <p><strong>Time:</strong> 10:00 AM - 6:00 PM</p>
                  <a href="#" className="btn btn-danger modern-btn">Learn More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="modern-card h-100">
            <div className="row g-0">
              <div className="col-4 d-flex align-items-center justify-content-center bg-warning text-dark">
                <div className="text-center py-4">
                  <div className="day fs-1 fw-bolder">10</div>
                  <div className="month text-uppercase">Nov</div>
                  <div className="year">2025</div>
                </div>
              </div>
              <div className="col-8">
                <div className="card-body p-4">
                  <h3 className="card-title fw-bold">Street Art Workshop</h3>
                  <p className="card-text text-muted">Hands-on graffiti workshop with artist Wabuko Wabuko. Learn spray painting basics.</p>
                  <p><strong>Location:</strong> The Graffiti Hub</p>
                  <p><strong>Time:</strong> 12:00 PM - 4:00 PM</p>
                  <a href="#" className="btn btn-warning modern-btn text-dark">Join Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default App;
