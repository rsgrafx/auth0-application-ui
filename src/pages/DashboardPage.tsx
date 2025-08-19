import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  User, 
  Shield, 
  Building, 
  Calendar,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  Crown,
  Users
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Extract custom claims
  const userRoles = user?.['https://myapp.com/roles'] as string[] || [];
  const tenantId = user?.['https://myapp.com/tenant'] as string || 'default';
  const permissions = user?.['https://myapp.com/permissions'] as string[] || [];

  const isAdmin = userRoles.includes('admin');
  const isUser = userRoles.includes('user');

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {user?.picture ? (
            <img
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              src={user.picture}
              alt={user.name || 'User'}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-8 h-8 text-gray-600" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || user?.nickname || 'User'}!
            </h1>
            <p className="text-gray-600">
              Here's your authentication and authorization overview
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Credentials Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">User Credentials</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900 font-medium">{user?.name || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                  {user?.email_verified ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Username</label>
                <p className="text-gray-900">{user?.preferred_username || user?.nickname || 'Not set'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-gray-900 font-mono text-sm">{user?.sub || 'Not available'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Locale</label>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{user?.locale || 'en-US'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">
                    {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Role Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Assigned Roles</label>
              <div className="space-y-2">
                {userRoles.length > 0 ? (
                  userRoles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      {role === 'admin' ? (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Users className="w-4 h-4 text-blue-500" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        role === 'admin' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No roles assigned</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Permissions</label>
              <div className="space-y-1">
                {permissions.length > 0 ? (
                  permissions.slice(0, 3).map((permission) => (
                    <div key={permission} className="text-sm text-gray-600 flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      {permission}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No specific permissions</p>
                )}
                {permissions.length > 3 && (
                  <p className="text-xs text-gray-400">+{permissions.length - 3} more</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Access Level</span>
                <span className={`font-medium ${isAdmin ? 'text-yellow-600' : 'text-blue-600'}`}>
                  {isAdmin ? 'Administrator' : 'Standard User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Details Card */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Tenant Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">Acme Corp</div>
              <div className="text-sm text-gray-500">Organization</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{tenantId}</div>
              <div className="text-sm text-gray-500">Tenant ID</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Enterprise</div>
              <div className="text-sm text-gray-500">Plan</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1,250</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <Shield className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Protected Resources</h3>
              <p className="text-sm text-gray-600 mt-1">
                Access role-based protected content and API endpoints
              </p>
            </div>
            
            {isAdmin && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <Crown className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-medium text-gray-900">Admin Analytics</h3>
                <p className="text-sm text-gray-600 mt-1">
                  View system metrics and administrative controls
                </p>
              </div>
            )}
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <User className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Profile Settings</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your account preferences and security settings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};