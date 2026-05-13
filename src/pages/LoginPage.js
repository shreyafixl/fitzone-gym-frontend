import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth, ROLE_ROUTES } from '../contexts/AuthContext';

const DEMO_HINTS = [
  { role: 'Super Admin', email: 'superadmin@gym.com', password: 'SuperAdmin@123' },
  { role: 'Admin', email: 'admin@gym.com', password: '123456' },
  { role: 'Trainer', email: 'trainer@gym.com', password: '123456' },
  { role: 'Member', email: 'user@gym.com', password: '123456' },
];

function LoginPage() {
  const { login, isLoggedIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect to role-specific dashboard
  if (isLoggedIn && user) {
    const redirectPath = ROLE_ROUTES[user.role] || '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    const result = await login(form.email, form.password);

    if (result.success) {
      // Redirect based on user role
      const redirectPath = ROLE_ROUTES[result.user.role] || '/dashboard';
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setForm({ email, password });
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <span className="login-logo-icon">⚡</span>
          <h1 className="login-title">FitZone</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {/* Demo hints */}
        <div className="login-demo-hints">
          <p className="login-demo-label">Quick demo login:</p>

          <div className="login-demo-grid">
            {DEMO_HINTS.map(h => (
              <button
                key={h.role}
                className="login-demo-btn"
                type="button"
                onClick={() => fillDemo(h.email, h.password)}
              >
                {h.role}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              className="auth-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              className="auth-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full login-submit"
            disabled={loading || authLoading}
          >
            {loading || authLoading ? 'Signing in…' : 'Sign In'}
          </button>

        </form>

        <p className="login-footer-note">
          Demo passwords: Super Admin uses <strong>SuperAdmin@123</strong>, others use <strong>123456</strong>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;