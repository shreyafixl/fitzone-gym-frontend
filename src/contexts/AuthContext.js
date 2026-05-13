import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';
import api from '../services/api';

// Demo accounts for testing (kept for backward compatibility)
const DEMO_USERS = [
  { id: 1, email: 'superadmin@gym.com', password: 'SuperAdmin@123', role: 'superadmin', fullName: 'Aditya Sharma',  avatar: 'AS' },
  { id: 2, email: 'admin@gym.com',      password: '123456', role: 'admin',      fullName: 'Rajesh Kumar',  avatar: 'RK' },
  { id: 3, email: 'trainer@gym.com',    password: '123456', role: 'trainer',    fullName: 'Vikram Singh',  avatar: 'VS' },
];

// Role → redirect path
export const ROLE_ROUTES = {
  superadmin: '/dashboard/superadmin',
  admin:      '/dashboard/admin',
  trainer:    '/dashboard/trainer',
  member:     '/dashboard',
};

const AuthContext = createContext(null);

function loadUser() {
  try {
    const raw = localStorage.getItem('gym-auth-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('gym-auth-token');
    const savedUser = loadUser();
    
    if (token && savedUser) {
      // Verify token is still valid by fetching user data
      authAPI.getMe()
        .then(response => {
          if (response.success && response.data.user) {
            const userData = response.data.user;
            localStorage.setItem('gym-auth-user', JSON.stringify(userData));
            setUser(userData);
          }
        })
        .catch(() => {
          // Token invalid, clear auth data
          localStorage.removeItem('gym-auth-token');
          localStorage.removeItem('gym-auth-user');
          setUser(null);
        });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    
    try {
      console.log('[Auth] Attempting login for:', email);
      
      try {
        // Try SuperAdmin login first
        const response = await api.post('/superadmin/auth/login', { email, password });
        console.log('[Auth] SuperAdmin login response:', response);
        
        if (response.data && response.data.data) {
          const { admin: userData, token } = response.data.data;
          console.log('[Auth] SuperAdmin login successful, user:', userData);
          
          // Save token and user data
          localStorage.setItem('gym-auth-token', token);
          localStorage.setItem('gym-auth-user', JSON.stringify(userData));
          setUser(userData);
          setLoading(false);
          
          return { success: true, user: userData };
        }
      } catch (superAdminError) {
        console.log('[Auth] SuperAdmin login failed:', superAdminError.message);
        
        // If SuperAdmin login fails, try member login
        try {
          const response = await authAPI.login(email, password);
          console.log('[Auth] Member login response:', response);
          
          if (response.success && response.data) {
            const { user: userData, token } = response.data;
            console.log('[Auth] Member login successful, user:', userData);
            
            // Save token and user data
            localStorage.setItem('gym-auth-token', token);
            localStorage.setItem('gym-auth-user', JSON.stringify(userData));
            setUser(userData);
            setLoading(false);
            
            return { success: true, user: userData };
          }
        } catch (memberError) {
          console.log('[Auth] Member login also failed:', memberError.message);
          throw memberError;
        }
      }
    } catch (error) {
      console.error('[Auth] Login error:', error);
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Invalid email or password.';
      console.error('[Auth] Login failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const signup = useCallback(async (fullName, email, password, phone = null, gender = 'other', age = 18) => {
    setLoading(true);
    
    try {
      const response = await authAPI.signup(fullName, email, password, phone, gender, age);
      
      if (response.success && response.data) {
        // Do NOT auto-login after signup
        // Just return success without saving token/user data
        setLoading(false);
        
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout API if token exists
      const token = localStorage.getItem('gym-auth-token');
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      // Ignore logout API errors
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('gym-auth-token');
      localStorage.removeItem('gym-auth-user');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
