import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { apiService } from '../services/api';

interface AppContextType {
  applicationName: string;
  loading: boolean;
}

const AppContext = createContext<AppContextType>({
  applicationName: 'Auth0 Demo',
  loading: false
});

export const useApp = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [applicationName, setApplicationName] = useState('Auth0 Demo');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppInfo = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
              scope: 'read:clients'
            }
          });

          const appInfo = await apiService.getApplicationInfo(token, import.meta.env.VITE_AUTH0_CLIENT_ID);
          setApplicationName(appInfo.name);
        } catch (error) {
          console.warn('Failed to fetch application name:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppInfo();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <AppContext.Provider value={{ applicationName, loading }}>
      {children}
    </AppContext.Provider>
  );
};