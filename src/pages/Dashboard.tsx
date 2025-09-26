import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useAuth as useCustomAuth } from '../store/useAuth';

const Dashboard: React.FC = () => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { token, profile, clearAuth } = useCustomAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      clearAuth();
      localStorage.removeItem('clerk_token');
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Access Denied</h1>
          <p className="mb-4">You need to be signed in to access this page.</p>
          <a href="/login" className="text-blue-400 hover:text-blue-300">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">FUTEURCREDX Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
              <p><strong>Name:</strong> {user?.fullName || 'Not provided'}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p><strong>Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
              <p><strong>Token Available:</strong> {token ? 'Yes' : 'No'}</p>
              <p><strong>Profile Loaded:</strong> {profile ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a 
                href="/advanced-login" 
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center transition-colors"
              >
                Test Advanced Login
              </a>
              <a 
                href="/login" 
                className="block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-center transition-colors"
              >
                Test Basic Login
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Token (first 20 chars):</strong> {token ? token.substring(0, 20) + '...' : 'None'}</p>
            <p><strong>Profile Data:</strong> {profile ? JSON.stringify(profile, null, 2) : 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
