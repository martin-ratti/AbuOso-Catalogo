import { Link, useLocation } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { Search, X, ShoppingBag, Plus, Minus, Send, XCircle, ArrowLeft, Store } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useSearchStore } from '../store/searchStore';
import { useCatalogStore } from '../store/catalogStore';
import { createSlug } from '../utils/slug';
import { APP_CONFIG } from '../config/constants';
import { formatPrice } from '../utils/format';

export function Navbar() {
  const location = useLocation();
  const { isCartOpen, toggleCart, items, getCartCount, getCartTotal, updateQuantity, removeItem } = useCartStore();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown de búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        if (searchQuery.length >= 3) setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery, setSearchQuery]);

  // Bloquear scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const handleWhatsAppOrder = () => {
    const whatsappNumber = APP_CONFIG.WHATSAPP_NUMBER;
    let message = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} ($${formatPrice(item.price * item.quantity)})\n`;
    });
    message += `\n*Total: $${formatPrice(getCartTotal())}*`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-abu-cream/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
            <img 
              src="/logo.jpg" 
              alt="AbuOso Logo" 
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-abu-cream shadow-sm" 
            />
            <h1 className="font-extrabold text-base sm:text-xl text-abu-brown tracking-tight">
              AbuOso <span className="font-medium text-abu-accent hidden md:inline">Artesanías</span>
            </h1>
          </Link>
          
          {/* Barra de búsqueda */}
          {isHome && (
            <div ref={searchRef} className="flex-1 max-w-md relative mx-1 sm:mx-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar figuras..." 
                className="w-full bg-abu-light border border-abu-cream rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-abu-accent focus:ring-2 focus:ring-abu-accent/20 transition-all text-abu-dark placeholder:text-gray-400"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-abu-accent p-0.5"
                >
                  <X size={16} />
                </button>
              ) : (
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              )}
              
              {/* Dropdown de Autocompletado */}
              {searchQuery.length >= 3 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-abu-cream overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                  {(() => {
                    const { figures } = useCatalogStore.getState();
                    const query = searchQuery.toLowerCase().trim();
                    const results = figures.filter(f => f.name.toLowerCase().includes(query)).slice(0, 5);
                    
                    if (results.length === 0) {
                      return <div className="p-4 text-center text-sm text-gray-500">No se encontraron figuras.</div>;
                    }
                    
                    return results.map(figure => (
                      <Link 
                        key={figure.id} 
                        to={`/producto/${createSlug(figure.name, figure.id)}`}
                        onClick={() => setSearchQuery('')}
                        className="flex items-center gap-3 p-3 hover:bg-abu-light transition-colors border-b border-gray-50 last:border-0"
                      >
                        <img src={figure.imageUrl} alt={figure.name} className="w-11 h-11 rounded-xl object-cover bg-abu-cream" />
                        <div>
                          <p className="font-bold text-sm text-abu-brown">{figure.name}</p>
                          <p className="text-xs font-medium text-abu-accent">${formatPrice(figure.price)}</p>
                        </div>
                      </Link>
                    ));
                  })()}
                </div>
              )}
            </div>
          )}

          {!isAdmin ? (
            <div className="flex items-center">
              {/* Botón Carrito Global */}
              <button 
                onClick={toggleCart}
                aria-label="Abrir carrito"
                className="relative p-2.5 text-abu-brown hover:bg-abu-cream/50 rounded-full transition-colors flex-shrink-0 active:scale-95"
              >
                <ShoppingBag size={22} aria-hidden="true" />
                {getCartCount() > 0 && (
                  <span className="absolute top-1 right-1 bg-abu-accent text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-flex items-center bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-200">
                Modo Admin
              </span>
              <Link 
                to="/" 
                className="flex items-center gap-2 text-sm font-bold text-abu-brown hover:text-abu-accent transition-colors bg-abu-light py-2 px-3 sm:px-4 rounded-full"
              >
                <Store size={18} />
                <span className="hidden sm:inline">Ver Tienda</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Overlay Oscuro para el carrito */}
      {!isAdmin && isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity backdrop-blur-[2px]"
          onClick={toggleCart}
        />
      )}

      {/* Sidebar del Carrito */}
      {!isAdmin && (
        <div className={`fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out will-change-transform flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b border-abu-cream bg-abu-light/80">
          <div className="flex items-center gap-2.5 text-abu-brown">
            <ShoppingBag size={20} aria-hidden="true" />
            <h2 className="font-bold text-lg">Tu Pedido</h2>
            {items.length > 0 && (
              <span className="bg-abu-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {getCartCount()}
              </span>
            )}
          </div>
          <button onClick={toggleCart} aria-label="Cerrar carrito" className="p-1.5 text-gray-400 hover:text-abu-brown bg-white rounded-full border border-gray-200 transition-colors active:scale-95">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        
        <div className="p-3 sm:p-4 flex-1 overflow-y-auto flex flex-col gap-3 bg-gray-50/50 cart-scrollbar">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 py-12">
              <div className="bg-abu-light p-5 rounded-full text-abu-cream">
                <ShoppingBag size={44} />
              </div>
              <p className="font-medium text-gray-500">Tu carrito está vacío.</p>
              <button 
                onClick={toggleCart}
                className="mt-2 text-abu-accent hover:text-abu-brown font-bold flex items-center gap-2 transition-colors text-sm"
              >
                <ArrowLeft size={16} /> Volver al catálogo
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 items-center bg-white border border-abu-cream/80 p-2.5 sm:p-3 rounded-2xl shadow-sm">
                <img src={item.imageUrl} alt={item.name} className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl object-cover bg-abu-light shrink-0" />
                <div className="flex-1 flex flex-col min-w-0">
                  <h4 className="font-bold text-sm text-abu-brown leading-tight mb-0.5 truncate">{item.name}</h4>
                  <p className="text-abu-accent text-sm font-bold mb-2">${formatPrice(item.price)}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-abu-light rounded-xl border border-abu-cream px-1 py-0.5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-gray-500 hover:text-abu-accent transition-colors active:scale-90"><Minus size={14} /></button>
                      <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-gray-500 hover:text-abu-accent transition-colors active:scale-90"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition-colors active:scale-90">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-abu-cream bg-white shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.06)] safe-bottom">
            <div className="flex justify-between items-center mb-3 bg-abu-light p-3 rounded-xl border border-abu-cream">
              <span className="text-gray-600 font-bold text-sm">Total estimado:</span>
              <span className="text-xl sm:text-2xl font-black text-abu-brown">${formatPrice(getCartTotal())}</span>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] hover:shadow-md flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Enviar pedido por WhatsApp
              </button>
              <button 
                onClick={toggleCart}
                className="w-full bg-white hover:bg-abu-light text-abu-brown border-2 border-abu-cream font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </>
  );
}
