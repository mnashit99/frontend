import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import styles from './ResetPasswordPage.module.css';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setSuccessMessage('Your password has been successfully reset! You can now sign in with your new password.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Reset Password</h1>
        
        {successMessage ? (
          <div className={styles.successMessage}>
            {successMessage}
            <Link to="/login" className={`${styles.submitButton} ${styles.backToLoginButton}`}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className={styles.subtitle}>Enter your new password below.</p>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPasswordPage;