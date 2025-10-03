import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './ProductCard.module.css';
import { Product } from '../../../types/product.types';

interface ProductCardProps {
  product: Product & { variantId?: string }; // ✅ Add variantId to props
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const getDisplayPrice = (product: Product) => {
    if (product.variants.length > 0) {
      const prices = product.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice !== maxPrice) {
        return `$${minPrice} - $${maxPrice}`;
      }
      return `$${minPrice}`;
    }
    return 'Price not available';
  };

  // ✅ FIX: Generate proper URL with variant parameter
  const getProductUrl = () => {
    let url = `/product/${product.id}`;
    
    // If this card represents a specific variant, add it to URL
    if (product.variantId && product.variants.length > 0) {
      // Check if variantId is different from product id (meaning it's a real variant)
      const isRealVariant = product.variants.some(v => v.id === product.variantId);
      if (isRealVariant) {
        url += `?variant=${product.variantId}`;
      }
    }
    
    return url;
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(getProductUrl());
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to cart:', product.id, product.variantId);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to wishlist:', product.id);
  };

  const hasAvailableVariants = product.variants.some(variant => variant.stock > 0);

  return (
    <Link to={getProductUrl()} className={styles.productCard}> {/* ✅ Use dynamic URL */}
      {/* Product Image */}
      <div className={styles.imageContainer}>
        <img
          src={product.thumbnail || '/images/product-placeholder.jpg'}
          alt={product.name}
          className={styles.productImage}
          loading="lazy"
        />
        
        {!hasAvailableVariants && (
          <div className={styles.outOfStockOverlay}>
            <span>Out of Stock</span>
          </div>
        )}
        
        <div className={styles.quickActions}>
          <button 
            className={styles.quickView}
            onClick={handleQuickView}
            aria-label="Quick view"
          >
            👁️ Quick View
          </button>
          <button 
            className={styles.addToWishlist}
            onClick={handleAddToWishlist}
            aria-label="Add to wishlist"
          >
            ❤️
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className={styles.productInfo}>
        {product.brand && (
          <span className={styles.brand}>{product.brand}</span>
        )}
        
        <h3 className={styles.productName}>{product.name}</h3>
        
        <div className={styles.priceContainer}>
          <span className={styles.price}>{getDisplayPrice(product)}</span>
          {product.variants.length > 1 && (
            <span className={styles.variants}>({product.variants.length} options)</span>
          )}
        </div>
        
        <button 
          className={`${styles.addToCartButton} ${
            !hasAvailableVariants ? styles.disabled : ''
          }`}
          onClick={handleAddToCart}
          disabled={!hasAvailableVariants}
        >
          {hasAvailableVariants ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;