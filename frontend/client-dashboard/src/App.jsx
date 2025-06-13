import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Training from './pages/Training';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { currentUser, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {currentUser && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentUser && <Navbar />}
        
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route 
              path="/" 
              element={currentUser ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!currentUser ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/training" 
              element={currentUser ? <Training /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={currentUser ? <Settings /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;