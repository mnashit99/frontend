import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import styles from './RegisterPage.module.css';

// TypeScript interfaces
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();

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
    const { name, email, password, confirmPassword, phone } = formData;

    // Check empty fields
    if (!name || !email || !password || !confirmPassword || !phone) {
      setError('Please fill in all fields');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Password strength validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid phone number');
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
      // Prepare data for API (exclude confirmPassword)
      const { confirmPassword, ...apiData } = formData;
      
      await api.post('/users/register', apiData);
      
      // Redirect to login page with success message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in.' 
        } 
      });
      
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join us today</p>
        
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
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
            minLength={6}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <div className={styles.footer}>
          <p>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;