import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FigureCard } from './components/FigureCard';
import type { Figure } from './types';

// Datos de prueba temporales
const MOCK_FIGURES: Figure[] = [
  {
    id: '1',
    name: 'Osito Pintor',
    description: 'Figura de yeso de osito con pincel. Ideal para que los más chicos se diviertan pintando.',
    price: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1559441113-d47660232414?auto=format&fit=crop&q=80&w=600',
    category: 'Ositos',
    badge: 'novedad'
  },
  {
    id: '2',
    name: 'Casita Decorativa',
    description: 'Casita detallada para adornar espacios infantiles o armar pequeñas villas navideñas.',
    price: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600',
    category: 'Navideñas',
    badge: 'stock'
  },
  {
    id: '3',
    name: 'Conejito Tierno',
    description: 'Figura de conejo sentado. Perfecta para decoración de pascua o regalo de nacimiento.',
    price: 1300,
    imageUrl: 'https://images.unsplash.com/photo-1584852332675-523277717643?auto=format&fit=crop&q=80&w=600',
    category: 'Animalitos',
    badge: 'agotado'
  },
  {
    id: '4',
    name: 'Jirafa Bebé',
    description: 'Adorno de yeso con forma de jirafa. Lista para ser pintada con los colores que más te gusten.',
    price: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1540306126607-bb9d57a2dfec?auto=format&fit=crop&q=80&w=600',
    category: 'Animalitos',
    badge: 'pedido'
  },
  {
    id: '5',
    name: 'Perrito Sentado',
    description: 'Tierna figura de perrito para decorar estantes o regalar a los amantes de las mascotas.',
    price: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1584852332675-523277717643?auto=format&fit=crop&q=80&w=600',
    category: 'Animalitos',
    badge: 'stock'
  },
  {
    id: '6',
    name: 'Maceta Geométrica',
    description: 'Mini maceta de yeso ideal para suculentas pequeñas. Diseño moderno y minimalista.',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600',
    category: 'Macetas',
    badge: 'novedad'
  },
  {
    id: '7',
    name: 'Combo Ositos',
    description: 'Set de 3 ositos de diferentes tamaños para pintar. Incluye pincel y pinturas.',
    price: 3900,
    imageUrl: 'https://images.unsplash.com/photo-1559441113-d47660232414?auto=format&fit=crop&q=80&w=600',
    category: 'Combos',
    badge: 'pedido'
  },
  {
    id: '8',
    name: 'Maceta Elefante',
    description: 'Maceta con forma de elefante, la trompa hacia arriba. Clásico adorno para atraer la buena fortuna.',
    price: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1540306126607-bb9d57a2dfec?auto=format&fit=crop&q=80&w=600',
    category: 'Macetas',
    badge: 'stock'
  },
];

const CATEGORIES = ['Todos', 'Nuevos', 'Combos', 'Ositos', 'Animalitos', 'Macetas', 'Navideñas'];

function App() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredFigures = MOCK_FIGURES.filter(figure => {
    if (activeCategory === 'Todos') return true;
    if (activeCategory === 'Nuevos') return figure.badge === 'novedad';
    return figure.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-abu-light flex flex-col font-sans">
      <Navbar />
      
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

        {/* Burbujas de Categorías (Estilo Instagram Stories) */}
        <div className="mb-8">
          <div className="flex overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 hide-scrollbar snap-x">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start flex flex-col items-center gap-2 min-w-[72px] transition-transform active:scale-95 ${activeCategory === cat ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl shadow-sm border-2 ${activeCategory === cat ? 'border-abu-accent bg-abu-cream' : 'border-gray-200 bg-white'}`}>
                  {/* Iconos divertidos según la categoría */}
                  {cat === 'Todos' && '🧸'}
                  {cat === 'Nuevos' && '✨'}
                  {cat === 'Combos' && '🎁'}
                  {cat === 'Ositos' && '🐻'}
                  {cat === 'Animalitos' && '🦒'}
                  {cat === 'Macetas' && '🪴'}
                  {cat === 'Navideñas' && '🎄'}
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

      <footer className="bg-abu-brown text-abu-cream py-8 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full opacity-80 mix-blend-screen" />
          <p className="font-medium text-base">AbuOso Artesanías</p>
          <p className="text-xs opacity-80">© {new Date().getFullYear()} - Hecho con amor.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
