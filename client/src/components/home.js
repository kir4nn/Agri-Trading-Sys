import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css'; // Import your CSS file for styling
import TypingAnimation from '../TypingAnimation';

import step1 from '../images/step1.jpg';
import step2 from '../images/step2.jpeg';
import step3 from '../images/step3.png';
import icon1 from '../images/iconn1.png';
import icon2 from '../images/image.png';
import icon3 from '../images/icon3.png';




function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [message, setMessage] = useState("");

  const handleJoinNowClick = () => {
    navigate('/login');
  };

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout logic (e.g., clear session, remove tokens, etc.)
    setIsLoggedIn(false); // Update login status to false
  };
  
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    // Logic to send message to ddd@gmail.com
    const email = "ddd@gmail.com";
    const subject = "Message from Contact Us form";
    const body = message;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };


  return (
    <div className="App">
        <nav className="navbar">
        <a href="#hero" className="nav-link">Home</a>
        <a href="#about" className="nav-link">About Us</a>
        <a href="#benefits" className="nav-link">Benefits</a>
        <a href="#how-it-works" className="nav-link">How It Works</a>
        <a href="#testimonials" className="nav-link">Testimonials</a>
        <a href="#contact" className="nav-link">Contact Us</a>
      </nav>  
      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className=""></div>
        <div className="hero-content">
          <h1 className="shivam"><TypingAnimation text="Welcome to Our Agricultural Trading Platform" delay={100} loop={true} speed={120} className="shivam" />
        </h1>
          <p style={{ color: 'white' }}>Connecting farmers and buyers for sustainable agriculture</p>
          {isLoggedIn ? null : (
          <div className="hero-buttons">
            <button className="login-btn" onClick={handleJoinNowClick}>Join Now!</button>
          </div>
        )}

        </div> 
      </section>

          {/* About Us Section */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>We are dedicated to revolutionizing the agricultural industry by providing a platform where farmers can directly sell their produce to buyers.</p>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <h2>Benefits</h2>
        <div className="benefit">
        <img src={icon1} alt="Example" />
          <p>Direct from Farm: Buy fresh produce directly from local farmers.</p>
        </div>
        <div className="benefit">
        <img src={icon2} alt="Example" />
          <p>Wide Variety: Explore a diverse range of agricultural products.</p>
        </div>
        <div className="benefit">
        <img src={icon3} alt="Example" />
          <p>Secure Transactions: Safe and reliable payment processing.</p>
        </div>
      </section>



      {/* How it Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
          <img src={step1} alt="Example" />;
            <p>Step 1: Farmers list their products on our platform.</p>
          </div>
          <div className="step">
          <img src={step2} alt="Example" />;
            <p>Step 2: Buyers browse products and make purchases.</p>
          </div>
          <div className="step">
          <img src={step3} alt="Example" />;
            <p>Step 3: Secure transactions and delivery.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <h2>Testimonials</h2>
        <div className="testimonial">
          <p>"The platform helped me sell my farm produce directly to customers, increasing my profits."</p>
          <cite>- John Doe</cite>
        </div>
        <div className="testimonial">
          <p>"I love the convenience of buying fresh vegetables from local farmers. Great initiative!"</p>
          <cite>- Jane Smith</cite>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <p>Have questions or feedback? Reach out to us!</p>
        <form onSubmit={handleMessageSubmit}>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message"></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
      {/* {isLoggedIn && (
          <button onClick={handleLogout}>Logout</button>
        )} */}
      {/* Footer */}
      <footer>
        <p>&copy; 2024 Agricultural Trading System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
