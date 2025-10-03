import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import styles from './ProfilePage.module.css';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: string;
}

interface UpdateProfileData {
  name: string;
  birthday?: string;
  gender?: string;
}

const ProfilePage: React.FC = () => {
  const { user, login } = useAuthStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    gender: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const userData = response.data;
      
      // Update the auth store with fresh user data
      const token = localStorage.getItem('token');
if (token) {
  login(userData, token); // ✅ Now passing 2 parameters
}
      
      // Update form data with fresh user data
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        birthday: userData.birthday || '',
        gender: userData.gender || '',
      });
      
      return userData;
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load profile data');
      throw err;
    }
  };

  // Fetch profile data when component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Only send the fields that the backend accepts
      const updateData: UpdateProfileData = {
        name: formData.name,
        birthday: formData.birthday || undefined,
        gender: formData.gender || undefined,
      };
      
      // Step 1: Update the profile
      await api.patch('/users/profile', updateData);
      
      // Step 2: ✅ CRITICAL FIX: Fetch the updated profile data from server
      await fetchUserProfile();
      
      setSuccess('Profile updated successfully!');
      setIsEditMode(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data from store
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday || '',
        gender: user.gender || '',
      });
    }
    setIsEditMode(false);
    setError('');
    setSuccess('');
  };

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <h1>👤 Your Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditMode}
                className={!isEditMode ? styles.disabled : ''}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                disabled
                className={styles.disabled}
              />
              <span className={styles.fieldNote}>Email cannot be changed</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="03001234567"
                value={formData.phone}
                onChange={handleChange}
                disabled
                className={styles.disabled}
              />
              <span className={styles.fieldNote}>
                Phone number cannot be changed here
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="birthday">Birthday</label>
              <input
                id="birthday"
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                disabled={!isEditMode}
                className={!isEditMode ? styles.disabled : ''}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditMode}
                className={!isEditMode ? styles.disabled : ''}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              ✅ {success}
            </div>
          )}

          {/* Actions */}
          <div className={styles.formActions}>
            {isEditMode ? (
              <div className={styles.editActions}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.saveButton}
                >
                  {isLoading ? (
                    <>
                      <span className={styles.buttonSpinner}></span>
                      Saving...
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.cancelButton}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className={styles.editButton}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;