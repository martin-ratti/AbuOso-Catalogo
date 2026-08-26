import { useState } from 'react';
import { Menu, Search, X, ShoppingBag, Home, Phone, XCircle, Plus, Minus, Send } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export function Navbar() {
  // Extraer estado del carrito
  const { isCartOpen, toggleCart, items, getCartCount, getCartTotal, updateQuantity, removeItem } = useCartStore();

  const handleWhatsAppOrder = () => {
    const whatsappNumber = "3464441120";
    let message = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} ($${item.price * item.quantity})\n`;
    });
    message += `\n*Total: $${getCartTotal()}*`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/logo.jpg" 
              alt="AbuOso Logo" 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-abu-cream shadow-sm" 
            />
            <h1 className="font-bold text-lg sm:text-xl text-abu-brown tracking-tight">
              AbuOso <span className="font-medium text-abu-accent hidden sm:inline">Artesanías</span>
            </h1>
          </div>
          
          {/* Barra de búsqueda (Desktop) */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Buscar figuras, macetas..." 
              className="w-full bg-abu-light border border-abu-cream rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-abu-accent transition-colors text-abu-dark"
            />
            <Search size={18} className="absolute right-3 top-2 text-gray-400" />
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            {/* Botón Carrito Global */}
            <button 
              onClick={toggleCart}
              className="relative p-2 text-abu-brown hover:bg-abu-cream rounded-full transition-colors"
            >
              <ShoppingBag size={22} />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-abu-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay Oscuro para el carrito */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Sidebar del Carrito */}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-[340px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b border-abu-cream bg-abu-light">
          <div className="flex items-center gap-2 text-abu-brown">
            <ShoppingBag size={20} />
            <h2 className="font-bold text-lg">Tu Pedido</h2>
          </div>
          <button onClick={toggleCart} className="p-1 text-gray-500 hover:text-abu-brown bg-white rounded-full border border-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 items-center border border-abu-cream p-2 rounded-xl">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-abu-cream" />
                <div className="flex-1 flex flex-col">
                  <h4 className="font-bold text-sm text-abu-brown leading-tight">{item.name}</h4>
                  <p className="text-abu-accent text-sm font-medium">${item.price}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-abu-light rounded-lg border border-abu-cream">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-abu-accent"><Minus size={14} /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-abu-accent"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-abu-cream bg-abu-light">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total estimado:</span>
              <span className="text-xl font-bold text-abu-brown">${getCartTotal()}</span>
            </div>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3 rounded-xl transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Enviar pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
