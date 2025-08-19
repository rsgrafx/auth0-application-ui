import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertTriangle,
  Database,
  Key,
  Users,
  Building
} from 'lucide-react';
import { apiService } from '../services/api';
import { ProtectedResource, TenantInfo } from '../types/auth';

export const ProtectedResourcePage: React.FC = () => {
  const { user, getAccessTokenSilently, isLoading: authLoading } = useAuth0();
  const [resources, setResources] = useState<ProtectedResource[]>([]);
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const userRoles = user?.['https://myapp.com/roles'] as string[] || [];
  const userTenant = user?.['https://myapp.com/tenant'] as string || 'default';
  const permissions = user?.['https://myapp.com/permissions'] as string[] || [];

  useEffect(() => {
    loadProtectedData();
  }, []);

  const loadProtectedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get access token for API calls
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.REACT_APP_AUTH0_AUDIENCE || 'https://your-api.example.com',
          scope: 'read:resources read:tenant'
        }
      });
      
      setAccessToken(token);

      // Load protected resources
      const resourcesResponse = await apiService.makeAuthenticatedRequest<ProtectedResource[]>(
        '/protected-resources',
        token
      );
      
      if (resourcesResponse.status === 'success') {
        setResources(resourcesResponse.data);
      }

      // Load tenant information
      const tenantResponse = await apiService.makeAuthenticatedRequest<TenantInfo>(
        '/tenant-info',
        token
      );
      
      if (tenantResponse.status === 'success') {
        setTenantInfo(tenantResponse.data);
      }

    } catch (err) {
      console.error('Failed to load protected data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load protected data');
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = (resource: ProtectedResource): boolean => {
    if (!resource.requiredRole) return true;
    return userRoles.includes(resource.requiredRole);
  };

  const canAccessTenant = (resource: ProtectedResource): boolean => {
    if (!resource.tenantId) return true;
    return resource.tenantId === userTenant;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Protected Resources</h1>
            <p className="text-gray-600">
              Demonstrating role-based authorization and API access
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={loadProtectedData}
            className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Authorization Status */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Key className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Authorization Status</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Authenticated</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Access Token</label>
              <div className="bg-gray-50 rounded-lg p-3">
                {accessToken ? (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-xs text-gray-600 font-mono">
                      {accessToken.substring(0, 20)}...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-xs text-gray-600">No token available</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Current Roles</label>
              <div className="space-y-1">
                {userRoles.map((role) => (
                  <div key={role} className="flex items-center">
                    <Users className="w-3 h-3 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700 capitalize">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Tenant Access</label>
              <div className="flex items-center">
                <Building className="w-3 h-3 text-purple-500 mr-2" />
                <span className="text-sm text-gray-700">{userTenant}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Protected Resources */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">API Resources</h2>
            </div>
            <button
              onClick={loadProtectedData}
              disabled={loading}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Database className="w-4 h-4 mr-1" />
              )}
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {resources.map((resource) => {
              const hasRoleAccess = hasAccess(resource);
              const hasTenantAccess = canAccessTenant(resource);
              const canAccess = hasRoleAccess && hasTenantAccess;

              return (
                <div
                  key={resource.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    canAccess 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {canAccess ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Lock className="w-5 h-5 text-red-600" />
                        )}
                        <h3 className="font-medium text-gray-900">{resource.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs">
                        {resource.requiredRole && (
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-1">Required Role:</span>
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              hasRoleAccess 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {resource.requiredRole}
                            </span>
                          </div>
                        )}
                        
                        {resource.tenantId && (
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-1">Tenant:</span>
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              hasTenantAccess 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {resource.tenantId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {canAccess ? (
                        <div className="text-green-600 text-sm font-medium">✓ Accessible</div>
                      ) : (
                        <div className="text-red-600 text-sm font-medium">✗ Restricted</div>
                      )}
                    </div>
                  </div>

                  {!canAccess && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                      <div className="flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        <span>
                          {!hasRoleAccess && `Missing required role: ${resource.requiredRole}`}
                          {!hasRoleAccess && !hasTenantAccess && ' | '}
                          {!hasTenantAccess && `Wrong tenant: need ${resource.tenantId}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tenant Information */}
        {tenantInfo && (
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Building className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Tenant-Specific Data</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{tenantInfo.name}</div>
                <div className="text-sm text-purple-700">Organization</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{tenantInfo.domain}</div>
                <div className="text-sm text-blue-700">Domain</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{tenantInfo.plan}</div>
                <div className="text-sm text-green-700">Plan</div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{tenantInfo.userCount.toLocaleString()}</div>
                <div className="text-sm text-orange-700">Users</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};