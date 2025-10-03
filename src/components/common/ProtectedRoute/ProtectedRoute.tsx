import React, { useEffect } from 'react'; // ✅ ADD useEffect
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import styles from './ProtectedRoute.module.css';

interface ProtectedRouteProps {
  element: React.ReactElement;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  fallbackPath = '/login' 
}) => {
  const { isAuthenticated, isInitialized, checkTokenExpiry } = useAuthStore(); // ✅ ADD checkTokenExpiry
  const location = useLocation();

  // ✅ ADD THIS: Check token expiry on mount
  useEffect(() => {
    if (isAuthenticated) {
      const isExpired = checkTokenExpiry();
      if (isExpired) {
        // Token is expired, user will be logged out automatically
        console.log('Token expired, redirecting to login...');
      }
    }
  }, [isAuthenticated, checkTokenExpiry]);

  // Show loading state while checking authentication
  if (!isInitialized) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Render the protected component
  return element;
};

export default ProtectedRoute;