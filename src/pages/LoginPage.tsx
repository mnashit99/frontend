import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import styles from './LoginPage.module.css';

// TypeScript interfaces
interface LoginFormData {
  email: string;
  password: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Login request
      const response = await api.post('/users/login', formData);
      const { access_token } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      
      // Fetch user profile
      const profileResponse = await api.get('/users/profile');
      const token = response.data.access_token; // or wherever your token is in the login response
login(profileResponse.data, token);
      
      // Redirect to home page
      navigate('/', { replace: true });
      
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
        
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className={styles.input}
            required
          />
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className={styles.footer}>
          <p>
            <Link to="/forgot-password" className={styles.link}>
              Forgot Password?
            </Link>
          </p>
          <p>
            Don't have an account?{'' }
            <Link to="/register" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;