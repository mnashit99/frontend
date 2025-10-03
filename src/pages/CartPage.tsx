// pages/CartPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartItems, useCartTotals } from '../store/cartStore';
import { useCartOperations } from '../hooks/useCartOperations';
import { useAuthStore } from '../store/authStore';
import styles from './CartPage.module.css';
import { notifyError } from '../utility/notifier';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const cartItems = useCartItems();
  const { totalItems, subtotal } = useCartTotals();
  const { fetchCart, updateCartItem, removeFromCart, isOperating } = useCartOperations();
  const [localLoading, setLocalLoading] = useState<string | null>(null);

  // Fetch cart when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle quantity update
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setLocalLoading(itemId);
    await updateCartItem(itemId, newQuantity);
    setLocalLoading(null);
  };

  // Handle item removal
  const handleRemoveItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }

    setLocalLoading(itemId);
    await removeFromCart(itemId);
    setLocalLoading(null);
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      notifyError('Your cart is empty');
      return;
    }
    // This will be implemented in the next phase.
    navigate('/checkout');
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.loadingContainer}>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button 
            onClick={handleContinueShopping}
            className={styles.continueShoppingBtn}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartContainer}>
        {/* Cart Header */}
        <div className={styles.cartHeader}>
          <h1>Shopping Cart</h1>
          <span className={styles.itemCount}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className={styles.cartContent}>
          {/* Cart Items */}
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                {/* Product Image */}
                <div className={styles.itemImage}>
                  <img
                    src={item.variant.product.thumbnail || '/images/product-placeholder.jpg'}
                    alt={item.variant.product.name}
                    onError={(e) => {
                      e.currentTarget.src = '/images/product-placeholder.jpg';
                    }}
                  />
                </div>

                {/* Item Details */}
                <div className={styles.itemDetails}>
                  <h3 className={styles.productName}>
                    <Link to={`/product/${item.variant.product.id}`}>
                      {item.variant.product.name}
                    </Link>
                  </h3>
                  {item.variant.product.brand && (
                    <p className={styles.brand}>Brand: {item.variant.product.brand}</p>
                  )}
                  <p className={styles.variantInfo}>
                    {item.variant.sku && `SKU: ${item.variant.sku}`}
                  </p>
                  
                  {/* Stock Status */}
                  <div className={styles.stockStatus}>
                    {item.variant.stock > 0 ? (
                      <span className={styles.inStock}>
                        In Stock ({item.variant.stock} available)
                      </span>
                    ) : (
                      <span className={styles.outOfStock}>Out of Stock</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || localLoading === item.id}
                    className={styles.quantityBtn}
                  >
                    −
                  </button>
                  <span className={styles.quantity}>
                    {localLoading === item.id ? '...' : item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.variant.stock || localLoading === item.id}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className={styles.priceSection}>
                  <p className={styles.itemPrice}>${item.variant.price}</p>
                  <p className={styles.itemTotal}>
                    ${(item.variant.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={localLoading === item.id}
                  className={styles.removeBtn}
                  aria-label="Remove item"
                >
                  {localLoading === item.id ? '...' : '🗑️'}
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className={styles.cartSummary}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>
              
              <div className={styles.summaryRow}>
                <span>Items ({totalItems}):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className={styles.summaryDivider}></div>
              
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                className={styles.checkoutBtn}
                disabled={isOperating}
              >
                {isOperating ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <button 
                onClick={handleContinueShopping}
                className={styles.continueShoppingBtn}
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;