import React, { useState } from 'react';
import '../../CSS/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import googleLogo from '../../../assets/google.png';
import yandexLogo from '../../../assets/Yandex2.svg';
import wechatLogo from '../../../assets/Wechat2.svg';
import { useDispatch } from 'react-redux';
import { SendLoginSignUpOTP, signInUser } from '../../../Services/AuthServices/Auth';
import { AppDispatch } from '../../../Store/Store';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (loginMethod === 'password') {
        // Password login logic will be integrated with backend
        console.log('Password login attempted with:', { email, password, rememberMe });
      } else if (loginMethod === 'otp') {
        if (!otpRequested) {
          const result = await dispatch(SendLoginSignUpOTP({ email, role: 'customer' })).unwrap();
          setOtpRequested(true);
          console.log('OTP sent successfully', result);
        } else {
          // Verify OTP
          const result = await dispatch(signInUser({ email, otp })).unwrap();
          console.log('Login successful', result);
          navigate('/');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      await dispatch(SendLoginSignUpOTP({ email, role: 'customer' })).unwrap();
      setOtpRequested(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP. Please try again.');
      console.error('OTP request error:', error);
    } finally {
      setLoading(false);
    }
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

  const switchLoginMethod = (method: 'password' | 'otp') => {
    setLoginMethod(method);
    setOtpRequested(false);
    setError(null);
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
              <h1>Realtecc</h1>
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
            {error && <div className="error-message">{error}</div>}
            
            <div className="login-method-selector">
              <button 
                type="button" 
                className={`method-btn ${loginMethod === 'password' ? 'active' : ''}`}
                onClick={() => switchLoginMethod('password')}
              >
                Password
              </button>
              <button 
                type="button" 
                className={`method-btn ${loginMethod === 'otp' ? 'active' : ''}`}
                onClick={() => switchLoginMethod('otp')}
              >
                OTP
              </button>
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

            {loginMethod === 'password' ? (
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
            ) : (
              <>
                {otpRequested ? (
                  <div className="form-group">
                    <label htmlFor="otp">OTP</label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP sent to your email"
                      required
                    />
                  </div>
                ) : null}
              </>
            )}

            {loginMethod === 'password' && (
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
            )}

            {loginMethod === 'otp' && !otpRequested ? (
              <button 
                type="button" 
                className="auth-button"
                onClick={handleRequestOtp}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Request OTP'}
              </button>
            ) : (
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            )}
            
            <div className="auth-footer">
              <p>Don't have an account?</p>
              <Link to="/customer/register" className="auth-link">
                Register now
              </Link>
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
