import React, { useState } from 'react';
import './register.css';
import { Link } from 'react-router-dom';

// Importiere OAuth-Logos
import googleLogo from '../../assets/google.png';
import yandexLogo from '../../assets/Yandex2.svg';
import wechatLogo from '../../assets/Wechat2.svg';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic will be implemented here
    console.log('Registration attempted with:', { fullName, email, password, agreeTerms });
  };

  const handleOAuthRegister = (provider: string) => {
    // OAuth registration logic will be implemented here
    console.log(`OAuth registration attempted with provider: ${provider}`);
  };

  return (
    <div className="auth-container">
      {/* Dekorative Hintergrundelemente */}
      <div className="bg-decoration"></div>
      <div className="bg-decoration"></div>
      <div className="bg-decoration"></div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo">
              <h1 style={{ color: 'red' }}>Realtecc</h1>
            </div>
          </div>
          <h2>Create New Account</h2>
          <p>Join our trading community</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-options">
            <div className="agree-terms">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="agreeTerms">
                I agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>
          
          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link to="/seller/login" className="auth-link">
              Sign In
            </Link>
            <div className="back-to-home">
              <Link to="/" className="home-link">Back to Homepage</Link>
            </div>
          </div>
        </form>

        <div className="oauth-container">
          <div className="oauth-divider">
            <span className="oauth-divider-text">or register with</span>
          </div>
          <div className="oauth-buttons">
            <button 
              className="oauth-button" 
              onClick={() => handleOAuthRegister('google')}
              aria-label="Register with Google"
            >
              <img src={googleLogo} alt="Google" />
            </button>
            <button 
              className="oauth-button" 
              onClick={() => handleOAuthRegister('yandex')}
              aria-label="Register with Yandex"
            >
              <img src={yandexLogo} alt="Yandex" />
            </button>
            <button 
              className="oauth-button" 
              onClick={() => handleOAuthRegister('wechat')}
              aria-label="Register with WeChat"
            >
              <img src={wechatLogo} alt="WeChat" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
