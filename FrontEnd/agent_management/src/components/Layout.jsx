import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SolcaeLogo from '../assets/solace-logo.svg';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={SolcaeLogo} alt="Solcae" />
          <span className="sidebar-brand">Alphagnito</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-item active' : 'nav-item'}>
            <i className="bi bi-speedometer2"></i> Dashboard
          </Link>
          <Link to="/agents" className={isActive('/agents') ? 'nav-item active' : 'nav-item'}>
            <i className="bi bi-people"></i> Agents
          </Link>
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div></div>
          <div className="topbar-right">
            <button className="btn btn-link text-secondary me-3">
              <i className="bi bi-bell"></i>
            </button>
            <div className="user-info">
              <img
                src="https://via.placeholder.com/40"
                alt="profile"
                className="user-avatar"
              />
              <span className="user-name">{user?.email || 'User'}</span>
            </div>
            <button
              className="btn btn-outline-secondary btn-sm ms-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;