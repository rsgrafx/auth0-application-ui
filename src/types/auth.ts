export interface UserProfile {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
  nickname?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  updated_at?: string;
  email_verified?: boolean;
  // Custom claims for roles and tenant
  'https://myapp.com/roles'?: string[];
  'https://myapp.com/tenant'?: string;
  'https://myapp.com/permissions'?: string[];
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface ProtectedResource {
  id: string;
  name: string;
  description: string;
  requiredRole?: string;
  tenantId?: string;
}

export interface TenantInfo {
  id: string;
  name: string;
  domain: string;
  plan: string;
  userCount: number;
}