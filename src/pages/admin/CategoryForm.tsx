import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Search,
  Smile, PawPrint, TreePine, Sprout, Package, Sparkles, Star, Heart, Gift, Moon, Sun, Flower, Palette, Brush, Wand2, LayoutGrid,
  Dog, Cat, Rabbit, Bird, Fish, Bug, Leaf, 
  Apple, Carrot, Cake, Coffee,
  Car, Plane, Rocket, Music, Guitar,
  Gamepad, Trophy, Crown, Diamond,
  Book, Camera, Home as HomeIcon, Zap, Flame, Snowflake, Cloud,
  Church, Cross, Droplet, Waves, HandHeart,
  Baby, Footprints, PiggyBank, Coins, Feather, Hexagon, Circle, Box, Lamp, Eye, Ghost, Shell, Bone, Anchor, Bell
} from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const AVAILABLE_ICONS = [
  { name: 'LayoutGrid', component: LayoutGrid, es: 'grilla cuadricula todos catalogo menu' },
  { name: 'Sparkles', component: Sparkles, es: 'brillos estrella magia nuevo novedad' },
  { name: 'Package', component: Package, es: 'paquete caja combo regalo' },
  { name: 'Smile', component: Smile, es: 'sonrisa cara feliz osito' },
  { name: 'PawPrint', component: PawPrint, es: 'huella pata animal perro gato' },
  { name: 'TreePine', component: TreePine, es: 'arbol pino navidad pinocho bosque pinito' },
  { name: 'Sprout', component: Sprout, es: 'planta brote maceta hoja semilla' },
  { name: 'Star', component: Star, es: 'estrella cielo noche' },
  { name: 'Heart', component: Heart, es: 'corazon amor' },
  { name: 'Gift', component: Gift, es: 'regalo sorpresa caja' },
  { name: 'Moon', component: Moon, es: 'luna noche' },
  { name: 'Sun', component: Sun, es: 'sol dia iluminacion' },
  { name: 'Flower', component: Flower, es: 'flor margarita loto buda zen rosa' },
  { name: 'Palette', component: Palette, es: 'paleta pintura arte color' },
  { name: 'Brush', component: Brush, es: 'pincel arte pintar manualidades' },
  { name: 'Wand2', component: Wand2, es: 'varita magia fantasia hada duende' },
  { name: 'Dog', component: Dog, es: 'perro perrito cachorro mascota can' },
  { name: 'Cat', component: Cat, es: 'gato gatito mascota mishi felino' },
  { name: 'Rabbit', component: Rabbit, es: 'conejo mascota pascua' },
  { name: 'Bird', component: Bird, es: 'pajaro ave paloma paz pajarito' },
  { name: 'Fish', component: Fish, es: 'pez pescado agua mar sirena' },
  { name: 'Bug', component: Bug, es: 'bicho insecto mariquita mariposa' },
  { name: 'Leaf', component: Leaf, es: 'hoja naturaleza planta arbol' },
  { name: 'Apple', component: Apple, es: 'manzana fruta comida cocina' },
  { name: 'Carrot', component: Carrot, es: 'zanahoria vegetal comida verduras' },
  { name: 'Cake', component: Cake, es: 'torta pastel cumpleaños dulce' },
  { name: 'Coffee', component: Coffee, es: 'cafe taza bebida desayuno' },
  { name: 'Car', component: Car, es: 'auto coche vehiculo autito' },
  { name: 'Plane', component: Plane, es: 'avion vuelo volar' },
  { name: 'Rocket', component: Rocket, es: 'cohete espacio astronauta luna' },
  { name: 'Music', component: Music, es: 'musica nota cancion melodia' },
  { name: 'Guitar', component: Guitar, es: 'guitarra instrumento musica' },
  { name: 'Gamepad', component: Gamepad, es: 'juego control joystick gamer' },
  { name: 'Trophy', component: Trophy, es: 'trofeo premio ganador copa' },
  { name: 'Crown', component: Crown, es: 'corona rey reina princesa principe' },
  { name: 'Diamond', component: Diamond, es: 'diamante joya rombo gema preciosa' },
  { name: 'Book', component: Book, es: 'libro lectura leer cuento' },
  { name: 'Camera', component: Camera, es: 'camara foto fotografia fotografo' },
  { name: 'HomeIcon', component: HomeIcon, es: 'casa hogar decoracion casita' },
  { name: 'Zap', component: Zap, es: 'rayo energia electricidad flash' },
  { name: 'Flame', component: Flame, es: 'fuego llama vela luz calor espiritu' },
  { name: 'Snowflake', component: Snowflake, es: 'nieve copo frio hielo invierno' },
  { name: 'Cloud', component: Cloud, es: 'nube cielo nublado clima' },
  { name: 'Church', component: Church, es: 'iglesia religion religioso virgen cristo santo santuario templo' },
  { name: 'Cross', component: Cross, es: 'cruz religion religioso jesucristo dios virgen santo' },
  { name: 'Droplet', component: Droplet, es: 'gota agua liquido fuente casacada humedad' },
  { name: 'Waves', component: Waves, es: 'ola olas agua mar fuente rio cascada' },
  { name: 'HandHeart', component: HandHeart, es: 'mano corazon amor paz ayuda buda oracion meditar yoga zen' },
  { name: 'Baby', component: Baby, es: 'bebe nacimiento souvenir infantil nene nena' },
  { name: 'Footprints', component: Footprints, es: 'huellas pie pies bebe nacimiento souvenir paso' },
  { name: 'PiggyBank', component: PiggyBank, es: 'alcancia chanchito cerdo ahorro plata dinero' },
  { name: 'Coins', component: Coins, es: 'monedas dinero plata abundancia riqueza' },
  { name: 'Feather', component: Feather, es: 'pluma atrapasueños ave pajaro indio macrame' },
  { name: 'Hexagon', component: Hexagon, es: 'hexagono bandeja cenicero geometria forma' },
  { name: 'Circle', component: Circle, es: 'circulo bandeja plato redondo cenicero geometria' },
  { name: 'Box', component: Box, es: 'caja joyero cofre cubo cuadrado envase' },
  { name: 'Lamp', component: Lamp, es: 'lampara luz farol fanal vela iluminacion' },
  { name: 'Eye', component: Eye, es: 'ojo turco mirador vista ver mistico proteccion' },
  { name: 'Ghost', component: Ghost, es: 'fantasma halloween miedo asustar' },
  { name: 'Shell', component: Shell, es: 'caracola mar playa sirena concha oceano' },
  { name: 'Bone', component: Bone, es: 'hueso huesito perro mascota animal' },
  { name: 'Anchor', component: Anchor, es: 'ancla mar oceano marinero barco' },
  { name: 'Bell', component: Bell, es: 'campana llamador viento sonido navidad' }
];

export function CategoryForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('LayoutGrid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const addToast = useToastStore(s => s.addToast);
  const navigate = useNavigate();

  // Si estamos editando, traer datos de la categoría
  useEffect(() => {
    if (!isEditing) return;
    const fetchCategory = async () => {
      try {
        const docRef = doc(db, 'categories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setIconName(data.iconName || 'LayoutGrid');
        } else {
          addToast('Categoría no encontrada', 'error');
          navigate('/admin/categories');
        }
      } catch {
        addToast('Error al cargar la categoría', 'error');
      } finally {
        setIsFetching(false);
      }
    };
    fetchCategory();
  }, [id, isEditing, addToast, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return addToast('Escribe un nombre', 'error');

    setIsSubmitting(true);
    try {
      const docData = { 
        name: name.trim(),
        iconName: iconName
      };

      if (isEditing) {
        await updateDoc(doc(db, 'categories', id!), docData);
        addToast('Categoría actualizada exitosamente', 'success');
      } else {
        await addDoc(collection(db, 'categories'), docData);
        addToast('Categoría creada exitosamente', 'success');
      }
      navigate('/admin/categories');
    } catch {
      addToast('Error al guardar categoría', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIcons = AVAILABLE_ICONS.filter(icon => 
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    icon.es.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFetching) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-abu-accent" size={40} /></div>;
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 py-5 sm:py-8 flex flex-col">
      <div className="mb-4 sm:mb-6">
        <button type="button" onClick={() => navigate(-1)} className="text-abu-brown hover:text-abu-accent flex items-center gap-2 font-medium w-fit text-sm sm:text-base">
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-abu-cream p-5 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-abu-brown mb-5 sm:mb-6">
          {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la categoría</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Dinosaurios" 
              className="w-full bg-abu-light border border-abu-cream rounded-xl py-3 sm:py-2.5 px-4 focus:outline-none focus:border-abu-accent text-sm"
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <label className="block text-sm font-bold text-gray-700">Selecciona un icono</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Buscar icono..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-abu-light border border-abu-cream rounded-lg py-2 sm:py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:border-abu-accent w-full sm:w-48"
                />
                <Search size={16} className="absolute left-2.5 top-2.5 sm:top-2 text-gray-400 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 max-h-[40vh] sm:max-h-60 overflow-y-auto p-1 hide-scrollbar">
              {filteredIcons.map(({ name: iName, component: Icon }) => (
                <button
                  key={iName}
                  type="button"
                  onClick={() => setIconName(iName)}
                  title={iName}
                  className={`flex items-center justify-center p-3 sm:p-3 rounded-xl border-2 transition-colors active:scale-95 ${
                    iconName === iName 
                      ? 'border-abu-accent bg-abu-cream text-abu-brown' 
                      : 'border-abu-cream bg-abu-light text-gray-400 hover:text-abu-brown'
                  }`}
                >
                  <Icon strokeWidth={1.5} className="w-7 h-7 sm:w-6 sm:h-6" />
                </button>
              ))}
              {filteredIcons.length === 0 && (
                <div className="col-span-full py-4 text-center text-gray-400 text-sm">
                  No se encontraron iconos
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Guardando...</> : <><Save size={20} /> {isEditing ? 'Guardar Cambios' : 'Guardar Categoría'}</>}
          </button>
        </form>
      </div>
    </main>
  );
}
