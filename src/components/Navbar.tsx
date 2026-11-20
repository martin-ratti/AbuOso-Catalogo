import { Link, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { Search, X, ShoppingBag, Plus, Minus, Send, XCircle, ArrowLeft, Store, Trash2, Construction, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { useSearchStore } from '../store/searchStore';
import { useCatalogStore } from '../store/catalogStore';
import { useMaintenanceStore } from '../store/maintenanceStore';
import { createSlug } from '../utils/slug';
import { APP_CONFIG } from '../config/constants';
import { formatPrice, displayPrice, isNumericPrice } from '../utils/format';
import { getOptimizedImageUrl } from '../utils/cloudinary';

export function Navbar() {
  const location = useLocation();
  const { isCartOpen, toggleCart, items, getCartCount, getCartTotal, updateQuantity, removeItem, clearCart } = useCartStore();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { isMaintenanceMode } = useMaintenanceStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [orderSentPendingClear, setOrderSentPendingClear] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const cartDialogRef = useRef<HTMLDialogElement>(null);

  // Cerrar solo el dropdown de sugerencias al hacer clic fuera (sin borrar el texto buscado)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejo de tecla Escape para cerrar el desplegable de búsqueda
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen && !isCartOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, isSearchOpen]);

  // Sincronizar estado de apertura del drawer nativo <dialog>
  useEffect(() => {
    const dialog = cartDialogRef.current;
    if (!dialog) return;

    if (isCartOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isCartOpen]);

  // Fallback de light-dismiss para navegadores sin <dialog closedby="any">
  useEffect(() => {
    const dialog = cartDialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (e: PointerEvent) => {
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    let pressedOutside = false;
    const handlePointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e) && dialog.open) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const hasConsultItems = items.some(item => !isNumericPrice(item.price));
  const hasNumericItems = items.some(item => isNumericPrice(item.price));
  const cartTotal = getCartTotal();

  const handleWhatsAppOrder = () => {
    const whatsappNumber = APP_CONFIG.WHATSAPP_NUMBER;
    let message = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
    items.forEach(item => {
      if (isNumericPrice(item.price)) {
        message += `- ${item.quantity}x ${item.name} ($${formatPrice(item.price * item.quantity)})\n`;
      } else {
        message += `- ${item.quantity}x ${item.name} (${item.price})\n`;
      }
    });
    if (cartTotal > 0) {
      message += `\n*Total: $${formatPrice(cartTotal)}*`;
    } else if (hasConsultItems) {
      message += `\n*Total: A consultar*`;
    }
    if (hasConsultItems) {
      message += `\n_Nota: Algunos productos requieren consultar precio._`;
    }
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setOrderSentPendingClear(true);
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
            <span className="font-extrabold text-base sm:text-xl text-abu-brown tracking-tight">
              AbuOso <span className="font-medium text-abu-accent hidden md:inline">Artesanías</span>
            </span>
          </Link>
          
          {/* Barra de búsqueda */}
          {isHome && (
            <div ref={searchRef} className="flex-1 max-w-md relative mx-1 sm:mx-2">
              <input 
                type="text" 
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Buscar figuras..." 
                aria-label="Buscar figuras en el catálogo"
                className="w-full bg-abu-light border border-abu-cream rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-abu-accent focus:ring-2 focus:ring-abu-accent/20 transition-all text-abu-dark placeholder:text-gray-500"
              />
              {searchQuery ? (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-abu-accent p-0.5"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              ) : (
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              )}
              
              {/* Dropdown de Autocompletado */}
              {isSearchOpen && searchQuery.length >= 3 && (
                <div 
                  role="listbox" 
                  aria-label="Sugerencias de búsqueda"
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-abu-cream overflow-hidden z-50 max-h-75 overflow-y-auto"
                >
                  {(() => {
                    const { figures } = useCatalogStore.getState();
                    const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                    const query = normalize(searchQuery);
                    const results = figures.filter(f => normalize(f.name).includes(query)).slice(0, 5);
                    
                    if (results.length === 0) {
                      return <div className="p-4 text-center text-sm text-gray-600">No se encontraron figuras.</div>;
                    }
                    
                    return results.map(figure => (
                      <Link 
                        key={figure.id} 
                        to={`/producto/${createSlug(figure.name, figure.id)}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-abu-light transition-colors border-b border-gray-50 last:border-0"
                      >
                        {figure.imageUrl ? (
                          <img src={getOptimizedImageUrl(figure.imageUrl, 100)} alt={figure.name} className="w-11 h-11 rounded-xl object-cover bg-abu-cream" />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gray-200" />
                        )}
                        <div>
                          <p className="font-bold text-sm text-abu-brown">{figure.name}</p>
                          <p className="text-xs font-medium text-abu-accent">{displayPrice(figure.price)}</p>
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
                aria-expanded={isCartOpen}
                aria-controls="cart-drawer"
                aria-label={`Abrir carrito (${getCartCount()} productos)`}
                className="relative p-2.5 text-abu-brown hover:bg-abu-cream/50 rounded-full transition-colors shrink-0 active:scale-95"
              >
                <ShoppingBag size={22} aria-hidden="true" />
                {getCartCount() > 0 && (
                  <span className="absolute top-1 right-1 bg-abu-accent text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {isMaintenanceMode ? (
                <span className="hidden sm:inline-flex items-center bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200 gap-1.5 animate-maintenance-pulse">
                  <Construction size={14} /> Mantenimiento
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-200">
                  Modo Admin
                </span>
              )}
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

      {/* Sidebar del Carrito */}
      {!isAdmin && (
        <dialog
          ref={cartDialogRef}
          id="cart-drawer"
          aria-label="Carrito de compras"
          onClose={() => {
            if (useCartStore.getState().isCartOpen) {
              toggleCart();
            }
          }}
          {...({ closedby: 'any' } as Record<string, string>)}
          className="cart-drawer fixed inset-y-0 right-0 left-auto m-0 p-0 border-0 w-full max-w-100 h-dvh max-h-none bg-white shadow-2xl flex-col"
        >
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
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button 
                onClick={() => {
                  clearCart();
                  setOrderSentPendingClear(false);
                  useToastStore.getState().addToast('Carrito vaciado', 'info');
                }} 
                aria-label="Vaciar carrito" 
                title="Vaciar carrito"
                className="text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 py-1.5 px-2.5 rounded-xl border border-transparent hover:border-red-200 transition-colors flex items-center gap-1.5 font-medium active:scale-95 cursor-pointer"
              >
                <Trash2 size={14} aria-hidden="true" />
                <span>Vaciar</span>
              </button>
            )}
            <button onClick={toggleCart} aria-label="Cerrar carrito" className="p-1.5 text-gray-400 hover:text-abu-brown bg-white rounded-full border border-gray-200 transition-colors active:scale-95">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
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
                {item.imageUrl ? (
                  <img src={getOptimizedImageUrl(item.imageUrl, 160)} alt={item.name} className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-abu-light shrink-0" />
                ) : (
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-gray-200 shrink-0" />
                )}
                <div className="flex-1 flex flex-col min-w-0">
                  <h4 className="font-bold text-sm text-abu-brown leading-tight mb-0.5 truncate">{item.name}</h4>
                  <p className="text-abu-accent text-sm font-bold mb-2">{displayPrice(item.price)}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-abu-light rounded-xl border border-abu-cream px-1 py-0.5">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        aria-label={`Disminuir cantidad de ${item.name}`}
                        className="p-1.5 text-gray-500 hover:text-abu-accent transition-colors active:scale-90"
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        className="p-1.5 text-gray-500 hover:text-abu-accent transition-colors active:scale-90"
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      aria-label={`Eliminar ${item.name} del pedido`}
                      className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition-colors active:scale-90"
                    >
                      <XCircle size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-abu-cream bg-white shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.06)] safe-bottom">
            <div className="flex flex-col gap-1 mb-3 bg-abu-light p-3 rounded-xl border border-abu-cream">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold text-sm">Total estimado:</span>
                <span className="text-xl sm:text-2xl font-black text-abu-brown">
                  {hasNumericItems ? `$${formatPrice(cartTotal)}` : 'A consultar'}
                </span>
              </div>
              {hasNumericItems && hasConsultItems && (
                <p className="text-xs text-amber-700 font-medium text-right">
                  + productos a consultar
                </p>
              )}
            </div>

            {orderSentPendingClear && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col gap-2">
                <p className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" aria-hidden="true" />
                  ¿Ya enviaste tu pedido por WhatsApp?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setOrderSentPendingClear(false);
                      toggleCart();
                      useToastStore.getState().addToast('¡Pedido finalizado y carrito vaciado!', 'success');
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
                  >
                    Sí, vaciar carrito
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderSentPendingClear(false)}
                    className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                  >
                    Conservar
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] hover:shadow-md flex items-center justify-center gap-2"
              >
                <Send size={18} aria-hidden="true" />
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
        </dialog>
      )}
    </>
  );
}
