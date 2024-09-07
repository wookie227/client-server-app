import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import News from './components/News';
import Chat from './components/Chat';
import Header from './components/Header';
import styles from './App.module.css';
import Users from './components/Users';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={styles.App}>
      <Router>
        {isAuthenticated && <Header onLogout={handleLogout} />}
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/news" element={<News />} />
              <Route path="/chat" element={<Chat />} />
              <Route path='/users' element={<Users/>} />
              <Route path="*" element={<Navigate to="/news" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
