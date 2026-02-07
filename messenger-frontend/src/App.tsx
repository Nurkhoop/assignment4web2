import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Header, Footer } from './components';
import Login from './pages/Login';
import Register from './pages/Register';
import Conversations from './pages/Conversations';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import PrivateRoute from './routes/PrivateRoute';
import './styles/global.css';
import useNotificationsSocket from './hooks/useNotificationsSocket';

const AppContent = () => {
  const location = useLocation();
  const activeChatId = location.pathname.startsWith('/chat/')
    ? location.pathname.replace('/chat/', '')
    : undefined;

  useNotificationsSocket(activeChatId);

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/conversations" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/chat/:conversationId" element={<Chat />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/conversations" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
