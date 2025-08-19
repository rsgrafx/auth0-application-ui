# Auth0 React Demo Application

A comprehensive demonstration of Auth0 authentication and authorization workflows using the official Auth0 React SDK.

## 🚀 Features

### Authentication
- **Auth0 Universal Login** integration using `@auth0/auth0-react`
- **Automatic token management** with refresh token support
- **Secure logout** with proper session cleanup
- **Loading states** and error handling

### Authorization
- **Role-based access control** (User, Admin)
- **Protected routes** with automatic redirects
- **API authentication** using access tokens
- **Permission-based UI** rendering

### User Experience
- **Responsive design** for all screen sizes
- **Professional UI** with Tailwind CSS
- **Smooth transitions** and loading indicators
- **Clear error messaging** and feedback

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Auth0 React SDK** (`@auth0/auth0-react`)
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development and building

## 📋 Prerequisites

1. **Auth0 Account**: Sign up at [auth0.com](https://auth0.com)
2. **Auth0 Application**: Create a Single Page Application in your Auth0 dashboard
3. **Node.js**: Version 16 or higher

## ⚙️ Setup Instructions

### 1. Auth0 Configuration

1. **Create an Auth0 Application**:
   - Go to your Auth0 Dashboard
   - Navigate to Applications → Create Application
   - Choose "Single Page Web Applications"
   - Select React as the technology

2. **Configure Application Settings**:
   ```
   Allowed Callback URLs: http://localhost:5173
   Allowed Logout URLs: http://localhost:5173
   Allowed Web Origins: http://localhost:5173
   ```

3. **Create an API** (Optional, for protected endpoints):
   - Go to APIs → Create API
   - Set identifier (e.g., `https://your-api.example.com`)
   - Enable RBAC and "Add Permissions in the Access Token"

4. **Set up Roles and Users**:
   - Create roles: `user` and `admin`
   - Assign roles to test users
   - Add custom claims in Auth0 Rules/Actions

### 2. Environment Configuration

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your Auth0 settings**:
   ```env
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_AUDIENCE=https://your-api.example.com
   ```

### 3. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔐 Auth0 Integration Details

### Authentication Flow
1. User clicks login → `loginWithRedirect()` triggers Auth0 Universal Login
2. Auth0 handles authentication and redirects back to app
3. `isAuthenticated` becomes true → User redirected to dashboard
4. User data available through `user` object from `useAuth0()`

### API Authentication
```typescript
// Get access token for API calls
const token = await getAccessTokenSilently({
  authorizationParams: {
    audience: 'https://your-api.example.com',
    scope: 'read:resources admin:dashboard'
  }
});

// Use token in API requests
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Role-Based Authorization
```typescript
// Extract roles from user object
const userRoles = user?.['https://myapp.com/roles'] as string[] || [];
const isAdmin = userRoles.includes('admin');

// Protect components based on roles
{isAdmin && <AdminComponent />}
```

## 📱 Application Structure

### Pages
- **Login Page**: Auth0 Universal Login integration
- **Dashboard**: User profile and role information
- **Protected Resources**: API calls with role-based access
- **Analytics**: Admin-only page with system metrics

### Components
- **Layout**: Navigation and user menu
- **ProtectedRoute**: Route protection with role validation
- **Auth0Provider**: Application-wide authentication context

### Services
- **API Service**: Mock API calls with token authentication
- **Type Definitions**: TypeScript interfaces for Auth0 data

## 🧪 Testing the Demo

### Demo Flow
1. **Start at Login**: Clean Auth0 login interface
2. **Authenticate**: Use Auth0 Universal Login
3. **Dashboard**: View user profile and role information
4. **Protected Resources**: Test role-based API access
5. **Analytics** (Admin only): Admin-specific functionality
6. **Logout**: Secure session cleanup

### Role Testing
- **User Role**: Access to dashboard and basic protected resources
- **Admin Role**: Full access including analytics page
- **No Role**: Limited access with appropriate error messages

## 🔧 Customization

### Adding New Roles
1. Create roles in Auth0 Dashboard
2. Update type definitions in `src/types/auth.ts`
3. Add role checks in components and routes
4. Update Auth0 Rules/Actions to include roles in tokens

### Custom Claims
Add custom claims in Auth0 Rules/Actions:
```javascript
function addCustomClaims(user, context, callback) {
  const namespace = 'https://myapp.com/';
  context.accessToken[namespace + 'roles'] = user.app_metadata?.roles || [];
  context.accessToken[namespace + 'tenant'] = user.app_metadata?.tenant || 'default';
  callback(null, user, context);
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Update your production environment with:
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- `VITE_AUTH0_AUDIENCE`

### Auth0 Production Settings
Update your Auth0 application settings with production URLs:
- Allowed Callback URLs
- Allowed Logout URLs
- Allowed Web Origins

## 📚 Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login)
- [Auth0 Role-Based Access Control](https://auth0.com/docs/manage-users/access-control/rbac)
- [Auth0 Custom Claims](https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.