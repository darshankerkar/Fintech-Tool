import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">CryptoPulse Lite</span>
          </h1>
          <p className="hero-subtitle">
            Your Intelligent Market Insight Tool for Real-time Financial Analysis
          </p>
          <p className="hero-description">
            Track live cryptocurrency prices, analyze market trends, and make informed
            financial decisions with our comprehensive dashboard powered by multiple
            financial APIs.
          </p>

          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              <span>Explore Dashboard</span>
              <span className="btn-icon">→</span>
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">📈</div>
            <div className="card-text">
              <div className="card-title">Live Prices</div>
              <div className="card-value">Real-time Updates</div>
            </div>
          </div>

          <div className="floating-card card-2">
            <div className="card-icon">🔍</div>
            <div className="card-text">
              <div className="card-title">Deep Analysis</div>
              <div className="card-value">Interactive Charts</div>
            </div>
          </div>

          <div className="floating-card card-3">
            <div className="card-icon">💹</div>
            <div className="card-text">
              <div className="card-title">Trend Detection</div>
              <div className="card-value">Live Insights</div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Powerful Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Live Asset Prices</h3>
            <p>Track real-time cryptocurrency prices with 24/7 market updates in INR</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Trend Comparison</h3>
            <p>Compare short-term (24h), medium-term (7d), and long-term (30d) trends</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚠️</div>
            <h3>Volatility Detection</h3>
            <p>Automated alerts for unusual market movements and high volatility</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Intelligent Insights</h3>
            <p>AI-powered market analysis with actionable recommendations</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Interactive Charts</h3>
            <p>Detailed price and volume charts with multiple timeframes</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure & Reliable</h3>
            <p>Authenticated API access with enterprise-grade security</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Start Trading Smarter?</h2>
        <p>Get instant access to comprehensive market insights</p>
        <Link to="/dashboard" className="btn-secondary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Home;
