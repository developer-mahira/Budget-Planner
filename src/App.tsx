import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Loader from './components/common/Loader';
import WelcomeScreen from './features/auth/WelcomeScreen';

// Lazy load feature components for better performance
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const BudgetPlanner = lazy(() => import('./features/budget/BudgetPlanner'));
const Expenses = lazy(() => import('./features/expenses/Expenses'));
const Calculator = lazy(() => import('./features/calculator/Calculator'));
const Notes = lazy(() => import('./features/notes/Notes'));
const Reports = lazy(() => import('./features/reports/Reports'));
const Settings = lazy(() => import('./features/settings/Settings'));

const App: React.FC = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  if (!isOnboardingComplete) {
    return <WelcomeScreen onComplete={() => setIsOnboardingComplete(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Navbar />
            <main className="p-6">
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/budget" element={<BudgetPlanner />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
};

export default App;