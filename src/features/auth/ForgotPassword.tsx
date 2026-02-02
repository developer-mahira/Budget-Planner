import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code, 3: New password
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // In a real app, this would be generated and sent via email
  const generatedCode = '123456';

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email) {
      toast.success(`Reset code sent to ${email} (Demo code: ${generatedCode})`);
      setStep(2);
    } else {
      toast.error('Please enter your email address');
    }

    setIsLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (resetCode === generatedCode) {
      toast.success('Code verified successfully');
      setStep(3);
    } else {
      toast.error('Invalid reset code');
    }

    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Password reset successfully! You can now login with your new password');
    
    // Reset form and go back to login
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);

    setIsLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Reset Your Password</h2>
              <p className="text-gray-600">
                Enter your email address and we'll send you a reset code
              </p>
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              required
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading || !email}
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Enter Reset Code</h2>
              <p className="text-gray-600">
                We sent a 6-digit code to <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Demo code: <span className="font-bold">{generatedCode}</span>
              </p>
            </div>

            <Input
              label="6-Digit Reset Code"
              type="text"
              placeholder="123456"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading || resetCode.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSendCode}
                className="text-sm text-accent hover:text-blue-600"
              >
                Resend code
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Password</h2>
              <p className="text-gray-600">Enter your new password</p>
            </div>

            <div>
              <Input
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div>
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                <strong>Password requirements:</strong> At least 6 characters
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading || !newPassword || !confirmPassword}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Follow the steps to reset your password</p>
        </div>

        <Card>
          {renderStep()}

          {/* Step indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step {step} of 3</span>
              <span className="text-sm font-medium text-gray-900">
                {step === 1 && 'Enter Email'}
                {step === 2 && 'Enter Code'}
                {step === 3 && 'New Password'}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a href="#" className="text-accent hover:text-blue-600">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;