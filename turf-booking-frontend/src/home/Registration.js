import React, { useState } from 'react';
import axios from 'axios';
import TOD from '../assets/logo/TOD.png';
import './Registration.css'; // Import the CSS file
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Registration = ({ isOpen, closeModal }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhoneInput = (value) => {
    // Allow only digits, limit to 10 characters
    const validPhone = value.replace(/\D/g, '').slice(0, 10);
    setPhone(validPhone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Validate phone number length
    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      // Send a POST request to register the user
      const response = await axios.post('http://localhost:8080/api/register', {
        firstname,
        lastname,
        email,
        phone,
        password,
      });

      if (response.status === 200) {
        alert('Registration successful!');

        // Reset the form fields
        setFirstname('');
        setLastname('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      // Handle server responses and network errors
      if (error.response) {
        if (error.response.status === 400) {
          alert(error.response.data || 'Invalid request. Please check your input.');
        } else if (error.response.status === 409) {
          alert('Email already exists.');
        } else {
          alert(`Error: ${error.response.data || 'Something went wrong. Please try again.'}`);
        }
      } else {
        console.error('Error during registration:', error);
        alert('Network error. Please check your connection.');
      }
    }
  };

  return (
    isOpen && (
      <Modal show={isOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form Section */}
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="firstname" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="lastname" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  value={phone}
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              <div className="form-group mb-4">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="image-container text-center">
            <img
              src={TOD}
              alt="Register"
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
              Register
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
    )
  );
};

export default Registration;
