import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading,
  onBack,
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await onSubmit(email.trim());
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-[32px] font-bold text-black mb-2">Forgot Password</h2>
      <p className="text-[#64748B] text-sm mb-8">
        Enter your email address and we'll send you a verification code to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1C2434] mb-1" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
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
            disabled={loading || !email.trim()}
            loadingPhrase="Sending code..."
            className="flex-1"
          >
            Send Code
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
