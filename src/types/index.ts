export interface Figure {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  badge?: 'stock' | 'pedido' | 'agotado' | 'novedad';
}
