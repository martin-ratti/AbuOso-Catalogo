import { create } from 'zustand';
import type { Figure } from '../types';

export interface CartItem extends Figure {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  toggleCart: () => void;
  addItem: (figure: Figure) => void;
  removeItem: (figureId: string) => void;
  updateQuantity: (figureId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  addItem: (figure) => set((state) => {
    const existing = state.items.find(item => item.id === figure.id);
    if (existing) {
      return {
        items: state.items.map(item => 
          item.id === figure.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
        isCartOpen: true // Abrir el carrito al agregar
      };
    }
    return { 
      items: [...state.items, { ...figure, quantity: 1 }],
      isCartOpen: true
    };
  }),
  
  removeItem: (figureId) => set((state) => ({
    items: state.items.filter(item => item.id !== figureId)
  })),

  updateQuantity: (figureId, quantity) => set((state) => {
    if (quantity <= 0) {
      return { items: state.items.filter(item => item.id !== figureId) };
    }
    return {
      items: state.items.map(item => 
        item.id === figureId ? { ...item, quantity } : item
      )
    };
  }),
  
  clearCart: () => set({ items: [] }),
  
  getCartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
  
  getCartCount: () => get().items.reduce((total, item) => total + item.quantity, 0)
}));
