import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if client is already authenticated
    const user = localStorage.getItem('client_user');
    const token = localStorage.getItem('client_token');
    
    if (user && token) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // In a real app, this would be an API call to your backend
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockClients = [
          { id: 1, name: "Acme Inc", username: "acme", password: "password123" },
          { id: 2, name: "Tech Solutions", username: "tech", password: "password123" },
          { id: 3, name: "Global Retail", username: "retail", password: "password123" }
        ];
        
        const client = mockClients.find(c => 
          c.username === username && c.password === password
        );
        
        if (client) {
          const userData = {
            id: client.id,
            name: client.name,
            username: client.username
          };
          
          localStorage.setItem('client_user', JSON.stringify(userData));
          localStorage.setItem('client_token', 'client_token_value');
          setCurrentUser(userData);
          resolve(userData);
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem('client_user');
    localStorage.removeItem('client_token');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
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