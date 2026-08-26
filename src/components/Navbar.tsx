import { Link, useLocation } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { Search, X, ShoppingBag, Plus, Minus, Send, XCircle, ArrowLeft } from 'lucide-react';
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
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap">
            <img 
              src="/logo.jpg" 
              alt="AbuOso Logo" 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-abu-cream shadow-sm" 
            />
            <h1 className="font-bold text-lg sm:text-xl text-abu-brown tracking-tight hidden xs:block">
              AbuOso <span className="font-medium text-abu-accent hidden md:inline">Artesanías</span>
            </h1>
          </Link>
          
          {/* Barra de búsqueda (Desktop & Mobile if Home) */}
          {isHome && (
            <div ref={searchRef} className="flex-1 max-w-md relative mx-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar figuras..." 
                className="w-full bg-abu-light border border-abu-cream rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-abu-accent focus:ring-1 focus:ring-abu-accent transition-all text-abu-dark"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-abu-accent"
                >
                  <X size={16} />
                </button>
              ) : (
                <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
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
                        <img src={figure.imageUrl} alt={figure.name} className="w-12 h-12 rounded-xl object-cover bg-abu-cream" />
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

          {!isAdmin && (
            <div className="flex items-center gap-2 sm:gap-6">
              {/* Botón Carrito Global */}
              <button 
                onClick={toggleCart}
                aria-label="Abrir carrito"
                className="relative p-2 text-abu-brown hover:bg-abu-cream rounded-full transition-colors flex-shrink-0"
              >
                <ShoppingBag size={22} aria-hidden="true" />
                {getCartCount() > 0 && (
                  <span className="absolute top-0 right-0 bg-abu-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Overlay Oscuro para el carrito */}
      {!isAdmin && isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity backdrop-blur-sm"
          onClick={toggleCart}
        />
      )}

      {/* Sidebar del Carrito */}
      {!isAdmin && (
        <div className={`fixed top-0 right-0 bottom-0 w-full max-w-[380px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b border-abu-cream bg-abu-light">
          <div className="flex items-center gap-2 text-abu-brown">
            <ShoppingBag size={20} aria-hidden="true" />
            <h2 className="font-bold text-lg">Tu Pedido</h2>
          </div>
          <button onClick={toggleCart} aria-label="Cerrar carrito" className="p-1 text-gray-500 hover:text-abu-brown bg-white rounded-full border border-gray-200 transition-colors">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4 bg-gray-50/50">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="bg-abu-light p-6 rounded-full text-abu-cream">
                <ShoppingBag size={48} />
              </div>
              <p className="font-medium text-gray-500">Tu carrito está vacío.</p>
              <button 
                onClick={toggleCart}
                className="mt-2 text-abu-accent hover:text-abu-brown font-bold flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={16} /> Volver al catálogo
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-white border border-abu-cream p-3 rounded-2xl shadow-sm">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-abu-light" />
                <div className="flex-1 flex flex-col">
                  <h4 className="font-bold text-sm text-abu-brown leading-tight mb-1">{item.name}</h4>
                  <p className="text-abu-accent text-sm font-bold mb-3">${formatPrice(item.price)}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 bg-abu-light rounded-xl border border-abu-cream px-1 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-500 hover:text-abu-accent transition-colors"><Minus size={14} /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-500 hover:text-abu-accent transition-colors"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1.5 bg-gray-50 rounded-full transition-colors">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-abu-cream bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4 bg-abu-light p-3 rounded-xl border border-abu-cream">
              <span className="text-gray-600 font-bold">Total estimado:</span>
              <span className="text-2xl font-black text-abu-brown">${formatPrice(getCartTotal())}</span>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 hover:shadow-md flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Enviar pedido por WhatsApp
              </button>
              <button 
                onClick={toggleCart}
                className="w-full bg-white hover:bg-abu-light text-abu-brown border-2 border-abu-cream font-bold py-3.5 rounded-xl transition-all active:scale-95 hover:shadow-sm flex items-center justify-center gap-2"
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
