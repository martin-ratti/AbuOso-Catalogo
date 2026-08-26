import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-10">
      <div className="bg-orange-100 p-6 rounded-full text-orange-500 mb-6">
        <AlertTriangle size={64} />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-abu-brown mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Página no encontrada</h2>
      <p className="text-gray-500 mb-8 max-w-md text-lg">
        Parece que te has perdido. La página que estás buscando no existe o ha sido movida.
      </p>
      <Link 
        to="/" 
        className="bg-abu-accent hover:bg-[#b05f6d] text-white px-8 py-3.5 rounded-full flex items-center gap-2 font-bold transition-all shadow-md active:scale-95"
      >
        <Home size={20} /> Volver al Inicio
      </Link>
    </div>
  );
}
