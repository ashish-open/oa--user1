import React from 'react';
import RiskDashboard from './pages/RiskDashboard';
import RiskInvestigation from './pages/RiskInvestigation';

export const riskRoutes = [
  { path: '/risk-dashboard', element: <RiskDashboard /> },
  { path: '/risk-investigation', element: <RiskInvestigation /> },
]; 