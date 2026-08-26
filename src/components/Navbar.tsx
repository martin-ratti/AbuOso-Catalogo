import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo y Hamburger */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-1.5 sm:hidden text-abu-brown hover:bg-abu-cream rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="AbuOso Logo" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-abu-cream shadow-sm" 
              />
              <h1 className="font-bold text-lg sm:text-xl text-abu-brown tracking-tight hidden min-[400px]:block">
                AbuOso <span className="font-medium text-abu-accent hidden sm:inline">Artesanías</span>
              </h1>
            </div>
          </div>
          
          {/* Barra de búsqueda (Desktop) */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Buscar figuras, macetas..." 
              className="w-full bg-abu-light border border-abu-cream rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-abu-accent transition-colors text-abu-dark"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>

          <nav className="hidden sm:flex gap-4 lg:gap-6 text-abu-brown font-medium text-sm">
            <a href="#" className="hover:text-abu-accent transition-colors">Catálogo</a>
            <a href="#" className="hover:text-abu-accent transition-colors">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Overlay Oscuro para el menú */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 sm:hidden transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Móvil */}
      <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out sm:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b border-abu-cream">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-abu-cream" />
            <h2 className="font-bold text-lg text-abu-brown">Menú</h2>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-1 text-gray-500 hover:text-abu-brown bg-abu-light rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Búsqueda en móvil */}
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-abu-light border border-abu-cream rounded-xl py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:border-abu-accent"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-3 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categorías</h3>
          <ul className="flex flex-col gap-3 text-abu-dark font-medium">
            <li><a href="#" className="flex items-center gap-2 hover:text-abu-accent p-2 rounded-lg hover:bg-abu-light transition-colors"><span className="w-1.5 h-1.5 bg-abu-accent rounded-full"></span> Ositos</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-abu-accent p-2 rounded-lg hover:bg-abu-light transition-colors"><span className="w-1.5 h-1.5 bg-abu-accent rounded-full"></span> Navideñas</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-abu-accent p-2 rounded-lg hover:bg-abu-light transition-colors"><span className="w-1.5 h-1.5 bg-abu-accent rounded-full"></span> Animalitos</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-abu-accent p-2 rounded-lg hover:bg-abu-light transition-colors"><span className="w-1.5 h-1.5 bg-abu-accent rounded-full"></span> Macetas</a></li>
          </ul>

          <div className="mt-8 pt-6 border-t border-abu-cream">
             <ul className="flex flex-col gap-4 text-gray-600 text-sm">
              <li><a href="#" className="flex items-center gap-2 hover:text-abu-brown"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> Inicio</a></li>
              <li><a href="#" className="flex items-center gap-2 hover:text-abu-brown"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Contacto</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
