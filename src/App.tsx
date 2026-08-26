import { Navbar } from './components/Navbar';
import { FigureCard } from './components/FigureCard';
import type { Figure } from './types';

// Datos de prueba temporales hasta que leamos de Firebase
const MOCK_FIGURES: Figure[] = [
  {
    id: '1',
    name: 'Osito Pintor',
    description: 'Figura de yeso de osito con pincel. Ideal para que los más chicos se diviertan pintando.',
    price: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1559441113-d47660232414?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    name: 'Casita Decorativa',
    description: 'Casita detallada para adornar espacios infantiles o armar pequeñas villas navideñas.',
    price: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    name: 'Conejito Tierno',
    description: 'Figura de conejo sentado. Perfecta para decoración de pascua o regalo de nacimiento.',
    price: 1300,
    imageUrl: 'https://images.unsplash.com/photo-1584852332675-523277717643?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    name: 'Jirafa Bebé',
    description: 'Adorno de yeso con forma de jirafa. Lista para ser pintada con los colores que más te gusten.',
    price: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1540306126607-bb9d57a2dfec?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '5',
    name: 'Perrito Sentado',
    description: 'Tierna figura de perrito para decorar estantes o regalar a los amantes de las mascotas.',
    price: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1584852332675-523277717643?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '6',
    name: 'Maceta Geométrica',
    description: 'Mini maceta de yeso ideal para suculentas pequeñas. Diseño moderno y minimalista.',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '7',
    name: 'Búho Sabio',
    description: 'Figura de búho con textura de plumas muy detallada. Perfecto centro de mesa.',
    price: 1900,
    imageUrl: 'https://images.unsplash.com/photo-1559441113-d47660232414?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '8',
    name: 'Elefantito de la Suerte',
    description: 'Elefante de yeso con la trompa hacia arriba. Clásico adorno para atraer la buena fortuna.',
    price: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1540306126607-bb9d57a2dfec?auto=format&fit=crop&q=80&w=600'
  },
];

function App() {
  return (
    <div className="min-h-screen bg-abu-light flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-abu-cream">
          <img 
            src="/logo.jpg" 
            alt="AbuOso Artesanías" 
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-abu-cream shadow-md"
          />
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-abu-dark mb-3">
              Crear con las manos alimenta el alma
            </h2>
            <p className="text-gray-600 max-w-2xl text-lg">
              Explora nuestra colección de figuras de yeso hechas con amor. 
              Ideales para decorar tus espacios, pintar en familia o regalar un detalle único.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-abu-brown">Catálogo Disponible</h3>
          <span className="text-sm font-medium text-abu-accent bg-abu-cream px-3 py-1 rounded-full">
            {MOCK_FIGURES.length} figuras
          </span>
        </div>

        {/* Grilla responsiva: 2 col en móvil, 3 en tablet, 4/5/6 en escritorio */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {MOCK_FIGURES.map(figure => (
            <FigureCard key={figure.id} figure={figure} />
          ))}
        </div>
      </main>

      <footer className="bg-abu-brown text-abu-cream py-8 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full opacity-80 mix-blend-screen" />
          <p className="font-medium text-lg">AbuOso Artesanías</p>
          <p className="text-sm opacity-80">© {new Date().getFullYear()} - Hecho con amor.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
