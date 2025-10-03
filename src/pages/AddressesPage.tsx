import React, { useState, useEffect } from 'react';
import api from '../services/api';
import styles from './AddressesPage.module.css';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressFormData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/addresses');
      setAddresses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    const { street, city, state, postalCode, country } = formData;
    
    if (!street.trim() || !city.trim() || !state.trim() || !postalCode.trim() || !country.trim()) {
      setError('All fields are required');
      return false;
    }
    
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/addresses', formData);
      setFormData({ street: '', city: '', state: '', postalCode: '', country: '' });
      setShowForm(false);
      await fetchAddresses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await api.delete(`/addresses/${id}`);
      await fetchAddresses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/addresses/${id}/default`);
      await fetchAddresses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set default address');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData({ street: '', city: '', state: '', postalCode: '', country: '' });
    setError('');
  };

  return (
    <div className={styles.addressesContainer}>
      <div className={styles.addressesHeader}>
        <h1>📍 Your Addresses</h1>
        <p>Manage your shipping addresses</p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          ⚠️ {error}
        </div>
      )}

      {/* Add Address Button */}
      <div className={styles.addAddressSection}>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={styles.addAddressButton}
        >
          {showForm ? '✕ Cancel' : '+ Add New Address'}
        </button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className={styles.addressForm}>
          <h3>Add New Address</h3>
          <div className={styles.formGrid}>
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State/Province"
              value={formData.state}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" disabled={isSubmitting} className={styles.saveButton}>
              {isSubmitting ? 'Saving...' : '💾 Save Address'}
            </button>
            <button type="button" onClick={handleCancelForm} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📍</div>
          <h3>No addresses yet</h3>
          <p>Add your first address to get started</p>
        </div>
      ) : (
        <div className={styles.addressList}>
          {addresses.map(address => (
            <div key={address.id} className={`${styles.addressCard} ${address.isDefault ? styles.default : ''}`}>
              <div className={styles.addressContent}>
                <div className={styles.addressInfo}>
                  <p className={styles.addressText}>
                    {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
                  </p>
                  {address.isDefault && (
                    <span className={styles.defaultBadge}>⭐ Default Address</span>
                  )}
                </div>
                <div className={styles.addressActions}>
                  {!address.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(address.id)}
                      className={styles.setDefaultButton}
                    >
                      Set as Default
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(address.id)}
                    className={styles.deleteButton}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesPage;