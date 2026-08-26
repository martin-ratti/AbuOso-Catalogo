export function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.jpg" 
            alt="AbuOso Logo" 
            className="w-11 h-11 rounded-full object-cover border-2 border-abu-cream shadow-sm" 
          />
          <h1 className="font-bold text-xl text-abu-brown tracking-tight">AbuOso <span className="font-medium text-abu-accent">Artesanías</span></h1>
        </div>
        
        {/* Aquí podríamos poner un botón de menú hamburguesa para móvil luego */}
        <nav className="hidden sm:flex gap-6 text-abu-brown font-medium">
          <a href="#" className="hover:text-abu-accent transition-colors">Inicio</a>
          <a href="#" className="hover:text-abu-accent transition-colors">Catálogo</a>
          <a href="#" className="hover:text-abu-accent transition-colors">Contacto</a>
        </nav>
      </div>
    </header>
  );
}
