import { describe, it, expect, beforeEach } from 'vitest';
import { formatPrice, isNumericPrice, displayPrice } from './format';
import { createSlug } from './slug';
import { APP_CONFIG } from '../config/constants';
import type { Figure } from '../types';

// Configurar localStorage en memoria en window y globalThis para que el middleware persist de Zustand funcione en Node
const memoryStorage = new Map<string, string>();
const mockStorage = {
  getItem: (key: string) => memoryStorage.get(key) ?? null,
  setItem: (key: string, value: string) => { memoryStorage.set(key, value); },
  removeItem: (key: string) => { memoryStorage.delete(key); },
  clear: () => { memoryStorage.clear(); },
  key: (index: number) => Array.from(memoryStorage.keys())[index] ?? null,
  get length() { return memoryStorage.size; },
};

Object.defineProperty(globalThis, 'localStorage', { value: mockStorage, configurable: true });
Object.defineProperty(globalThis, 'window', { value: { localStorage: mockStorage }, configurable: true });

const { useCartStore } = await import('../store/cartStore');

describe('Cálculos de precios (format.ts)', () => {
  it('verifica si un precio es numérico correctamente', () => {
    expect(isNumericPrice(1500)).toBe(true);
    expect(isNumericPrice(0)).toBe(true);
    expect(isNumericPrice('Consultar')).toBe(false);
    expect(isNumericPrice('A convenir')).toBe(false);
  });

  it('formatea precios numéricos con separador local y deja textos intactos', () => {
    expect(formatPrice(1500)).toMatch(/1\.?500/);
    expect(formatPrice('Consultar')).toBe('Consultar');
  });

  it('muestra el símbolo $ solo para precios numéricos', () => {
    expect(displayPrice(2500)).toMatch(/^\$2\.?500$/);
    expect(displayPrice('Consultar')).toBe('Consultar');
  });
});

describe('Enlaces de productos y configuración de WhatsApp', () => {
  it('genera slugs limpios sin acentos ni caracteres especiales concatenando el ID', () => {
    expect(createSlug('Osito Dormilón #1!', 'abc123')).toBe('osito-dormilon-1-abc123');
    expect(createSlug('  Ángel de la Guarda  ', 'xyz99')).toBe('angel-de-la-guarda-xyz99');
  });

  it('tiene configurado el número de WhatsApp con el prefijo internacional de Argentina (549)', () => {
    expect(APP_CONFIG.WHATSAPP_NUMBER).toMatch(/^549\d{10}$/);
    expect(APP_CONFIG.WHATSAPP_NUMBER).toBe('5493464549789');
  });
});

describe('Carrito de compras (cartStore.ts)', () => {
  const sampleNumericFigure: Figure = {
    id: 'fig-1',
    name: 'Osito Pintor',
    description: 'Figura artesanal',
    price: 2000,
  };

  const sampleConsultFigure: Figure = {
    id: 'fig-2',
    name: 'Buda Especial',
    description: 'Figura a medida',
    price: 'Consultar',
  };

  beforeEach(() => {
    useCartStore.setState({ items: [], isCartOpen: false });
  });

  it('agrega productos nuevos e incrementa cantidad si ya existen', () => {
    const store = useCartStore.getState();
    store.addItem(sampleNumericFigure);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
    expect(useCartStore.getState().getCartCount()).toBe(1);

    store.addItem(sampleNumericFigure);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
    expect(useCartStore.getState().getCartCount()).toBe(2);
  });

  it('calcula el total sumando únicamente los productos con precio numérico', () => {
    const store = useCartStore.getState();
    store.addItem(sampleNumericFigure);
    store.addItem(sampleNumericFigure); // 2 x 2000 = 4000
    store.addItem(sampleConsultFigure); // 'Consultar' -> suma 0 al subtotal numérico

    expect(useCartStore.getState().getCartCount()).toBe(3);
    expect(useCartStore.getState().getCartTotal()).toBe(4000);
  });

  it('retorna total 0 cuando el carrito solo contiene productos con precio "Consultar"', () => {
    const store = useCartStore.getState();
    store.addItem(sampleConsultFigure);

    expect(useCartStore.getState().getCartCount()).toBe(1);
    expect(useCartStore.getState().getCartTotal()).toBe(0);
  });

  it('actualiza cantidades, elimina producto al llegar a 0 y vacía el carrito', () => {
    const store = useCartStore.getState();
    store.addItem(sampleNumericFigure);
    store.addItem(sampleConsultFigure);

    store.updateQuantity('fig-1', 5);
    expect(useCartStore.getState().getCartTotal()).toBe(10000);

    store.updateQuantity('fig-1', 0);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe('fig-2');

    store.clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().getCartCount()).toBe(0);
  });
});
