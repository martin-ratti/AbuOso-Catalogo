export const formatPrice = (price: number | string): string => {
  if (typeof price === 'number') {
    return price.toLocaleString('es-AR');
  }
  return price;
};

export const isNumericPrice = (price: number | string): price is number => {
  return typeof price === 'number';
};

export const displayPrice = (price: number | string): string => {
  if (typeof price === 'number') {
    return `$${price.toLocaleString('es-AR')}`;
  }
  return price;
};
