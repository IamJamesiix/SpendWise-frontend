import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedUser = localStorage.getItem('spendwise_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('spendwise_user');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data);
    setIsAuthenticated(true);
    localStorage.setItem('spendwise_user', JSON.stringify(data));
    return data;
  };

  const signup = async (userData) => {
    const data = await authService.signup(userData);
    return data;
  };

  const verifyEmail = async (email, otp) => {
    const data = await authService.verifyEmail(email, otp);
    setUser(data.user);
    setIsAuthenticated(true);
    localStorage.setItem('spendwise_user', JSON.stringify(data.user));
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('spendwise_user');
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('spendwise_user', JSON.stringify({ ...user, ...userData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    verifyEmail,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};