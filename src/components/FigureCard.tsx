import type { Figure } from '../types';

interface FigureCardProps {
  figure: Figure;
}

export function FigureCard({ figure }: FigureCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md overflow-hidden border border-abu-cream transition-all hover:-translate-y-1 flex flex-col">
      <div className="aspect-square w-full overflow-hidden bg-abu-cream/30">
        <img 
          src={figure.imageUrl} 
          alt={figure.name} 
          className="w-full h-full object-cover mix-blend-multiply"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg text-abu-brown leading-tight">{figure.name}</h3>
          <span className="font-bold text-abu-accent bg-abu-cream px-2 py-1 rounded-lg text-sm whitespace-nowrap">
            ${figure.price}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 flex-1">{figure.description}</p>
        <button className="mt-auto w-full bg-abu-brown hover:bg-abu-dark text-white font-medium py-2.5 rounded-xl transition-colors active:scale-95 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Consultar
        </button>
      </div>
    </div>
  );
}
