import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdvancedLogin: React.FC = () => {
  const { signIn, isLoading, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect if already signed in
  useEffect(() => {
    // This will be handled by the Dashboard component
  }, []);

  // Timer for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.identifier.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!form.password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(form.identifier.trim(), form.password);
      
      if (result.success) {
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Sign in failed. Please try again.');
        setForm(prev => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed. Please try again.');
      setForm(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    setForgotPasswordLoading(true);
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setForgotPasswordEmail(email);
        setResetCodeSent(true);
        setResendTimer(60);
        toast.success('Password reset code sent to your email');
      } else {
        toast.error(result.error || 'Failed to send reset code');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset code. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    await handleForgotPasswordSubmit(forgotPasswordEmail);
  };

  const handlePasswordReset = async (code: string, newPassword: string) => {
    setForgotPasswordLoading(true);
    try {
      const result = await resetPassword(forgotPasswordEmail, code, newPassword);
      
      if (result.success) {
        toast.success('Password reset successful! You are now signed in.');
        resetForgotPasswordForm();
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Failed to reset password');
        if (result.error?.includes('verification code') || result.error?.includes('expired')) {
          setResetCodeSent(false);
          setForgotPasswordEmail('');
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetForgotPasswordForm = () => {
    setShowForgotPassword(false);
    setResetCodeSent(false);
    setForgotPasswordEmail('');
    setResendTimer(0);
  };

  // Render forgot password flow
  if (showForgotPassword) {
    if (!resetCodeSent) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
              <p className="text-gray-400">Enter your email address to receive a password reset code.</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              handleForgotPasswordSubmit(email);
            }} className="space-y-6">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <button
                type="submit"
                disabled={forgotPasswordLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {forgotPasswordLoading ? 'Sending code...' : 'Send Reset Code'}
              </button>
              
              <button
                type="button"
                onClick={resetForgotPasswordForm}
                disabled={forgotPasswordLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Back to Sign In
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-gray-400">
              A verification code has been sent to <span className="font-medium text-white">{forgotPasswordEmail}</span>.
              Please enter the code and your new password.
            </p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const code = formData.get('code') as string;
            const newPassword = formData.get('newPassword') as string;
            handlePasswordReset(code, newPassword);
          }} className="space-y-6">
            <div>
              <label htmlFor="reset-code" className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                id="reset-code"
                name="code"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter code"
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            
            <button
              type="submit"
              disabled={forgotPasswordLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {forgotPasswordLoading ? 'Resetting password...' : 'Reset Password'}
            </button>
            
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={forgotPasswordLoading || resendTimer > 0}
                className="text-blue-400 hover:text-blue-300 disabled:opacity-50 bg-transparent"
              >
                {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
              </button>
              <button
                type="button"
                onClick={resetForgotPasswordForm}
                disabled={forgotPasswordLoading}
                className="text-gray-400 hover:text-gray-300 bg-transparent"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render main sign-in form
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-gray-400">Welcome back! Please enter your details.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="identifier"
              type="email"
              required
              value={form.identifier}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50 bg-transparent"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-black px-2 text-gray-400">or continue with</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button 
          type="button" 
          className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={() => {
            toast.info('Google OAuth integration - implement with your preferred OAuth provider');
          }}
        >
          <div className='flex items-center justify-center'>
            <FaGoogle className="mr-2" />
            Sign in with Google
          </div>
        </button>

        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedLogin;