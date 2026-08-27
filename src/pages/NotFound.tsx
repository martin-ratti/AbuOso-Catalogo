import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center mt-6 sm:mt-10">
      <div className="bg-orange-100 p-5 sm:p-6 rounded-full text-orange-500 mb-5 sm:mb-6">
        <AlertTriangle size={56} className="sm:w-16 sm:h-16" />
      </div>
      <h1 className="text-5xl sm:text-6xl font-black text-abu-brown mb-3 sm:mb-4 tracking-tight">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Página no encontrada</h2>
      <p className="text-gray-500 mb-6 sm:mb-8 max-w-md text-base sm:text-lg">
        Parece que te has perdido. La página que estás buscando no existe o ha sido movida.
      </p>
      <Link 
        to="/" 
        className="bg-abu-accent hover:bg-[#b05f6d] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full flex items-center gap-2 font-bold transition-all shadow-md active:scale-95 text-sm sm:text-base"
      >
        <Home size={18} className="sm:w-5 sm:h-5" /> Volver al Inicio
      </Link>
    </div>
  );
}
