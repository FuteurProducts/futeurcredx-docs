import React, { useState, useEffect, Suspense } from 'react';
import { useAuth, useSignIn } from '@clerk/clerk-react';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { checkSessionAndSendToCallback } from '../util/check-session';
import { useAuth as useCustomAuth } from '../store/useAuth';
import axiosInstance from '../util/axios';
import ForgotPasswordForm from '../components/organisms/ForgotPasswordForm';
import PasswordResetForm from '../components/organisms/PasswordResetForm';

const handleClerkError = (error: any): string => {
  const message = error.message || error.toString();

  // Handle specific Clerk errors with user-friendly messages
  if (message.includes('You\'re already signed in') || message.includes('already signed in')) {
    return 'You are already signed in. Redirecting...';
  }

  if (message.includes('Password has been found in an online data breach')) {
    return 'This password has been found in a data breach. Please choose a more secure password for your safety.';
  }

  if (message.includes('Password is incorrect') || message.includes('Incorrect password')) {
    return 'Invalid credentials.';
  }

  if (message.includes('verification code')) {
    return 'The verification code is invalid or has expired. Please request a new code.';
  }

  if (message.includes('expired')) {
    return 'Your session has expired. Please try again.';
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return 'Too many login attempts. Please wait a few minutes before trying again.';
  }

  if (message.includes('User not found') || message.includes('user does not exist')) {
    return 'No account found with this email address. Please check your email or sign up.';
  }

  if (message.includes('email')) {
    return 'Please enter a valid email address.';
  }

  if (message.includes('Invalid email or password') || message.includes('Incorrect email or password')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  // Generic fallback
  return 'Sign in failed. Please check your credentials and try again.';
};

export default function AdvancedLogin() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('User already signed in, redirecting to dashboard...');
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

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

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if already signed in (will redirect)
  if (isSignedIn) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
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
      if (!isLoaded || !signIn) {
        throw new Error('Authentication system not ready');
      }

      console.log('Attempting to sign in...');
      const result = await signIn.create({
        identifier: form.identifier.trim(),
        password: form.password,
      });

      console.log('Sign in result:', result.status);

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });

        toast.success('Signed in successfully!');

        try {
          const token = await getToken();
          if (token) {
            // Set token in custom auth store
            useCustomAuth.getState().setToken(token);
            localStorage.setItem('clerk_token', token);

            // Optional: Check session with backend
            try {
              const success = await checkSessionAndSendToCallback(token);
              if (success) {
                console.log('Backend session validation successful');
              }
            } catch (sessionError) {
              console.warn('Backend session validation failed, continuing...', sessionError);
            }

            // Optional: Fetch user profile
            try {
              const response = await axiosInstance.get('/auth/profile');
              if (response.data?.data) {
                useCustomAuth.getState().setProfile(response.data.data);
                console.log('User profile loaded');
              }
            } catch (profileError) {
              console.warn('Profile fetch failed, continuing...', profileError);
            }
          }
        } catch (postSignInError) {
          console.warn('Post sign-in setup failed, but user is signed in:', postSignInError);
        }

        // Redirect to dashboard
        navigate('/dashboard');

      } else {
        console.warn('Unexpected sign in result:', result);
        toast.error('Sign in incomplete. Please try again.');
      }

    } catch (error: unknown) {
      console.error('Sign in error:', error);
      const errorMessage = handleClerkError(error);
      toast.error(errorMessage);

      // Clear password field on error for security
      setForm(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    setForgotPasswordLoading(true);

    try {
      if (!isLoaded || !signIn) return;

      await signIn.create({
        identifier: email,
        strategy: 'reset_password_email_code',
      });

      setForgotPasswordEmail(email);
      setResetCodeSent(true);
      setResendTimer(60);
      toast.success('Password reset code sent to your email');
    } catch (error: unknown) {
      console.error('Forgot password error:', error);
      const errorMessage = handleClerkError(error);
      toast.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setForgotPasswordLoading(true);
    try {
      if (!isLoaded || !signIn) return;

      await signIn.create({
        identifier: forgotPasswordEmail,
        strategy: 'reset_password_email_code',
      });

      setResendTimer(60);
      toast.success('New verification code sent');
    } catch (error: unknown) {
      console.error('Resend code error:', error);
      const errorMessage = handleClerkError(error);
      toast.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handlePasswordReset = async (code: string, newPassword: string) => {
    setForgotPasswordLoading(true);

    try {
      if (!isLoaded || !signIn) return;

      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code,
        password: newPassword,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        toast.success('Password reset successful! You are now signed in.');
        resetForgotPasswordForm();
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      const errorMessage = handleClerkError(error);
      toast.error(errorMessage);

      // Reset form on certain errors
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as any).message;
        if (message.includes('verification code') || message.includes('expired')) {
          setResetCodeSent(false);
          setForgotPasswordEmail('');
        }
      }
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
        <Suspense>
          <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-lg p-8">
              <ForgotPasswordForm
                onSubmit={handleForgotPasswordSubmit}
                loading={forgotPasswordLoading}
                onBack={resetForgotPasswordForm}
              />
            </div>
          </div>
        </Suspense>
      );
    }

    return (
      <Suspense>
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-lg p-8">
            <PasswordResetForm
              email={forgotPasswordEmail}
              onSubmit={handlePasswordReset}
              onResendCode={handleResendCode}
              loading={forgotPasswordLoading}
              resendTimer={resendTimer}
              onBack={resetForgotPasswordForm}
            />
          </div>
        </div>
      </Suspense>
    );
  }

  // Render main sign-in form
  return (
    <Suspense>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-2">FUTEURCREDX</h1>
            <p className="text-gray-600">Welcome back! Please sign in to continue.</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-[32px] font-bold text-black mb-2">Sign In</h2>
              <p className="text-[#64748B] text-sm mb-8">
                Welcome back! Please enter your details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1C2434] mb-1" htmlFor='email'>
                      Email
                    </label>
                    <Input
                      id='email'
                      name="identifier"
                      type="email"
                      placeholder="Enter your email"
                      value={form.identifier}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1C2434] mb-1" htmlFor='password'>
                      Password
                    </label>
                    <Input
                      id='password'
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm font-medium text-[#3C50E0] hover:text-[#3C50E0]/90 disabled:opacity-50 bg-transparent"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" variant="primary" loading={loading} disabled={loading} loadingPhrase='Signing in...'>
                  Sign in
                </Button>
              </form>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button 
              type="button" 
              className="!text-gray-500 !bg-gray-50 flex items-center justify-center w-full"
              onClick={() => {
                // Handle Google OAuth - you can implement this with Clerk's OAuth
                toast.info('Google OAuth integration - implement with Clerk OAuth');
              }}
            >
              <div className='flex items-center justify-center'>
                <FaGoogle className="mr-2" />
                Sign in with Google
              </div>
            </Button>

            <p className="text-center text-sm text-[#64748B] mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-[#3C50E0] hover:text-[#3C50E0]/90">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
