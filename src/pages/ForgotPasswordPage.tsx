import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccessMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err: any) {
      // For security, we show the same message for errors to prevent user enumeration
      setSuccessMessage('If an account with that email exists, a password reset link has been sent.');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.subtitle}>Enter your email address and we'll send you a link to reset your password.</p>
        
        {successMessage ? (
          <div className={styles.successMessage}>{successMessage}</div>
        ) : (
          <>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={styles.input}
                required
              />
            </div>

            {error && (
              <div className={styles.error}>{error}</div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        )}

        <div className={styles.footer}>
          <p>
            Remember your password?{' '}
            <Link to="/login" className={styles.link}>
              Back to Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;