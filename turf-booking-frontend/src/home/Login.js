import React, { useState } from 'react';
import axios from 'axios';
import TOD from '../assets/logo/TOD.png';
import './Login.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Login = ({ isOpen, closeModal, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', { email, password });
      if (response.status === 200) {
        const isAdmin = email === 'admin@gmail.com' && password === 'admin'; 
        onLoginSuccess(isAdmin ? 'admin' : 'user');
        setEmail('');
        setPassword('');
        closeModal(); 
        alert('Login successful!');
      } else {
        alert('Login failed: Invalid email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      const errorMessage = error.response?.data?.message || 'Invalid email or password.';
      alert(`Login failed. ${errorMessage}`);
    }
  };

  if (!isOpen) return null; 

  return (
    <Modal show={isOpen} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Form Section */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="image-container text-center">
          <img
            src={TOD}
            alt="Login"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            className="py-1 px-3"
            style={{
              backgroundColor: '#007bff',
              borderColor: '#007bff',
              fontSize: '14px',
            }}
          >
            Login
          </Button>
          <Button
            variant="secondary"
            onClick={closeModal}
            className="py-1 px-3"
            style={{
              fontSize: '14px',
            }}
          >
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Login;
