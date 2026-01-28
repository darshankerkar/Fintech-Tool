import React from 'react';
import YahooFinanceValidator from '../components/YahooFinanceValidator';
import './FinanceTrendAnalyzer.css';

function FinanceTrendAnalyzer() {
  return (
    <div className="finance-trend-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="gradient-text">Finance Trend Analyzer</span>
        </h1>
        <p className="page-subtitle">
          Cross-validate market trends with real-time Yahoo Finance data
        </p>
        <p className="page-description">
          Analyze historical price movements, compare short-term and long-term trends,
          and make informed investment decisions with comprehensive market insights.
        </p>
      </div>

      <YahooFinanceValidator />
    </div>
  );
}

export default FinanceTrendAnalyzer;
