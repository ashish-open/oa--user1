import ServiceUsers from './pages/ServiceUsers';
import AppUsers from './pages/AppUsers';
import RiskInvestigation from './pages/RiskInvestigation';

export const userManagementRoutes = [
  { path: '/users/service', element: <ServiceUsers /> },
  { path: '/users/app', element: <AppUsers /> },
  { path: '/users/risk-investigation', element: <RiskInvestigation /> }
]; 