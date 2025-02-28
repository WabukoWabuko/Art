import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/token/', credentials)
      .then(response => {
        localStorage.setItem('access_token', response.data.access);
        navigate('/admin');
      })
      .catch(() => setError('Invalid credentials'));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="modern-card p-4">
            <h2 className="text-center mb-4">Admin Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form className="form-modern" onSubmit={handleLogin}>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <button type="submit" className="btn btn-primary modern-btn w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
