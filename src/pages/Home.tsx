import { useState } from 'react';
import { FigureCard } from '../components/FigureCard';
import { FigureCardSkeleton } from '../components/FigureCardSkeleton';
import { useCatalog } from '../hooks/useCatalog';
import { useCategories } from '../hooks/useCategories';
import { ChevronDown, SearchX } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/cloudinary';
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
    <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
      {/* Banner Principal */}
      <div className="bg-gradient-to-br from-abu-light via-abu-cream/30 to-[#f8e1e5]/60 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 mb-6 sm:mb-10 flex flex-col sm:flex-row items-center justify-between border border-abu-cream/60 shadow-sm relative overflow-hidden">
        <div className="z-10 text-center sm:text-left mb-4 sm:mb-0 max-w-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-abu-brown mb-2 sm:mb-4 tracking-tight leading-tight">
            Arte en yeso cerámico hecho a mano
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg hidden sm:block">
            Explora nuestro catálogo de figuras de yeso artesanales. ¡Calidad y detalle en cada pieza!
          </p>
        </div>
        <div className="z-10 relative">
          <div className="w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
            <img src="/logo.jpg" alt="AbuOso Artesanías" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.07] bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-abu-accent via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Categorías */}
      <div className="mb-6 sm:mb-10">
        <h3 className="text-base sm:text-xl font-bold text-abu-brown mb-3 sm:mb-4 flex items-center gap-2">
          Categorías
        </h3>

        {loadingCats ? (
          <div aria-hidden="true" className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 hide-scrollbar">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="flex flex-col items-center justify-center min-w-[72px] sm:min-w-[100px] h-[72px] sm:h-[100px] bg-gray-100 animate-pulse rounded-xl sm:rounded-2xl shrink-0 border border-gray-200 p-3 sm:p-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full mb-1.5 sm:mb-2" />
                <div className="w-12 sm:w-16 h-2.5 sm:h-3 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div role="tablist" aria-label="Filtrar por categoría" className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory">
            {categories.map((cat) => {
              const IconComponent = cat.iconName ? LOCAL_ICON_MAP[cat.iconName] : LOCAL_ICON_MAP['Package'];
              const isActive = activeCategory === cat.name;

              return (
                <button
                  key={cat.name}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Categoría ${cat.name}`}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[100px] p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 snap-center shadow-sm border shrink-0 ${isActive
                    ? 'bg-abu-brown text-white border-abu-brown shadow-md scale-[1.03]'
                    : 'bg-white text-gray-500 hover:bg-abu-light hover:text-abu-brown border-abu-cream/80 active:scale-95'
                    }`}
                >
                  {cat.imageUrl ? (
                    <img src={getOptimizedImageUrl(cat.imageUrl, 80)} alt="" aria-hidden="true" className="w-6 h-6 sm:w-8 sm:h-8 object-cover mb-1.5 sm:mb-2" />
                  ) : (
                    IconComponent && <IconComponent size={22} aria-hidden="true" className="mb-1.5 sm:mb-2 sm:!w-7 sm:!h-7" />
                  )}
                  <span className="text-[11px] sm:text-sm font-bold whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grilla responsiva */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <FigureCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 rounded-2xl border border-red-200 bg-red-50">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors">Reintentar</button>
        </div>
      ) : figures.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5 mb-8">
            {figures.map(figure => (
              <FigureCard key={figure.id} figure={figure} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-4 sm:mt-8 mb-4">
              <button
                onClick={loadMore}
                className="bg-white hover:bg-abu-cream/50 text-abu-brown border-2 border-abu-cream font-bold py-3 px-8 rounded-full transition-all active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <ChevronDown size={18} className="animate-bounce" />
                Ver más figuras
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-abu-cream">
          <div className="flex justify-center mb-5 text-abu-cream/80">
            <SearchX size={56} strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 font-medium">No hay figuras que coincidan con tu búsqueda.</p>
          <button 
            onClick={() => setActiveCategory('Todos')}
            className="mt-4 text-abu-accent hover:text-abu-brown font-bold text-sm transition-colors"
          >
            Ver todas las figuras
          </button>
        </div>
      )}
    </main>
  );
}
