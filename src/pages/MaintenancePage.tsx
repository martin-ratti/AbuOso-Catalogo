import { Lock, Heart, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-abu-light flex flex-col items-center justify-center p-4 text-center relative">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-abu-cream/40 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-orange-100/30 rounded-full blur-xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
        {/* Oso trabajador */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 mb-6 sm:mb-8 animate-bounce-slow">
          <img
            src="/maintenance-bear.jpg"
            alt="Oso trabajador de AbuOso Artesanías"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Cinta de precaución */}
        <div className="w-full max-w-sm mb-6 overflow-hidden rounded-lg">
          <div className="h-3 bg-repeating-stripe" />
        </div>

        {/* Mensaje principal */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-abu-brown mb-3 tracking-tight flex items-center gap-2 justify-center">
          <Construction size={28} className="text-amber-500 sm:w-8 sm:h-8" />
          ¡Estamos mejorando!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mb-2 max-w-xs leading-relaxed">
          Nuestro oso está trabajando duro para traerte novedades.
        </p>
        <p className="text-gray-500 text-xs sm:text-sm mb-8 flex items-center gap-1.5 justify-center">
          Volvemos pronto. ¡Gracias por tu paciencia!
          <Heart size={14} className="text-red-400 fill-red-400" />
        </p>

        {/* Cinta de precaución inferior */}
        <div className="w-full max-w-sm mb-8 overflow-hidden rounded-lg">
          <div className="h-3 bg-repeating-stripe" />
        </div>

        {/* Info de contacto */}
        <div className="bg-white/80 backdrop-blur-sm border border-abu-cream rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
          <p className="text-sm text-gray-600 mb-2 font-medium">Mientras tanto, ¡seguinos en Instagram!</p>
          <a
            href="https://www.instagram.com/abuoso.artesanias/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-abu-accent hover:text-abu-brown font-bold text-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            @abuoso.artesanias
          </a>
        </div>
      </div>

      {/* Botón oculto de acceso admin — posicionado en la esquina inferior derecha */}
      <Link
        to="/admin"
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-gray-300 hover:text-abu-accent transition-colors p-2 rounded-full hover:bg-white/50"
        title="Acceso administrador"
      >
        <Lock size={16} />
      </Link>

      {/* Créditos */}
      <p className="absolute bottom-4 text-[10px] text-gray-300">
        © {new Date().getFullYear()} AbuOso Artesanías
      </p>
    </div>
  );
}
