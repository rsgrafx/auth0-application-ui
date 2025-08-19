import { ApiResponse, ProtectedResource, TenantInfo } from '../types/auth';

// Mock API service that simulates Auth0 protected endpoints
export class ApiService {
  private baseUrl = '/api'; // This would be your actual API base URL

  async makeAuthenticatedRequest<T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in again');
        }
        if (response.status === 403) {
          throw new Error('Forbidden - Insufficient permissions');
        }
        throw new Error(`API Error: ${response.status}`);
      }

      // Since we don't have a real API, return mock data
      return this.getMockResponse<T>(endpoint);
    } catch (error) {
      console.error('API Request failed:', error);
      // Return mock data for demo purposes
      return this.getMockResponse<T>(endpoint);
    }
  }

  private getMockResponse<T>(endpoint: string): ApiResponse<T> {
    // Mock responses based on endpoint
    switch (endpoint) {
      case '/protected-resources':
        return {
          status: 'success',
          data: [
            {
              id: '1',
              name: 'User Dashboard Data',
              description: 'Basic user information and preferences',
              requiredRole: 'user',
            },
            {
              id: '2',
              name: 'Admin Panel Access',
              description: 'Administrative controls and system settings',
              requiredRole: 'admin',
            },
            {
              id: '3',
              name: 'Analytics Data',
              description: 'Business intelligence and reporting data',
              requiredRole: 'admin',
            },
          ] as T,
          message: 'Protected resources retrieved successfully',
        };

      case '/tenant-info':
        return {
          status: 'success',
          data: {
            id: 'tenant-123',
            name: 'Acme Corporation',
            domain: 'acme.com',
            plan: 'Enterprise',
            userCount: 1250,
          } as T,
          message: 'Tenant information retrieved successfully',
        };

      case '/user-analytics':
        return {
          status: 'success',
          data: {
            totalUsers: 1250,
            activeUsers: 892,
            newUsersThisMonth: 45,
            averageSessionDuration: '12m 34s',
            topFeatures: [
              { name: 'Dashboard', usage: 95 },
              { name: 'Reports', usage: 78 },
              { name: 'Settings', usage: 65 },
            ],
          } as T,
          message: 'Analytics data retrieved successfully',
        };

      default:
        return {
          status: 'success',
          data: {} as T,
          message: 'Mock data retrieved successfully',
        };
    }
  }
}

export const apiService = new ApiService();