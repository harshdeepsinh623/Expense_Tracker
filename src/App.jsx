import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

// Context Provider
import { AppProvider } from './contexts/AppContext';

// Theme Provider
import ThemeProvider from './theme/ThemeProvider';

// Layout
import AppLayout from './components/Layout/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Profile from './pages/Profile';

// Dialogs
import TaskDialog from './components/dialogs/TaskDialog';
import FilterDialog from './components/dialogs/FilterDialog';
import BudgetDialog from './components/dialogs/BudgetDialog';

// Common Components
import Notification from './components/common/Notification';
import { useAppContext } from './contexts/AppContext';

// Auth Route component to protect routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Layout with all the shared components
const LayoutWithSharedComponents = () => {
  return (
    <>
      <AppLayout>
        <Outlet /> {/* This is where the child routes will be rendered */}
        
        {/* Global Dialogs */}
        <TaskDialog />
        <FilterDialog />
        <BudgetDialog />
        
        {/* Notifications */}
        <Notification />
      </AppLayout>
    </>
  );
};

function AppRoutes() {
  const { isAuthenticated } = useAppContext();
  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        
        {/* Protected routes with layout */}
        <Route 
          element={
            <ProtectedRoute>
              <LayoutWithSharedComponents />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Catch all route for protected routes */}
        <Route path="*" element={
          <Navigate to={isAuthenticated ? "/" : "/login"} replace />
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;