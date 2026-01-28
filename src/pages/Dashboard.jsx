import React, { useState, useEffect } from 'react';
import CryptoModal from '../components/CryptoModal';
import YahooFinanceValidator from '../components/YahooFinanceValidator';
import './Dashboard.css';

function Dashboard() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [insights, setInsights] = useState([]);

  const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || 'CG-NgwMJGKyDCA3GbKvPFRB8Wva';

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d',
        {
          headers: {
            'x-cg-demo-api-key': COINGECKO_API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }

      const data = await response.json();
      setCryptoData(data);
      generateInsights(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const generateInsights = (cryptos) => {
    const newInsights = [];

    cryptos.forEach((crypto) => {
      const volatility = Math.abs(crypto.price_change_percentage_24h);
      if (volatility > 5) {
        newInsights.push({
          type: 'warning',
          icon: '⚠️',
          title: `High Volatility: ${crypto.name}`,
          description: `${crypto.name} has moved ${crypto.price_change_percentage_24h.toFixed(2)}% in 24h`,
        });
      }
    });

    cryptos.forEach((crypto) => {
      const change24h = crypto.price_change_percentage_24h || 0;
      const change7d = crypto.price_change_percentage_7d_in_currency || 0;

      if (change24h > 0 && change7d < -5) {
        newInsights.push({
          type: 'info',
          icon: '🔄',
          title: `Trend Reversal: ${crypto.name}`,
          description: `Up ${change24h.toFixed(2)}% today but down ${Math.abs(change7d).toFixed(2)}% over 7 days`,
        });
      }
    });

    setInsights(newInsights.slice(0, 3));
  };

  const formatCurrency = (value) => {
    const inrValue = value * 83;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(inrValue);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <h2>Loading Market Data...</h2>
          <p>Fetching real-time cryptocurrency prices</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">
          <h2>⚠️ Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={fetchCryptoData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Cryptocurrency Dashboard</h1>
          <p>Real-time market data in Indian Rupees (INR)</p>
        </div>
        <button onClick={fetchCryptoData} className="refresh-btn">
          <span>🔄</span>
          <span>Refresh Data</span>
        </button>
      </div>

      {insights.length > 0 && (
        <div className="insights-section">
          <h2>🧠 Market Insights</h2>
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type}`}>
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-content">
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="crypto-grid">
        {cryptoData.map((crypto) => (
          <div
            key={crypto.id}
            className="crypto-card-dashboard"
            onClick={() => setSelectedCrypto(crypto)}
          >
            <div className="crypto-card-header">
              <img src={crypto.image} alt={crypto.name} className="crypto-img" />
              <div className="crypto-name-section">
                <h3>{crypto.name}</h3>
                <span className="crypto-symbol">{crypto.symbol.toUpperCase()}</span>
              </div>
            </div>

            <div className="crypto-price-section">
              <div className="current-price">{formatCurrency(crypto.current_price)}</div>
              <div className={`price-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                {formatPercentage(crypto.price_change_percentage_24h)}
              </div>
            </div>

            <div className="crypto-stats">
              <div className="stat-row">
                <span className="stat-label">Market Cap</span>
                <span className="stat-value">
                  {formatCurrency(crypto.market_cap).slice(0, -3)}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">24h Volume</span>
                <span className="stat-value">
                  {formatCurrency(crypto.total_volume).slice(0, -3)}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">7d Change</span>
                <span className={`stat-value ${(crypto.price_change_percentage_7d_in_currency || 0) >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
                </span>
              </div>
            </div>

            <div className="view-details-btn">
              <span>View Detailed Analysis</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      <YahooFinanceValidator />

      {selectedCrypto && (
        <CryptoModal
          crypto={selectedCrypto}
          onClose={() => setSelectedCrypto(null)}
          apiKey={COINGECKO_API_KEY}
        />
      )}
    </div>
  );
}

export default Dashboard;
