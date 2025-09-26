import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
}

const Input: React.FC<InputProps> = ({ loading, className = '', ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={loading || props.disabled}
      {...props}
    />
  );
};

export default Input;
