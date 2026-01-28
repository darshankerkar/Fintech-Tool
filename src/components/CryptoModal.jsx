import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './CryptoModal.css';

function CryptoModal({ crypto, onClose, apiKey }) {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('7');
  const [loading, setLoading] = useState(true);
  const [detailedData, setDetailedData] = useState(null);

  useEffect(() => {
    if (crypto) {
      fetchDetailedData();
    }
  }, [crypto, timeframe]);

  const fetchDetailedData = async () => {
    try {
      setLoading(true);

      // Fetch detailed coin data
      const coinResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${crypto.id}?localization=false&tickers=false&community_data=true&developer_data=false`,
        {
          headers: {
            'x-cg-demo-api-key': apiKey
          }
        }
      );
      const coinData = await coinResponse.json();
      setDetailedData(coinData);

      // Fetch chart data
      const chartResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${crypto.id}/market_chart?vs_currency=inr&days=${timeframe}`,
        {
          headers: {
            'x-cg-demo-api-key': apiKey
          }
        }
      );
      const data = await chartResponse.json();

      // Format data for charts
      const formattedData = data.prices.map((price, index) => ({
        date: new Date(price[0]).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        }),
        price: price[1],
        volume: data.total_volumes[index] ? data.total_volumes[index][1] : 0,
        marketCap: data.market_caps[index] ? data.market_caps[index][1] : 0,
      }));

      setChartData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching detailed data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value) => {
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `₹${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  if (!crypto) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-crypto-info">
            <img src={crypto.image} alt={crypto.name} className="modal-crypto-icon" />
            <div>
              <h2>{crypto.name}</h2>
              <span className="modal-crypto-symbol">{crypto.symbol.toUpperCase()}</span>
            </div>
          </div>
          <div className="modal-price-info">
            <div className="modal-current-price">
              {formatCurrency(crypto.current_price * 83)} {/* Approximate INR conversion */}
            </div>
            <div className={`modal-price-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
              {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}% (24h)
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="timeframe-selector">
          {['1', '7', '30', '90', '365'].map((days) => (
            <button
              key={days}
              className={`timeframe-btn ${timeframe === days ? 'active' : ''}`}
              onClick={() => setTimeframe(days)}
            >
              {days === '1' ? '24H' : days === '7' ? '7D' : days === '30' ? '1M' : days === '90' ? '3M' : '1Y'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Loading detailed analysis...</p>
          </div>
        ) : (
          <>
            {/* Price Chart */}
            <div className="chart-container">
              <h3>Price Chart (INR)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '0.75rem' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(15, 23, 42, 0.95)', 
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(value) => [formatCurrency(value), 'Price']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#667eea" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Volume Chart */}
            <div className="chart-container">
              <h3>Trading Volume (INR)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '0.75rem' }}
                    tickFormatter={(value) => formatLargeNumber(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(15, 23, 42, 0.95)', 
                      border: '1px solid rgba(74, 172, 254, 0.3)',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(value) => [formatLargeNumber(value), 'Volume']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#4facfe" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Market Statistics */}
            {detailedData && (
              <div className="market-stats">
                <h3>Market Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Market Cap</span>
                    <span className="stat-value">
                      {formatLargeNumber(crypto.market_cap * 83)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">24h Volume</span>
                    <span className="stat-value">
                      {formatLargeNumber(crypto.total_volume * 83)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Circulating Supply</span>
                    <span className="stat-value">
                      {crypto.circulating_supply?.toLocaleString('en-IN')} {crypto.symbol.toUpperCase()}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">All-Time High</span>
                    <span className="stat-value">
                      {formatCurrency(crypto.ath * 83)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">All-Time Low</span>
                    <span className="stat-value">
                      {formatCurrency(crypto.atl * 83)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Market Cap Rank</span>
                    <span className="stat-value">#{crypto.market_cap_rank}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Price Changes */}
            <div className="price-changes">
              <h3>Price Changes</h3>
              <div className="changes-grid">
                <div className="change-item">
                  <span className="change-label">1 Hour</span>
                  <span className={`change-value ${(crypto.price_change_percentage_1h_in_currency || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {(crypto.price_change_percentage_1h_in_currency || 0) >= 0 ? '+' : ''}
                    {(crypto.price_change_percentage_1h_in_currency || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="change-item">
                  <span className="change-label">24 Hours</span>
                  <span className={`change-value ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
                <div className="change-item">
                  <span className="change-label">7 Days</span>
                  <span className={`change-value ${(crypto.price_change_percentage_7d_in_currency || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {(crypto.price_change_percentage_7d_in_currency || 0) >= 0 ? '+' : ''}
                    {(crypto.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="change-item">
                  <span className="change-label">30 Days</span>
                  <span className={`change-value ${(crypto.price_change_percentage_30d_in_currency || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {(crypto.price_change_percentage_30d_in_currency || 0) >= 0 ? '+' : ''}
                    {(crypto.price_change_percentage_30d_in_currency || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CryptoModal;
