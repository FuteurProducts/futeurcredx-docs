import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

interface PasswordResetFormProps {
  email: string;
  onSubmit: (code: string, newPassword: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  loading: boolean;
  resendTimer: number;
  onBack: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  email,
  onSubmit,
  onResendCode,
  loading,
  resendTimer,
  onBack,
}) => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (code.trim() && newPassword.trim()) {
      await onSubmit(code.trim(), newPassword);
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      await onResendCode();
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-[32px] font-bold text-black mb-2">Reset Password</h2>
      <p className="text-[#64748B] text-sm mb-4">
        We sent a verification code to <strong>{email}</strong>
      </p>
      <p className="text-[#64748B] text-sm mb-8">
        Enter the code and your new password below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1C2434] mb-1" htmlFor="code">
            Verification Code
          </label>
          <Input
            id="code"
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={loading}
            autoComplete="one-time-code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C2434] mb-1" htmlFor="newPassword">
            New Password
          </label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C2434] mb-1" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || !code.trim() || !newPassword.trim() || !confirmPassword.trim()}
            loadingPhrase="Resetting password..."
            className="flex-1"
          >
            Reset Password
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || loading}
            className="text-sm text-[#3C50E0] hover:text-[#3C50E0]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetForm;
