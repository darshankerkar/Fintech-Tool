import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './YahooFinanceValidator.css';

function YahooFinanceValidator() {
  const [symbol, setSymbol] = useState('BTC-USD');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const fetchYahooFinanceData = async () => {
    if (!symbol.trim()) {
      setError('Please enter a valid symbol');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setChartData([]);
      setTrendAnalysis(null);

      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?interval=1d&range=3mo`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`;

      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Symbol "${symbol}" not found or API error`);
      }

      const data = await response.json();

      const result = data.chart.result[0];
      
      if (!result || !result.timestamp || !result.indicators.quote[0].close) {
        throw new Error('Invalid data received from Yahoo Finance');
      }

      const timestamps = result.timestamp;
      const closePrices = result.indicators.quote[0].close;

      const formattedData = timestamps
        .map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          price: closePrices[index],
          timestamp: timestamp
        }))
        .filter(item => item.price !== null);

      setChartData(formattedData);

      const analysis = calculateTrendAnalysis(formattedData);
      setTrendAnalysis(analysis);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching Yahoo Finance data:', err);
      setError(err.message || 'Failed to fetch data. Please check the symbol and try again.');
      setLoading(false);
    }
  };

  const calculateTrendAnalysis = (data) => {
    if (data.length === 0) return null;

    const prices = data.map(d => d.price);
    const shortTermData = prices.slice(-7);
    const shortTermAvg = shortTermData.reduce((sum, price) => sum + price, 0) / shortTermData.length;
    const longTermAvg = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    const trendDifference = ((shortTermAvg - longTermAvg) / longTermAvg) * 100;

    let trendStatus;
    let trendColor;
    let trendIcon;

    if (trendDifference > 2) {
      trendStatus = 'Bullish';
      trendColor = '#4ade80';
      trendIcon = '↑';
    } else if (trendDifference < -2) {
      trendStatus = 'Bearish';
      trendColor = '#f87171';
      trendIcon = '↓';
    } else {
      trendStatus = 'Neutral';
      trendColor = '#94a3b8';
      trendIcon = '→';
    }


    const currentPrice = prices[prices.length - 1];
    const startPrice = prices[0];
    const overallChange = ((currentPrice - startPrice) / startPrice) * 100;

    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);

    return {
      shortTermAvg,
      longTermAvg,
      trendDifference,
      trendStatus,
      trendColor,
      trendIcon,
      currentPrice,
      overallChange,
      highestPrice,
      lowestPrice,
      dataPoints: data.length
    };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchYahooFinanceData();
    }
  };


  const popularSymbols = [
    { symbol: 'BTC-USD', name: 'Bitcoin' },
    { symbol: 'ETH-USD', name: 'Ethereum' },
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'MSFT', name: 'Microsoft' }
  ];

  return (
    <div className="yahoo-validator-container">
      <div className="validator-header">
        <h2 className="validator-title">
          <span className="title-icon">↗</span>
          Yahoo Finance Trend Validator
        </h2>
        <p className="validator-subtitle">
          Cross-validate market trends with Yahoo Finance data
        </p>
      </div>

      <div className="validator-input-section">
        <div className="input-group">
          <label htmlFor="symbol-input" className="input-label">
            Enter Symbol (e.g., BTC-USD, AAPL, TSLA)
          </label>
          <div className="input-wrapper">
            <input
              id="symbol-input"
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter ticker symbol..."
              className="symbol-input"
              disabled={loading}
            />
            <button
              onClick={fetchYahooFinanceData}
              disabled={loading}
              className="fetch-button"
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <span>⌕</span>
                  <span>Fetch Yahoo Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="quick-symbols">
          <span className="quick-label">Quick Access:</span>
          {popularSymbols.map((item) => (
            <button
              key={item.symbol}
              onClick={() => setSymbol(item.symbol)}
              className="quick-symbol-btn"
              disabled={loading}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="chart-section">
          <h3 className="chart-title">
            Historical Price Movement - {symbol}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
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
                tickFormatter={(value) => `$${value.toFixed(0)}`}
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={false}
                name="Closing Price"
                fill="url(#priceGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {trendAnalysis && (
        <div className="trend-analysis-section">
          <h3 className="analysis-title">Trend Analysis Results</h3>

          <div 
            className="trend-status-card"
            style={{ borderColor: trendAnalysis.trendColor }}
          >
            <div className="trend-icon-large">{trendAnalysis.trendIcon}</div>
            <div className="trend-status-content">
              <h4 style={{ color: trendAnalysis.trendColor }}>
                {trendAnalysis.trendStatus} Trend
              </h4>
              <p className="trend-description">
                {trendAnalysis.trendStatus === 'Bullish' && 
                  'Short-term average is above long-term average, indicating upward momentum'}
                {trendAnalysis.trendStatus === 'Bearish' && 
                  'Short-term average is below long-term average, indicating downward pressure'}
                {trendAnalysis.trendStatus === 'Neutral' && 
                  'Short-term and long-term averages are aligned, indicating stable movement'}
              </p>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Short-Term Avg (7 days)</span>
              <span className="metric-value">
                {formatCurrency(trendAnalysis.shortTermAvg)}
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">Long-Term Avg (Full Period)</span>
              <span className="metric-value">
                {formatCurrency(trendAnalysis.longTermAvg)}
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">Trend Difference</span>
              <span 
                className="metric-value"
                style={{ color: trendAnalysis.trendColor }}
              >
                {trendAnalysis.trendDifference > 0 ? '+' : ''}
                {trendAnalysis.trendDifference.toFixed(2)}%
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">Current Price</span>
              <span className="metric-value">
                {formatCurrency(trendAnalysis.currentPrice)}
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">Overall Change</span>
              <span 
                className="metric-value"
                style={{ color: trendAnalysis.overallChange >= 0 ? '#4ade80' : '#f87171' }}
              >
                {trendAnalysis.overallChange >= 0 ? '+' : ''}
                {trendAnalysis.overallChange.toFixed(2)}%
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">Price Range</span>
              <span className="metric-value metric-range">
                <span className="range-low">{formatCurrency(trendAnalysis.lowestPrice)}</span>
                <span className="range-separator">→</span>
                <span className="range-high">{formatCurrency(trendAnalysis.highestPrice)}</span>
              </span>
            </div>
          </div>

          <div className="data-info">
            <span className="info-icon">i</span>
            <span>
              Analysis based on {trendAnalysis.dataPoints} data points from Yahoo Finance API
            </span>
          </div>
        </div>
      )}
      {!loading && chartData.length === 0 && !error && (
        <div className="instructions-card">
          <h4>How to Use:</h4>
          <ol>
            <li>Enter a Yahoo Finance symbol (e.g., BTC-USD for Bitcoin, AAPL for Apple)</li>
            <li>Click "Fetch Yahoo Data" or press Enter</li>
            <li>View the historical price chart and trend analysis</li>
            <li>Compare results with CoinGecko data for validation</li>
          </ol>
          <div className="supported-symbols">
            <strong>Supported Formats:</strong>
            <ul>
              <li>Cryptocurrencies: BTC-USD, ETH-USD, ADA-USD</li>
              <li>Stocks: AAPL, TSLA, GOOGL, MSFT</li>
              <li>Indices: ^GSPC (S&P 500), ^DJI (Dow Jones)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default YahooFinanceValidator;
