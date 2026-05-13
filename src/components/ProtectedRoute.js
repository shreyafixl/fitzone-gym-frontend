import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Wraps a route and enforces authentication + optional role check.
 *
 * Props:
 *   allowedRoles  – array of roles that may access this route (omit to allow any logged-in user)
 *   redirectTo    – where to send unauthenticated visitors (default: '/login')
 */
function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }) {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but wrong role — send them to their own dashboard
    const roleRoutes = {
      superadmin: '/dashboard/superadmin',
      admin:      '/dashboard/admin',
      trainer:    '/dashboard/trainer',
      member:     '/dashboard',
      user:       '/dashboard',
    };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }

  return children;
}

export default ProtectedRoute;
