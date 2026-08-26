import { useState } from 'react';
import { FigureCard } from '../components/FigureCard';
import { FigureCardSkeleton } from '../components/FigureCardSkeleton';
import { useCatalog } from '../hooks/useCatalog';
import { useCategories } from '../hooks/useCategories';
import { 
  Smile, PawPrint, TreePine, Sprout, Package, Sparkles, Star, Heart, Gift, Moon, Sun, Flower, Palette, Brush, Wand2, LayoutGrid,
  Dog, Cat, Rabbit, Bird, Fish, Bug, Leaf, 
  Apple, Carrot, Cake, Coffee,
  Car, Plane, Rocket, Music, Guitar,
  Gamepad, Trophy, Crown, Diamond,
  Book, Camera, Home as HomeIcon, Zap, Flame, Snowflake, Cloud,
  Church, Cross, Droplet, Waves, HandHeart,
  Baby, Footprints, PiggyBank, Coins, Feather, Hexagon, Circle, Box, Lamp, Eye, Ghost, Shell, Bone, Anchor, Bell
} from 'lucide-react';

const LOCAL_ICON_MAP: Record<string, React.ElementType> = {
  LayoutGrid, Sparkles, Package, Smile, PawPrint, TreePine, Sprout, Star, Heart, Gift, Moon, Sun, Flower, Palette, Brush, Wand2,
  Dog, Cat, Rabbit, Bird, Fish, Bug, Leaf, 
  Apple, Carrot, Cake, Coffee,
  Car, Plane, Rocket, Music, Guitar,
  Gamepad, Trophy, Crown, Diamond,
  Book, Camera, HomeIcon, Zap, Flame, Snowflake, Cloud,
  Church, Cross, Droplet, Waves, HandHeart,
  Baby, Footprints, PiggyBank, Coins, Feather, Hexagon, Circle, Box, Lamp, Eye, Ghost, Shell, Bone, Anchor, Bell
};

export function Home() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  
  // Custom hooks
  const { categories, loadingCats } = useCategories();
  const { figures, loading, hasMore, error, loadMore } = useCatalog(activeCategory);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-abu-light to-[#f8e1e5] rounded-3xl p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-center justify-between border border-abu-cream shadow-sm relative overflow-hidden">
        <div className="z-10 text-center md:text-left mb-6 md:mb-0 max-w-xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-abu-brown mb-4 tracking-tight leading-tight">
            Encuentra la figura perfecta para pintar
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Explora nuestro catálogo de figuras de yeso artesanales. ¡Calidad y detalle en cada pieza!
          </p>
        </div>
        <div className="z-10 relative">
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0">
            <img src="/logo.jpg" alt="Osito de yeso" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-abu-accent text-white font-bold px-4 py-2 rounded-2xl shadow-lg transform rotate-12 text-sm sm:text-base">
            ¡Hecho a mano!
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-abu-accent via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Categorías */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-abu-brown mb-4 flex items-center gap-2">
          Categorías Populares
        </h3>
        
        {loadingCats ? (
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="flex flex-col items-center justify-center min-w-[100px] h-[100px] bg-gray-100 animate-pulse rounded-2xl flex-shrink-0 border border-gray-200 p-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
                <div className="w-16 h-3 bg-gray-200 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {categories.map((cat) => {
              const IconComponent = cat.iconName ? LOCAL_ICON_MAP[cat.iconName] : LOCAL_ICON_MAP['Package'];
              
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex flex-col items-center justify-center min-w-[100px] p-4 rounded-2xl transition-all snap-center shadow-sm border ${
                    activeCategory === cat.name 
                      ? 'bg-abu-brown text-white border-abu-brown scale-105' 
                      : 'bg-white text-gray-600 hover:bg-abu-light border-abu-cream'
                  }`}
                >
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-8 h-8 object-cover mb-2" />
                  ) : (
                    IconComponent && <IconComponent size={28} className="mb-2" />
                  )}
                  <span className="text-sm font-bold whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grilla responsiva */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <FigureCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-red-200 bg-red-50">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors">Reintentar</button>
        </div>
      ) : figures.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mb-8">
            {figures.map(figure => (
              <FigureCard key={figure.id} figure={figure} />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={loadMore}
                className="bg-white hover:bg-abu-light text-abu-brown border-2 border-abu-cream font-bold py-3 px-8 rounded-full transition-all active:scale-95 flex items-center gap-2 shadow-sm"
              >
                Ver más figuras
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-abu-cream">
          <p className="text-gray-500">No hay figuras que coincidan con tu búsqueda por el momento.</p>
        </div>
      )}
    </main>
  );
}
