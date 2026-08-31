import { useState, useEffect } from 'react';
import type { Figure, FigureOption } from '../types';
import { ShoppingCart, Share2, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { Link } from 'react-router-dom';
import { handleShare } from '../utils/shareUtils';
import { createSlug } from '../utils/slug';
import { APP_CONFIG } from '../config/constants';
import { formatPrice } from '../utils/format';
import { getOptimizedImageUrl } from '../utils/cloudinary';

interface FigureCardProps {
  figure: Figure;
}

export function FigureCard({ figure }: FigureCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [actionModal, setActionModal] = useState<'cart' | 'whatsapp' | null>(null);
  const [selectedOption, setSelectedOption] = useState<FigureOption | null>(null);
  
  const addItem = useCartStore((state) => state.addItem);

  // Cerrar modal al presionar Escape
  useEffect(() => {
    if (!actionModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActionModal(null);
        setSelectedOption(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actionModal]);
  
  const badgeConfig = {
    stock: { text: 'En Stock', color: 'bg-emerald-500' },
    pedido: { text: 'A pedido', color: 'bg-amber-500' },
    agotado: { text: 'Agotado', color: 'bg-gray-400' },
    novedad: { text: '¡Novedad!', color: 'bg-rose-500' },
  };

  const badge = figure.badge ? badgeConfig[figure.badge] : null;
  const productSlug = createSlug(figure.name, figure.id);

  const onShare = (e: React.MouseEvent) => {
    e.preventDefault();
    handleShare({
      title: `AbuOso Artesanías - ${figure.name}`,
      text: `¡Mirá esta figura: ${figure.name} a solo $${formatPrice(figure.price)}!`,
      url: `${window.location.origin}/producto/${productSlug}`
    });
  };

  const hasCustom = figure.options?.some(o => o.name.toLowerCase() === 'personalizada');
  const effectiveOptions = figure.options ? [...figure.options] : [];
  if (!hasCustom) {
    effectiveOptions.push({ name: 'Personalizada', imageUrl: figure.imageUrl || '' });
  }

  const handleActionConfirm = () => {
    if (!selectedOption) return;

    if (actionModal === 'cart') {
      const itemToAdd = {
        ...figure,
        id: `${figure.id}-${selectedOption.name}`,
        name: `${figure.name} (${selectedOption.name})`,
        imageUrl: selectedOption.imageUrl || figure.imageUrl
      };
      addItem(itemToAdd);
      useToastStore.getState().addToast(`¡${itemToAdd.name} agregado al carrito!`, 'success');
    } else if (actionModal === 'whatsapp') {
      const whatsappNumber = APP_CONFIG.WHATSAPP_NUMBER;
      const message = `¡Hola! Vengo del catálogo. Me interesa la figura '${figure.name}' en variante "${selectedOption.name}" ($${formatPrice(figure.price)}). ¿Tienen stock?`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
    
    setActionModal(null);
    setSelectedOption(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg overflow-hidden border border-abu-cream/80 transition-all duration-300 hover:-translate-y-1 flex flex-col relative group">
        
        {/* Botón de Compartir */}
        <button 
          onClick={onShare}
          aria-label={`Compartir ${figure.name}`}
          className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-500 hover:text-abu-accent hover:bg-white shadow-sm transition-all active:scale-90 opacity-0 group-hover:opacity-100 sm:opacity-100"
          title="Compartir"
        >
          <Share2 size={14} aria-hidden="true" />
        </button>

        {/* Badge de estado (Cinta diagonal) */}
        {badge && (
          <div className={`absolute top-4 -right-9 z-10 ${badge.color} text-white text-[10px] font-bold py-1 shadow-md uppercase tracking-wide transform rotate-45 text-center w-32.5`}>
            {badge.text}
          </div>
        )}

        <Link to={`/producto/${productSlug}`} className="block aspect-4/5 w-full overflow-hidden bg-abu-cream/20 relative z-0">
          {figure.imageUrl ? (
            <img 
              src={getOptimizedImageUrl(figure.imageUrl, 500)} 
              alt={figure.name} 
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${!imageLoaded ? 'opacity-0 scale-105' : figure.badge === 'agotado' ? 'grayscale opacity-50' : 'opacity-100 scale-100'} group-hover:scale-105`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">Sin foto</div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="bg-white/95 text-abu-brown font-bold text-xs px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">Ver detalle</span>
          </div>
        </Link>
        
        <div className="p-2.5 sm:p-3 flex flex-col flex-1 gap-1.5">
          <Link to={`/producto/${productSlug}`} className="font-bold text-[13px] sm:text-sm text-abu-brown leading-tight hover:text-abu-accent transition-colors line-clamp-2">
            {figure.name}
          </Link>
          <span className="font-extrabold text-abu-accent text-sm sm:text-base">
            ${formatPrice(figure.price)}
          </span>
          
          {/* Botones */}
          <div className="mt-auto pt-1.5 grid grid-cols-2 gap-1.5 sm:gap-2">
            {/* Botón Carrito */}
            <button 
              disabled={figure.badge === 'agotado'}
              onClick={() => setActionModal('cart')}
              aria-label={`Agregar ${figure.name} al carrito`}
              className="w-full bg-abu-light hover:bg-abu-cream text-abu-brown border border-abu-cream font-semibold py-2 rounded-xl text-xs transition-all active:scale-95 hover:shadow-sm flex items-center justify-center gap-1 disabled:opacity-40 disabled:active:scale-100 disabled:hover:shadow-none"
              title="Agregar al carrito"
            >
              <ShoppingCart size={13} aria-hidden="true" />
              <span className="hidden sm:inline">Carrito</span>
              <span className="sm:hidden" aria-hidden="true">+</span>
            </button>
            
            {/* Botón WhatsApp */}
            <button 
              disabled={figure.badge === 'agotado'}
              onClick={() => setActionModal('whatsapp')}
              aria-label={`Pedir ${figure.name} por WhatsApp`}
              className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-semibold py-2 rounded-xl text-xs transition-all active:scale-95 hover:shadow-sm flex items-center justify-center gap-1 disabled:opacity-40 disabled:active:scale-100 disabled:hover:shadow-none"
              title="Pedir por WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Pedir
            </button>
          </div>
        </div>
      </div>

      {/* Modal de variantes */}
      {actionModal && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="variant-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <h3 id="variant-modal-title" className="font-bold text-lg text-abu-brown">
                {actionModal === 'cart' ? 'Agregar al carrito' : 'Pedir por WhatsApp'}
              </h3>
              <button 
                onClick={() => {
                  setActionModal(null);
                  setSelectedOption(null);
                }}
                aria-label="Cerrar modal"
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <p className="text-sm text-gray-600 mb-4 font-medium">Por favor, elige una variante para <span className="font-bold text-abu-brown">{figure.name}</span>:</p>
              
              <div className="flex flex-col gap-3">
                {effectiveOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(opt)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                      selectedOption?.name === opt.name 
                        ? 'border-abu-accent bg-abu-light/30' 
                        : 'border-gray-200 hover:border-abu-cream bg-white'
                    }`}
                  >
                    {opt.imageUrl ? (
                      <img src={getOptimizedImageUrl(opt.imageUrl, 150)} alt={opt.name} className="w-12 h-12 rounded-xl object-cover bg-abu-cream/30" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">Sin foto</div>
                    )}
                    <span className={`font-bold text-left flex-1 ${selectedOption?.name === opt.name ? 'text-abu-accent' : 'text-gray-700'}`}>
                      {opt.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                disabled={!selectedOption}
                onClick={handleActionConfirm}
                className={`w-full font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  actionModal === 'cart' 
                    ? 'bg-abu-brown hover:bg-abu-dark text-white' 
                    : 'bg-[#25D366] hover:bg-[#20b858] text-white'
                } disabled:opacity-40 disabled:active:scale-100`}
              >
                {actionModal === 'cart' ? (
                  <>Confirmar y Agregar <ShoppingCart size={18} aria-hidden="true" /></>
                ) : (
                  <>Confirmar y Pedir</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
