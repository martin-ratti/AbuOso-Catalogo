import type { Figure } from '../types';
import { ShoppingCart, Share2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { Link } from 'react-router-dom';
import { handleShare } from '../utils/shareUtils';
import { createSlug } from '../utils/slug';

interface FigureCardProps {
  figure: Figure;
}

export function FigureCard({ figure }: FigureCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  
  const whatsappNumber = "3464441120";
  const message = `¡Hola! Vengo del catálogo. Me interesa la figura '${figure.name}' ($${figure.price}). ¿Tienen stock?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Colores y textos según el badge
  const badgeConfig = {
    stock: { text: 'En Stock', color: 'bg-emerald-500' },
    pedido: { text: 'A pedido', color: 'bg-amber-500' },
    agotado: { text: 'Agotado', color: 'bg-gray-500' },
    novedad: { text: '¡Novedad!', color: 'bg-rose-500' },
  };

  const badge = figure.badge ? badgeConfig[figure.badge] : null;
  const productSlug = createSlug(figure.name, figure.id);

  const onShare = (e: React.MouseEvent) => {
    e.preventDefault(); // Para evitar que el Link se dispare
    handleShare({
      title: `AbuOso Artesanías - ${figure.name}`,
      text: `¡Mirá esta figura: ${figure.name} a solo $${figure.price}!`,
      url: `${window.location.origin}/producto/${productSlug}`
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-abu-cream transition-all hover:-translate-y-1 flex flex-col relative group">
      
      {/* Botón de Compartir */}
      <button 
        onClick={onShare}
        aria-label={`Compartir ${figure.name}`}
        className="absolute top-2 left-2 z-20 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-600 hover:text-abu-accent hover:bg-white shadow-sm transition-all active:scale-95"
        title="Compartir"
      >
        <Share2 size={16} aria-hidden="true" />
      </button>

      {/* Badge de estado (Cinta diagonal) */}
      {badge && (
        <div className={`absolute top-4 -right-9 z-10 ${badge.color} text-white text-[10px] font-bold py-1 shadow-md uppercase tracking-wide transform rotate-45 text-center w-[130px]`}>
          {badge.text}
        </div>
      )}

      <Link to={`/producto/${productSlug}`} className="block aspect-square w-full overflow-hidden bg-abu-cream/30 relative z-0">
        <img 
          src={figure.imageUrl} 
          alt={figure.name} 
          className={`w-full h-full object-cover mix-blend-multiply transition-opacity ${figure.badge === 'agotado' ? 'grayscale opacity-60' : ''}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-abu-brown font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">Ver detalle</span>
        </div>
      </Link>
      
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-start gap-1">
          <Link to={`/producto/${figure.id}`} className="font-bold text-sm text-abu-brown leading-tight hover:text-abu-accent transition-colors line-clamp-1">
            {figure.name}
          </Link>
          <span className="font-bold text-abu-accent bg-abu-cream px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
            ${figure.price}
          </span>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 flex-1">{figure.description}</p>
        
        {/* Botones */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          {/* Botón Carrito */}
          <button 
            disabled={figure.badge === 'agotado'}
            onClick={() => {
              addItem(figure);
              useToastStore.getState().addToast(`¡${figure.name} agregado al carrito!`, 'success');
            }}
            className="w-full bg-abu-light hover:bg-abu-cream text-abu-brown border border-abu-cream font-medium py-1.5 rounded-lg text-xs transition-colors active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:active:scale-100"
            title="Agregar al carrito"
          >
            <ShoppingCart size={14} />
            Carrito
          </button>
          
          {/* Botón WhatsApp */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-medium py-1.5 rounded-lg text-xs transition-colors active:scale-95 flex items-center justify-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Pedir
          </a>
        </div>
      </div>
    </div>
  );
}
