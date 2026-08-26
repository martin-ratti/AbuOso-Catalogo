import type { Figure } from '../types';

interface FigureCardProps {
  figure: Figure;
}

export function FigureCard({ figure }: FigureCardProps) {
  const whatsappNumber = "3464441120";
  const message = `¡Hola! Vengo del catálogo. Me interesa la figura '${figure.name}' ($${figure.price}). ¿Tienen stock?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Colores y textos según el badge
  const badgeConfig = {
    stock: { text: 'En Stock', color: 'bg-emerald-500' },
    pedido: { text: 'A pedido (3 días)', color: 'bg-amber-500' },
    agotado: { text: 'Agotado', color: 'bg-gray-500' },
    novedad: { text: '¡Novedad!', color: 'bg-rose-500' },
  };

  const badge = figure.badge ? badgeConfig[figure.badge] : null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-abu-cream transition-all hover:-translate-y-1 flex flex-col relative">
      
      {/* Badge de estado */}
      {badge && (
        <div className={`absolute top-2 left-2 z-10 ${badge.color} text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wide`}>
          {badge.text}
        </div>
      )}

      <div className="aspect-square w-full overflow-hidden bg-abu-cream/30">
        <img 
          src={figure.imageUrl} 
          alt={figure.name} 
          className={`w-full h-full object-cover mix-blend-multiply transition-opacity ${figure.badge === 'agotado' ? 'grayscale opacity-60' : ''}`}
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-start gap-1">
          <h3 className="font-bold text-sm text-abu-brown leading-tight">{figure.name}</h3>
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
            className="w-full bg-abu-light hover:bg-abu-cream text-abu-brown border border-abu-cream font-medium py-1.5 rounded-lg text-xs transition-colors active:scale-95 flex items-center justify-center gap-1 disabled:opacity-50 disabled:active:scale-100"
            title="Agregar al carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Carrito
          </button>
          
          {/* Botón WhatsApp */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-medium py-1.5 rounded-lg text-xs transition-colors active:scale-95 flex items-center justify-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
