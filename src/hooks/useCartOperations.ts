// hooks/useCartOperations.ts
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import cartApi from '../services/cartApi';
import { AddToCartData } from '../types/cart.types';
import { notifySuccess, notifyError } from '../utility/notifier';

export const useCartOperations = () => {
  const { setCart, setLoading, setError } = useCartStore(state => ({
    setCart: state.setCart,
    setLoading: state.setLoading,
    setError: state.setError,
  }));
  const [isOperating, setIsOperating] = useState(false);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartApi.getCart();
      setCart(cartData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch cart';
      setError(errorMessage);
      // No need to notify on initial fetch error, page can show error state
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (data: AddToCartData) => {
    try {
      setIsOperating(true);
      setError(null);
      const cartData = await cartApi.addToCart(data);
      setCart(cartData);
      notifySuccess('Item added to cart!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      setError(errorMessage);
      notifyError(errorMessage);
    } finally {
      setIsOperating(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setIsOperating(true);
      setError(null);
      const cartData = await cartApi.updateCartItem(itemId, quantity);
      setCart(cartData);
      // No need to notify on every quantity change, it can be noisy.
      // The UI update is sufficient feedback.
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      setError(errorMessage);
      notifyError(errorMessage);
    } finally {
      setIsOperating(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      setIsOperating(true);
      setError(null);
      const cartData = await cartApi.removeFromCart(itemId);
      setCart(cartData);
      notifySuccess('Item removed from cart');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      setError(errorMessage);
      notifyError(errorMessage);
    } finally {
      setIsOperating(false);
    }
  };

  return {
    // State
    isOperating,
    
    // Operations
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
  };
};