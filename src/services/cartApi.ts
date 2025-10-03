// services/cartApi.ts
import api from './api';
import { Cart, AddToCartData } from '../types/cart.types';

export const cartApi = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/orders/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (data: AddToCartData): Promise<Cart> => {
    const response = await api.post<Cart>('/orders/cart/items', data);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await api.patch<Cart>(`/orders/cart/items/${itemId}`, {
      quantity
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await api.delete<Cart>(`/orders/cart/items/${itemId}`);
    return response.data;
  },

  // Clear entire cart (optional - if needed)
  clearCart: async (): Promise<void> => {
    // This might need a custom endpoint or we can remove items one by one
    // For now, we'll handle this on frontend by removing all items
    console.log('Clear cart functionality would be implemented here');
  }
};

export default cartApi;