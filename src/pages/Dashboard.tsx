import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isSignedIn, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    navigate('/login');
    return null;
  }

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome to your Dashboard, {user?.firstName || 'User'}!
          </h1>
          <button
            onClick={handleSignOut}
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        <p className="mb-6 text-gray-300">You are successfully signed in.</p>
        
        <div className="bg-gray-800 p-6 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information:</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Full Name:</strong> {user?.fullName}</p>
            <p><strong>First Name:</strong> {user?.firstName}</p>
            <p><strong>Last Name:</strong> {user?.lastName}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
            <p className="text-gray-300 text-sm">Manage your account settings and preferences.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Security</h3>
            <p className="text-gray-300 text-sm">Update your password and security settings.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <p className="text-gray-300 text-sm">Configure your notification preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;