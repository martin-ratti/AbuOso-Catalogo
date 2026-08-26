import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Figure } from '../types';
import { MOCK_FIGURES } from '../data/mock';
import { ArrowLeft, ShoppingCart, Loader2, Share2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { handleShare } from '../utils/shareUtils';
import { createSlug } from '../utils/slug';

export function ProductDetail() {
  const { id: slugId } = useParams();
  
  // Extraemos el ID real del final del slug (ej: osito-dormilon-8yFvK...)
  const id = slugId ? slugId.split('-').pop() : undefined;

  const [figure, setFigure] = useState<Figure | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchFigure = async () => {
      if (!id) return;
      
      // Check in mock data first
      const mockFigure = MOCK_FIGURES.find(f => f.id === id);
      if (mockFigure) {
        setFigure(mockFigure);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'figures', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFigure({ id: docSnap.id, ...docSnap.data() } as Figure);
        }
      } catch (error) {
        console.error('Error fetching figure:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFigure();
  }, [id]);

  useEffect(() => {
    if (figure) {
      document.title = `${figure.name} | AbuOso Artesanías`;
      
      const productSlug = createSlug(figure.name, figure.id);
      const canonicalUrl = `${window.location.origin}/producto/${productSlug}`;

      // Intentar actualizar meta tags (OG)
      const setMetaTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      setMetaTag('og:title', `${figure.name} - AbuOso Artesanías`);
      setMetaTag('og:description', figure.description || 'Figuras de yeso artesanales.');
      setMetaTag('og:image', figure.imageUrl || '');
      setMetaTag('og:url', canonicalUrl);
      setMetaTag('og:type', 'product');

      return () => {
        document.title = 'AbuOso Artesanías';
      };
    }
  }, [figure]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 size={40} className="animate-spin text-abu-accent" />
      </div>
    );
  }

  if (!figure) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-abu-brown mb-4">Figura no encontrada</h2>
        <Link to="/" className="text-abu-accent hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>
    );
  }

  const whatsappNumber = "3464441120";
  const message = `¡Hola! Vengo del catálogo. Me interesa la figura '${figure.name}' ($${figure.price}). ¿Tienen stock?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const productSlug = createSlug(figure.name, figure.id);
  const canonicalUrl = `${window.location.origin}/producto/${productSlug}`;

  const onShare = () => {
    handleShare({
      title: `AbuOso Artesanías - ${figure.name}`,
      text: `¡Mirá esta figura: ${figure.name} a solo $${figure.price}!`,
      url: canonicalUrl
    });
  };

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 sm:py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-abu-brown hover:text-abu-accent mb-6 transition-colors">
        <ArrowLeft size={20} /> Volver
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-abu-cream overflow-hidden flex flex-col md:flex-row relative">
        {/* Imagen del producto */}
        <div className="w-full md:w-1/2 bg-abu-cream/30 aspect-square md:aspect-auto">
          <img 
            src={figure.imageUrl} 
            alt={figure.name} 
            className="w-full h-full object-cover mix-blend-multiply" 
          />
        </div>

        {/* Detalles */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col relative">
          
          <button 
            onClick={onShare}
            className="absolute top-6 right-6 p-2 bg-abu-light text-gray-500 hover:text-abu-accent hover:bg-abu-cream rounded-full transition-colors"
            title="Compartir producto"
          >
            <Share2 size={20} />
          </button>

          {figure.badge && (
            <span className="inline-block bg-abu-cream text-abu-accent font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide w-fit mb-4">
              {figure.badge}
            </span>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold text-abu-brown mb-2 pr-10">{figure.name}</h1>
          <p className="text-2xl font-bold text-abu-accent mb-6">${figure.price}</p>
          
          <div className="prose prose-sm text-gray-600 mb-8 flex-1">
            <h3 className="text-lg font-bold text-abu-dark mb-2">Descripción del producto</h3>
            <p>{figure.description}</p>
            <p className="mt-4">
              Todas nuestras figuras están hechas artesanalmente con yeso de alta calidad. 
              Pueden presentar pequeñas variaciones que las hacen únicas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <button 
              disabled={figure.badge === 'agotado'}
              onClick={() => {
                addItem(figure);
                useToastStore.getState().addToast(`¡${figure.name} agregado al carrito!`, 'success');
              }}
              className="flex-1 bg-abu-light hover:bg-abu-cream text-abu-brown border border-abu-cream font-bold py-3 rounded-xl transition-colors active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </button>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3 rounded-xl transition-colors active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
