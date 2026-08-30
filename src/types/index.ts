export interface FigureOption {
  name: string;
  imageUrl: string;
}

export interface Figure {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  options?: FigureOption[];
  category?: string;
  badge?: 'stock' | 'pedido' | 'agotado' | 'novedad';
}
