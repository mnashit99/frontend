// types/cart.types.ts
export interface CartItem {
  id: string; // Cart item ID (from backend)
  variant: {
    id: string;
    price: number;
    stock: number;
    sku?: string;
    product: {
      id: string;
      name: string;
      thumbnail: string;
      brand?: string;
    };
  };
  quantity: number;
}

export interface Cart {
  id: string; // Cart ID (from backend)
  items: CartItem[];
}

export interface AddToCartData {
  productVariantId: string;
  quantity: number;
}