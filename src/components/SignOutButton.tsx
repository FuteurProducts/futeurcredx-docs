import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SignOutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ children, className }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (children) {
    return (
      <div onClick={handleSignOut} className={className}>
        {children}
      </div>
    );
  }

  return (
    <button onClick={handleSignOut} className={className}>
      Sign Out
    </button>
  );
};

export default SignOutButton;

