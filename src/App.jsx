import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FinanceTrendAnalyzer from './pages/FinanceTrendAnalyzer';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/finance-analyzer" element={<FinanceTrendAnalyzer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
