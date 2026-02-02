import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

const WelcomeScreen: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    budgetGoal: '',
    currency: 'USD',
  });
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save preferences to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(formData));
      // Redirect to signup
      navigate('/signup', { 
        state: { preferences: formData },
        replace: true 
      });
    }
  };

  // Redirect to login if user clicks "Already have an account"
  const handleExistingAccount = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BudgetPro</h1>
          <p className="text-gray-600">Let's set up your financial planner</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Progress indicator */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${i <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
                >
                  {i}
                </div>
                <span className="text-xs mt-2 text-gray-500">Step {i}</span>
              </div>
            ))}
          </div>

          {/* Step content */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900">Monthly Income</h2>
                <p className="text-gray-600">Enter your approximate monthly income</p>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                icon={<span className="text-gray-500">$</span>}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-accent mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900">Savings Goal</h2>
                <p className="text-gray-600">What percentage would you like to save each month?</p>
              </div>
              <Input
                type="number"
                placeholder="20"
                value={formData.budgetGoal}
                onChange={(e) => setFormData({ ...formData, budgetGoal: e.target.value })}
                icon={<span className="text-gray-500">%</span>}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900">Currency</h2>
                <p className="text-gray-600">Select your preferred currency</p>
              </div>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="INR">Indian Rupee (₹)</option>
                <option value="CAD">Canadian Dollar (C$)</option>
              </select>
            </div>
          )}

          <Button
            onClick={handleNext}
            fullWidth
            className="mt-6"
            disabled={
              (step === 1 && !formData.monthlyIncome) ||
              (step === 2 && !formData.budgetGoal)
            }
            icon={step < 3 ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {step < 3 ? 'Continue' : 'Create Account'}
          </Button>

          <div className="mt-4 text-center">
            <button
              onClick={handleExistingAccount}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          You can change these settings later
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;