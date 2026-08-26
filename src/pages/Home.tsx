import { useState } from 'react';
import { FigureCard } from '../components/FigureCard';
import { MOCK_FIGURES } from '../data/mock';
import { LayoutGrid, Sparkles, Package, Smile, PawPrint, Sprout, TreePine } from 'lucide-react';

const CATEGORIES = ['Todos', 'Nuevos', 'Combos', 'Ositos', 'Animalitos', 'Macetas', 'Navideñas'];

export function Home() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredFigures = MOCK_FIGURES.filter(figure => {
    if (activeCategory === 'Todos') return true;
    if (activeCategory === 'Nuevos') return figure.badge === 'novedad';
    return figure.category === activeCategory;
  });

  const renderCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Todos': return <LayoutGrid size={28} strokeWidth={1.5} />;
      case 'Nuevos': return <Sparkles size={28} strokeWidth={1.5} />;
      case 'Combos': return <Package size={28} strokeWidth={1.5} />;
      case 'Ositos': return <Smile size={28} strokeWidth={1.5} />;
      case 'Animalitos': return <PawPrint size={28} strokeWidth={1.5} />;
      case 'Macetas': return <Sprout size={28} strokeWidth={1.5} />;
      case 'Navideñas': return <TreePine size={28} strokeWidth={1.5} />;
      default: return <LayoutGrid size={28} strokeWidth={1.5} />;
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:py-10">
      
      {/* Encabezado */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-abu-cream">
        <img 
          src="/logo.jpg" 
          alt="AbuOso Artesanías" 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-abu-cream shadow-md"
        />
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-abu-dark mb-2">
            Crear con las manos alimenta el alma
          </h2>
          <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
            Figuras de yeso hechas con amor. Ideales para decorar tus espacios, pintar en familia o regalar un detalle único.
          </p>
        </div>
      </div>

      {/* Burbujas de Categorías */}
      <div className="mb-8">
        <div className="flex overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 hide-scrollbar snap-x">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-start flex flex-col items-center gap-2 min-w-[72px] transition-transform active:scale-95 ${activeCategory === cat ? 'opacity-100' : 'opacity-70 hover:opacity-100 text-gray-500 hover:text-abu-brown'}`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm border-2 transition-colors ${activeCategory === cat ? 'border-abu-accent bg-abu-cream text-abu-brown' : 'border-gray-200 bg-white text-gray-400'}`}>
                {renderCategoryIcon(cat)}
              </div>
              <span className={`text-[11px] font-bold text-center ${activeCategory === cat ? 'text-abu-brown' : 'text-gray-500'}`}>
                {cat}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-abu-brown">{activeCategory === 'Todos' ? 'Catálogo' : activeCategory}</h3>
        <span className="text-xs font-medium text-abu-accent bg-abu-cream px-2.5 py-1 rounded-full">
          {filteredFigures.length} figuras
        </span>
      </div>

      {/* Grilla responsiva */}
      {filteredFigures.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {filteredFigures.map(figure => (
            <FigureCard key={figure.id} figure={figure} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-abu-cream">
          <p className="text-gray-500">No hay figuras en esta categoría por el momento.</p>
        </div>
      )}
    </main>
  );
}
