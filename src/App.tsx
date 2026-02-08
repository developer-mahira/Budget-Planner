import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

// Import components directly
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import WelcomeScreen from './features/auth/WelcomeScreen';
import ForgotPassword from './features/auth/ForgotPassword'; 
import Dashboard from './features/dashboard/Dashboard';
import BudgetPlanner from './features/budget/BudgetPlanner';
import Expenses from './features/expenses/Expenses';
import Calculator from './features/calculator/Calculator';
import Notes from './features/notes/Notes';
import Reports from './features/reports/Reports';
import Settings from './features/settings/Settings';
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="budget" element={<BudgetPlanner />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="notes" element={<Notes />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;