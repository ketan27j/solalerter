import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  getAuthHeader: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  getAuthHeader: () => ({}),
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userInfo = localStorage.getItem('user_info');
      
      if (token && userInfo) {
        try {
          // Set up axios interceptor for all requests
          axios.interceptors.request.use(
            (config) => {
              if (token) {
                config.headers.Authorization = `Bearer ${token}`;
              }
              return config;
            },
            (error) => Promise.reject(error)
          );
          
          setUser(JSON.parse(userInfo));
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user_info');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_info');
    setUser(null);
    window.location.href = '/login';
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
