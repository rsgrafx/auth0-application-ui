import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp,
  Clock,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../services/api';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  averageSessionDuration: string;
  topFeatures: Array<{
    name: string;
    usage: number;
  }>;
}

export const AnalyticsPage: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRoles = user?.['https://myapp.com/roles'] as string[] || [];
  const isAdmin = userRoles.includes('admin');

  useEffect(() => {
    if (isAdmin) {
      loadAnalytics();
    }
  }, [isAdmin]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.REACT_APP_AUTH0_AUDIENCE || 'https://your-api.example.com',
          scope: 'read:analytics admin:dashboard'
        }
      });

      const response = await apiService.makeAuthenticatedRequest<AnalyticsData>(
        '/user-analytics',
        token
      );
      
      if (response.status === 'success') {
        setAnalytics(response.data);
      } else {
        throw new Error('Failed to load analytics data');
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            This page requires administrator privileges.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Analytics</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={loadAnalytics}
            className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Analytics</h1>
            <p className="text-gray-600">
              System metrics and user insights (Admin Only)
            </p>
          </div>
        </div>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.activeUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    +{analytics.newUsersThisMonth}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.averageSessionDuration}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Usage</h2>
              <div className="space-y-4">
                {analytics.topFeatures.map((feature, index) => (
                  <div key={feature.name} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {feature.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {feature.usage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-blue-600' :
                            index === 1 ? 'bg-green-600' : 'bg-purple-600'
                          }`}
                          style={{ width: `${feature.usage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New user registration</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">API endpoint accessed</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Admin action performed</p>
                    <p className="text-xs text-gray-500">12 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Security alert resolved</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Administrative Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-700">Manage Users</span>
              </button>
              
              <button className="flex items-center justify-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-gray-700">Security Settings</span>
              </button>
              
              <button className="flex items-center justify-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium text-gray-700">Export Reports</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};