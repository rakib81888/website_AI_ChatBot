import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already authenticated
    const token = localStorage.getItem('admin_token');
    if (token) {
      // In a real app, you would verify the token with the backend
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // In a real app, this would be an API call to your backend
    if (username === 'rakib' && password === 'rakibmim2223') {
      localStorage.setItem('admin_token', 'admin_token_value');
      setIsAuthenticated(true);
      return true;
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}