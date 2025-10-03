import { useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';

const AuthInitializer = () => {
  const { setInitialized, checkTokenExpiry, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check token validity on app start
    const initializeAuth = async () => {
      try {
        // Check if token exists and is valid
        const token = localStorage.getItem('token');
        if (token) {
          const isExpired = checkTokenExpiry();
          if (isExpired) {
            console.log('Token expired on app start');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();

    // Set up periodic token check (every minute)
    const interval = setInterval(() => {
      if (isAuthenticated) {
        checkTokenExpiry();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [setInitialized, checkTokenExpiry, isAuthenticated]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;