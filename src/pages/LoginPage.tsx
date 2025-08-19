import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { Shield, Loader2, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { 
    loginWithRedirect, 
    isAuthenticated, 
    isLoading, 
    error 
  } = useAuth0();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/dashboard'
      }
    });
  };

  const handleDemoLogin = (userType: 'user' | 'admin') => {
    // In a real app, you might pass additional parameters to Auth0
    // to simulate different user types for demo purposes
    loginWithRedirect({
      appState: {
        returnTo: '/dashboard',
        userType // This could be used by your Auth0 rules/actions
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Auth0 Demo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Experience secure authentication and authorization
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <div className="space-y-6">
            {/* Main Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Sign in with Auth0
                </>
              )}
            </button>

            {/* Demo Credentials Section */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleDemoLogin('user')}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Demo User Account
              </button>
              
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Demo Admin Account
              </button>
            </div>

            {/* Info Text */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                This demo uses Auth0 Universal Login for secure authentication
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Features Demonstrated</h3>
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Auth0 Universal Login Integration
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Role-based Authorization
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Protected API Calls
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Secure Token Management
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};