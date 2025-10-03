// store/cartStore.ts
import { create } from 'zustand';
import { Cart, CartItem, AddToCartData } from '../types/cart.types';

interface CartState {
  // State
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions - SIMPLE AND SAFE
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  getTotalItems: () => number;
  getCartSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  // Initial state - EMPTY
  cart: null,
  isLoading: false,
  error: null,

  // Simple state setters - NO COMPLEX LOGIC
  setCart: (cart) => set({ cart }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Computed values - PURE FUNCTIONS
  getTotalItems: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },

  getCartSubtotal: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
  },
}));

// Simple hooks for components
export const useCart = () => useCartStore(state => state.cart);
export const useCartItems = () => useCartStore(state => state.cart?.items || []);
export const useCartLoading = () => useCartStore(state => state.isLoading);
export const useCartError = () => useCartStore(state => state.error);
export const useCartActions = () => useCartStore(state => ({
  setCart: state.setCart,
  setLoading: state.setLoading,
  setError: state.setError,
}));
export const useCartTotals = () => useCartStore(state => ({
  totalItems: state.getTotalItems(),
  subtotal: state.getCartSubtotal(),
}));