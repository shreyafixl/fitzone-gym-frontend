import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useAuth, ROLE_ROUTES } from '../contexts/AuthContext';

const INITIAL_LOGIN  = { email: '', password: '' };
const INITIAL_SIGNUP = { fullName: '', email: '', password: '', confirmPassword: '', phone: '', gender: 'other', age: 18 };

function AuthModal({ isOpen, onClose, defaultMode = 'login' }) {
  const { login, signup } = useAuth();
  const navigate  = useNavigate();

  const [mode,       setMode]       = useState(defaultMode);
  const [loginData,  setLoginData]  = useState(INITIAL_LOGIN);
  const [signupData, setSignupData] = useState(INITIAL_SIGNUP);
  const [errors,     setErrors]     = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [loginErr,   setLoginErr]   = useState('');
  const [signupErr,  setSignupErr]  = useState('');
  const [loading,    setLoading]    = useState(false);

  const handleClose = useCallback(() => {
    setLoginData(INITIAL_LOGIN);
    setSignupData(INITIAL_SIGNUP);
    setErrors({});
    setSubmitted(false);
    setLoginErr('');
    setSignupErr('');
    setLoading(false);
    setMode(defaultMode);
    onClose();
  }, [onClose, defaultMode]);

  const switchMode = (m) => { 
    setMode(m); 
    setErrors({}); 
    setSubmitted(false); 
    setLoginErr(''); 
    setSignupErr('');
    setLoading(false);
  };

  // ── Validation ───────────────────────────────────────────────
  const validateLogin = () => {
    const e = {};
    if (!loginData.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) e.email = 'Enter a valid email.';
    if (!loginData.password) e.password = 'Password is required.';
    return e;
  };

  const validateSignup = () => {
    const e = {};
    if (!signupData.fullName.trim()) e.fullName = 'Full name is required.';
    else if (signupData.fullName.trim().length < 2) e.fullName = 'Full name must be at least 2 characters.';
    
    if (!signupData.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) e.email = 'Enter a valid email.';
    
    if (!signupData.password) e.password = 'Password is required.';
    else if (signupData.password.length < 8) e.password = 'Password must be at least 8 characters.';
    
    if (!signupData.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (signupData.password !== signupData.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    
    if (!signupData.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^[0-9]{10}$/.test(signupData.phone.trim())) e.phone = 'Phone must be exactly 10 digits.';
    
    if (!signupData.gender) e.gender = 'Gender is required.';
    
    if (!signupData.age || signupData.age < 13) e.age = 'Age must be at least 13.';
    else if (signupData.age > 120) e.age = 'Age must be less than 120.';
    
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoginErr('');
    setLoading(true);

    const result = await login(loginData.email, loginData.password);
    setLoading(false);
    
    if (result.success) {
      handleClose();
      navigate(ROLE_ROUTES[result.user.role] || '/');
    } else {
      setLoginErr(result.error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length) { 
      setErrors(errs); 
      return; 
    }
    setErrors({});
    setSignupErr('');
    setLoading(true);

    try {
      const result = await signup(
        signupData.fullName.trim(),
        signupData.email.trim(),
        signupData.password,
        signupData.phone.trim(),
        signupData.gender.toLowerCase(),
        parseInt(signupData.age)
      );
      setLoading(false);

      if (result.success) {
        setSubmitted(true);
        // After 2 seconds, close modal and redirect to home with login modal
        setTimeout(() => {
          handleClose();
          // Redirect to home page
          navigate('/');
          // The parent component (Navbar) will handle opening the login modal
        }, 2000);
      } else {
        setSignupErr(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
      setSignupErr(errorMsg);
    }
  };

  // ── Field helpers ────────────────────────────────────────────
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (loginErr) setLoginErr('');
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (signupErr) setSignupErr('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={mode === 'login' ? 'Welcome Back' : 'Create Account'}>
      <div className="auth-modal">

        {/* Tabs */}
        <div className="auth-tabs" role="tablist">
          <button role="tab" aria-selected={mode === 'login'}
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => switchMode('login')}>Login</button>
          <button role="tab" aria-selected={mode === 'signup'}
            className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => switchMode('signup')}>Sign Up</button>
        </div>

        {/* Sign-up success */}
        {submitted && mode === 'signup' ? (
          <div className="auth-success">
            <span className="auth-success-icon">✓</span>
            <h3>Account created!</h3>
            <p>Your account has been successfully created. Please log in with your email and password to continue.</p>
            <button className="btn btn-primary btn-full" onClick={() => { setSubmitted(false); switchMode('login'); setLoginData({ email: signupData.email, password: '' }); }}>Go to Login</button>
          </div>

        ) : mode === 'login' ? (
          /* ── Login ── */
          <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
            {loginErr && <div className="login-error" role="alert">{loginErr}</div>}

            {/* Quick demo login buttons */}
            <div className="login-demo-hints">
              <p className="login-demo-label">Quick demo login:</p>
              <div className="login-demo-grid">
                {[
                  { role: 'Super Admin', email: 'superadmin@gym.com' },
                  { role: 'Admin',       email: 'admin@gym.com'      },
                  { role: 'Trainer',     email: 'trainer@gym.com'    },
                ].map(h => (
                  <button
                    key={h.role}
                    type="button"
                    className="login-demo-btn"
                    onClick={() => {
                      setLoginData({ email: h.email, password: '123456' });
                      setLoginErr('');
                      setErrors({});
                    }}
                  >
                    {h.role}
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="m-login-email" className="auth-label">Email</label>
              <input id="m-login-email" type="email" name="email"
                className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                placeholder="you@example.com" value={loginData.email}
                onChange={handleLoginChange} autoComplete="email" />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-login-password" className="auth-label">Password</label>
              <input id="m-login-password" type="password" name="password"
                className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}
                placeholder="Enter your password" value={loginData.password}
                onChange={handleLoginChange} autoComplete="current-password" />
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
            <p className="auth-switch-text">
              Don't have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={() => switchMode('signup')}>Sign Up</button>
            </p>
          </form>

        ) : (
          /* ── Sign Up ── */
          <form className="auth-form signup-form" onSubmit={handleSignupSubmit} noValidate>
            {signupErr && <div className="login-error" role="alert">{signupErr}</div>}
            
            <div className="auth-field">
              <label htmlFor="m-signup-fullname" className="auth-label">Full Name</label>
              <input id="m-signup-fullname" type="text" name="fullName"
                className={`auth-input ${errors.fullName ? 'auth-input--error' : ''}`}
                placeholder="John Doe" value={signupData.fullName}
                onChange={handleSignupChange} autoComplete="name" />
              {errors.fullName && <span className="auth-error">{errors.fullName}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-signup-email" className="auth-label">Email</label>
              <input id="m-signup-email" type="email" name="email"
                className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                placeholder="you@example.com" value={signupData.email}
                onChange={handleSignupChange} autoComplete="email" />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-signup-phone" className="auth-label">Phone Number</label>
              <input id="m-signup-phone" type="tel" name="phone"
                className={`auth-input ${errors.phone ? 'auth-input--error' : ''}`}
                placeholder="1234567890" value={signupData.phone}
                onChange={handleSignupChange} autoComplete="tel" />
              {errors.phone && <span className="auth-error">{errors.phone}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-signup-age" className="auth-label">Age</label>
              <input id="m-signup-age" type="number" name="age"
                className={`auth-input ${errors.age ? 'auth-input--error' : ''}`}
                placeholder="18" value={signupData.age}
                onChange={handleSignupChange} min="13" max="120" />
              {errors.age && <span className="auth-error">{errors.age}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-signup-gender" className="auth-label">Gender</label>
              <select id="m-signup-gender" name="gender"
                className={`auth-input ${errors.gender ? 'auth-input--error' : ''}`}
                value={signupData.gender}
                onChange={handleSignupChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="auth-error">{errors.gender}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-signup-password" className="auth-label">Password</label>
              <input id="m-signup-password" type="password" name="password"
                className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}
                placeholder="Min. 8 characters" value={signupData.password}
                onChange={handleSignupChange} autoComplete="new-password" />
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-signup-confirm" className="auth-label">Confirm Password</label>
              <input id="m-signup-confirm" type="password" name="confirmPassword"
                className={`auth-input ${errors.confirmPassword ? 'auth-input--error' : ''}`}
                placeholder="Re-enter your password" value={signupData.confirmPassword}
                onChange={handleSignupChange} autoComplete="new-password" />
              {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full auth-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="auth-switch-text">
              Already have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={() => switchMode('login')}>Login</button>
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default AuthModal;
