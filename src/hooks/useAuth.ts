import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const useAuth = () => {
  const { login, logout, setInitialized, isInitialized } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setInitialized(true);
        return;
      }

      try {
        const response = await api.get('/users/profile');
        const token = localStorage.getItem('token');
if (token) {
  login(response.data, token); // ✅ Now passing 2 parameters
}
      } catch (error) {
        localStorage.removeItem('token');
        logout();
      } finally {
        setInitialized(true);
      }
    };

    if (!isInitialized) {
      checkAuth();
    }
  }, [login, logout, setInitialized, isInitialized]);
};

export default useAuth;