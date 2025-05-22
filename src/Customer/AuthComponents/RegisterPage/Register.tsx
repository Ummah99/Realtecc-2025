import React, { useState } from 'react';
import '../../CSS/register.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SendLoginSignUpOTP, signUpUser } from '../../../Services/AuthServices/Auth';
import { AppDispatch } from '../../../Store/Store';

// Import OAuth logos
import googleLogo from '../../../assets/google.png';
import yandexLogo from '../../../assets/Yandex2.svg';
import wechatLogo from '../../../assets/Wechat2.svg';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    if (!agreeTerms) {
      setError('Please agree to the Terms of Use and Privacy Policy');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      await dispatch(SendLoginSignUpOTP({ email, role: 'customer' })).unwrap();
      setStep('verification');
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP. Please try again.');
      console.error('OTP request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the OTP sent to your email');
      return;
    }
    
    if (!fullName) {
      setError('Please enter your full name');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const result = await dispatch(signUpUser({ email, otp, fullName })).unwrap();
      console.log('Registration successful', result);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = (provider: string) => {
    // OAuth registration logic will be implemented here
    console.log(`OAuth registration attempted with provider: ${provider}`);
  };

  const handleBack = () => {
    setStep('email');
    setError(null);
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
              <h1>Realtecc</h1>
            </div>
          </div>
          <h2>Create New Account</h2>
          {step === 'email' ? (
          <p>Join our trading community</p>
          ) : (
            <p>Verify your email</p>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 'email' ? (
          <form onSubmit={handleRequestOtp} className="auth-form">
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

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Request OTP'}
          </button>
          
          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link to="/customer/login" className="auth-link">
              Sign In
            </Link>
          </div>
        </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="disabled-input"
              />
            </div>

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

            <div className="register-buttons">
              <button type="button" className="back-button" onClick={handleBack}>
                Back
              </button>
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        {step === 'email' && (
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
        )}
      </div>
    </div>
  );
};

export default Register;
