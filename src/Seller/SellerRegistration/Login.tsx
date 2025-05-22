import React, { useState } from 'react';
import './Login.css'; 
import { Link } from 'react-router-dom';

// Importiere OAuth-Logos
import googleLogo from '../../assets/google.png';
import yandexLogo from '../../assets/Yandex2.svg';
import wechatLogo from '../../assets/Wechat2.svg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic will be implemented here
    console.log('Login attempted with:', { email, password, rememberMe });
  };

  const handleOAuthLogin = (provider: string) => {
    // OAuth login logic will be implemented here
    console.log(`OAuth login attempted with provider: ${provider}`);
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Password recovery logic will be implemented here
    console.log('Password recovery attempted with:', recoveryEmail);
    setRecoverySuccess(true);
  };
  
  const togglePasswordRecovery = () => {
    setShowPasswordRecovery(!showPasswordRecovery);
    setRecoverySuccess(false);
  };

  return (
    <div className="auth-container">
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
          
          {!showPasswordRecovery ? (
            <>
              <h2>Welcome Back</h2>
              <p>Sign in to access your account</p>
            </>
          ) : (
            <>
              <h2>Reset Password</h2>
              <p>We'll send you a link to reset your password</p>
            </>
          )}
        </div>

        {!showPasswordRecovery ? (
          // Login Form
          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Your password"
                required
              />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Stay signed in</label>
              </div>
              <button 
                type="button" 
                onClick={togglePasswordRecovery}
                className="forgot-password-btn"
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="auth-button">
              Sign In
            </button>
            
            <div className="auth-footer">
              <p>Don't have an account?</p>
              <Link to="/seller/register" className="auth-link">
                Register now
              </Link>
              <div className="back-to-home">
                <Link to="/" className="home-link">Back to Homepage</Link>
              </div>
            </div>
          </form>
        ) : (
          // Password Recovery Form
          <form onSubmit={handleRecoverySubmit} className="auth-form">
            {recoverySuccess ? (
              <div className="recovery-success">
                <p>We've sent you an email with a link to reset your password.</p>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="recoveryEmail">Email</label>
                <input
                  type="email"
                  id="recoveryEmail"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                />
              </div>
            )}

            <div className="recovery-buttons">
              {!recoverySuccess && (
                <button type="submit" className="auth-button">
                  Send Link
                </button>
              )}
              <button 
                type="button" 
                onClick={togglePasswordRecovery}
                className="back-to-login"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {!showPasswordRecovery && (
          <div className="oauth-container">
            <div className="oauth-divider">
              <span className="oauth-divider-text">or sign in with</span>
            </div>
            <div className="oauth-buttons">
              <button 
                className="oauth-button" 
                onClick={() => handleOAuthLogin('google')}
                aria-label="Sign in with Google"
              >
                <img src={googleLogo} alt="Google" />
              </button>
              <button 
                className="oauth-button" 
                onClick={() => handleOAuthLogin('yandex')}
                aria-label="Sign in with Yandex"
              >
                <img src={yandexLogo} alt="Yandex" />
              </button>
              <button 
                className="oauth-button" 
                onClick={() => handleOAuthLogin('wechat')}
                aria-label="Sign in with WeChat"
              >
                <img src={wechatLogo} alt="WeChat" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
