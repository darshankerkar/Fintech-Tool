import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">CryptoPulse</span>
          <span className="logo-badge">Lite</span>
        </Link>

        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/finance-analyzer" 
            className={`navbar-link ${location.pathname === '/finance-analyzer' ? 'active' : ''}`}
          >
            Finance Analyzer
          </Link>
        </div>

        <div className="navbar-actions">
          <button className="currency-toggle">
            <span className="currency-icon">₹</span>
            <span>INR</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
