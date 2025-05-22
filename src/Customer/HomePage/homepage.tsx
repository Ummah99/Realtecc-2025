import React from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';

const Homepage: React.FC = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="logo">
          <span className="logo-icon">🌿</span>
          <h1>Realtecc</h1>
        </div>
        <nav className="navigation">
          <Link to="/customer/login" className="nav-link">Sign In</Link>
          <Link to="/customer/register" className="nav-link register-button">Register</Link>
        </nav>
      </header>
      
      <section className="hero-section">
        <h2>Welcome to Realtecc</h2>
        <p>Discover our selection of high-quality products</p>
      </section>
      
      <section className="feature-section">
        <div className="feature">
          <h3>Natural Ingredients</h3>
          <p>All our products are made from natural ingredients</p>
        </div>
        <div className="feature">
          <h3>Cruelty-Free</h3>
          <p>We never test on animals and support ethical practices</p>
        </div>
        <div className="feature">
          <h3>Eco-Friendly</h3>
          <p>Sustainable packaging and environmentally conscious manufacturing</p>
        </div>
      </section>
      
      <section className="cta-section">
        <button className="cta-button">Discover Products</button>
        <Link to="/seller/register" className="cta-button seller-button">Become a Seller</Link>
      </section>
    </div>
  );
};

export default Homepage;