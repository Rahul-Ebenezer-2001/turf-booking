import React, { useState } from 'react';
import Slider from 'react-slick'; // Import React Slick
import './Home.css';
import Login from './Login';
import Registration from './Registration';
import AdminDashboard from '../admin/AdminDashboard';
import UserDashboard from '../customer/CustomerDashboard';
import TOD from '../assets/logo/TOD.png';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import slide1 from '../assets/turf/turf1.png'; // Example carousel images
import slide2 from '../assets/turf/turf2.png';
import slide3 from '../assets/turf/turf3.png';
import slide4 from '../assets/turf/turf4.png';
import slide5 from '../assets/turf/turf5.png';
import profile from '../assets/navbar/profile.png';
import pic1 from '../assets/slides/pic1.png';
import pic2 from '../assets/slides/pic2.png';
import pic3 from '../assets/slides/pic3.png';
import pic4 from '../assets/slides/pic4.png';
import pic5 from '../assets/slides/pic5.png';
import pic6 from '../assets/slides/pic6.png';
import pic7 from '../assets/slides/pic7.png';
import pic8 from '../assets/slides/pic8.png';
import pic9 from '../assets/slides/pic9.png';

const Home = () => {
  const [isRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openRegistrationModal = () => setIsRegistrationModalOpen(true);
  const closeRegistrationModal = () => setIsRegistrationModalOpen(false);

  const isModalOpen = isLoginModalOpen || isRegistrationModalOpen;

  // Settings for React Slick carousel
  const carouselSettings = {
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 1, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 3000, 
    cssEase: "linear", 
  };


  return (
    <div className={`home ${isModalOpen ? 'home-modal-open' : ''}`}>
      {/* Modal backdrop */}
      {isModalOpen && <div className="modal-back"></div>}

      {/* Navbar */}
      {!isLoggedIn && (
        <nav className="home-navbar-top">
          <div className="home-navbar-content">
            {/* Left side content (Home) */}
            <div className="home-navbar-left">
              <span className="home-navbar-text">Home</span>
            </div>

            {/* Right side content (Logo and Buttons) */}
            <div className="home-navbar-right">
              <img 
                src={profile}
                alt="Logo" 
                className="home-navbar-logo" 
              />
              <button className="home-navbar-button" onClick={openLoginModal}>
                Login
              </button>
              <text style={{color:"white"}}>|</text>
              <button className="home-navbar-button" onClick={openRegistrationModal}>
                Register
              </button>
            </div>
          </div>
        </nav>
      )}




      {/* Hero Section */}
      {!isLoggedIn && (
        <div className="hero">
          <div className="hero-content">
            <div className="hero-image-container">
              <img src={TOD} alt="Hero" className="hero-image" />
            </div>
            <div className="hero-text">
              <h1>Welcome to the Theatre of Dreams!</h1>
            </div>
            <div className="hero-button-container">
              <button
                className="book-button"
                onClick={openRegistrationModal}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carousel and Text Section */} 
      {!isLoggedIn && (
        <div className="carousel-text">
        <div className="carousel-text-container">
          <div class="text-content">
            <div class="heading-container">
              <h2>Features</h2>
            </div>
            <div class="paragraph-container">
              <p>Made from high-quality synthetic grass for a realistic playing surface</p>
              <p>Non-slip, shock-absorbing layer to enhance safety and reduce risk during play.</p>
              <p>Low-maintenance design, requiring minimal upkeep and easy cleaning.</p>
            </div>
          </div>
          <div className="carousel-container">
            <Slider {...carouselSettings}>
              <div>
                <img src={slide1} alt="Slide 1" className="carousel-image" />
              </div>
              <div>
                <img src={slide2} alt="Slide 2" className="carousel-image" />
              </div>
              <div>
                <img src={slide3} alt="Slide 3" className="carousel-image" />
              </div>
              <div>
                <img src={slide4} alt="Slide 4" className="carousel-image" />
              </div>
              <div>
                <img src={slide5} alt="Slide 5" className="carousel-image" />
              </div>
            </Slider>
          </div>
          <div class="text-content">
            <div class="heading-container">
              <h2>About the Turf</h2>
            </div>
            <div class="paragraph-container">
              <p>Designed for optimal performance in both casual and competitive play.</p>
              <p>Durable material that withstands heavy use and various weather conditions.</p>
              <p>Provides excellent grip and ball control for a wide range of sports.</p>
            </div>
          </div>
        </div>
        </div>
      )}


      {/* Carousel Section */}
      {!isLoggedIn && (
        <div className="images">
          <div className="images-container">
            {/* Carousel Container */}
              <div className="images-wrapper">
                <img src={pic1} alt="1" className="images-image-small" />
                <img src={pic2} alt="2" className="images-image-small" />
                <img src={pic3} alt="3" className="images-image-small" />
                <img src={pic4} alt="4" className="images-image-small" />
                <img src={pic5} alt="5" className="images-image-small" />
                <img src={pic6} alt="6" className="images-image-small" />
                <img src={pic7} alt="7" className="images-image-small" />
                <img src={pic8} alt="8" className="images-image-small" />
                <img src={pic9} alt="9" className="images-image-small" />
                
                {/* Repeat images to create an infinite effect */}
                <img src={pic1} alt="1" className="images-image-small" />
                <img src={pic2} alt="2" className="images-image-small" />
                <img src={pic3} alt="3" className="images-image-small" />
                <img src={pic4} alt="4" className="images-image-small" />
                <img src={pic5} alt="5" className="images-image-small" />
                <img src={pic6} alt="6" className="images-image-small" />
                <img src={pic7} alt="7" className="images-image-small" />
                <img src={pic8} alt="8" className="images-image-small" />
                <img src={pic9} alt="9" className="images-image-small" />
              </div>
          </div>
        </div>
      )}



      {/* Call-to-Action and Location Section */}
      {!isLoggedIn && (
        <div className="cta-location-wrapper">
          {/* CTA Section Container */}
          <div className="cta-container">
            <div className="cta-section">
              <h2>Ready to Challenge?</h2>
              <p>Join the Theatre of Dreams today and experience the best turf facilities.</p>
              <button className="cta-button" onClick={openLoginModal}>
                Book Now
              </button>
            </div>
          </div>

          {/* Location Section Container */}
          <div className="faq-container">
            <div className="faq-section">
              <h2>FAQ's</h2>
              <div className="faq">
                <h4>What are your opening hours?</h4>
                <p>We are open from 8 AM to 10 PM daily.</p>
                <h4>How do I book a spot?</h4>
                <p>You can book online or call us at (123) 456-7890.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {!isLoggedIn ? (
          <div style={{ marginTop: '20px' }}>
            {isRegistering ? <Registration /> : null}
          </div>
        ) : userRole === 'admin' ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <UserDashboard onLogout={handleLogout} />
        )}
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <Login
          isOpen={isLoginModalOpen}
          closeModal={closeLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Registration Modal */}
      {isRegistrationModalOpen && (
        <Registration
          isOpen={isRegistrationModalOpen}
          closeModal={closeRegistrationModal}
        />
      )}
    </div>
  );
};

export default Home;
