import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuthStore, useUser } from '../../../store/authStore';
// Remove this import if you're not using the dropdown version
// import CartIconWithDropdown from '../CartIcon/CartIconWithDropdown';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const user = useUser();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/" className={styles.logoLink}>
          🛍️ E-Commerce
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            🔍
          </button>
        </div>
      </form>

      {/* User Actions */}
      <div className={styles.userActions}>
        {/* ✅ UPDATED: Replace basic cart link with Cart Icon */}
        <Link to="/cart" className={styles.cartLink}>
          🛒
        </Link>

        {/* Alternative: If you want the dropdown version, use this instead: */}
        {/* <CartIconWithDropdown /> */}

        {/* Authentication */}
        {isAuthenticated ? (
          <div className={styles.profileDropdown} ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className={styles.profileButton}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <span className={styles.userGreeting}>
                👋 Hello, {user?.name?.split(' ')[0] || 'User'}
              </span>
            </button>
            
            {isDropdownOpen && (
              <div className={styles.dropdownContent}>
                <div className={styles.dropdownHeader}>
                  <strong>{user?.name}</strong>
                  <span className={styles.userEmail}>{user?.email}</span>
                </div>
                
                <div className={styles.dropdownDivider}></div>
                
                <Link 
                  to="/profile" 
                  className={styles.dropdownLink}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  👤 My Profile
                </Link>
                <Link 
                  to="/addresses" 
                  className={styles.dropdownLink}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  📍 My Addresses
                </Link>
                <Link 
                  to="/orders" 
                  className={styles.dropdownLink}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  📦 Order History
                </Link>
                
                <div className={styles.dropdownDivider}></div>
                
                <button 
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.authLink}>
              Login
            </Link>
            <Link to="/register" className={styles.registerLink}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;