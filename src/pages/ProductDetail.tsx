import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Figure, FigureOption } from '../types';
import { ArrowLeft, ShoppingCart, Share2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { handleShare } from '../utils/shareUtils';
import { createSlug } from '../utils/slug';
import { APP_CONFIG } from '../config/constants';
import { formatPrice } from '../utils/format';
import { getOptimizedImageUrl } from '../utils/cloudinary';

export function ProductDetail() {
  const { id: slugId } = useParams();
  
  // Extraemos el ID real del final del slug (ej: osito-dormilon-8yFvK...)
  const id = slugId ? slugId.split('-').pop() : undefined;

  const [figure, setFigure] = useState<Figure | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<FigureOption | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    const fetchFigure = async () => {
      if (!id) return;
      
      try {
        setError(null);
        const docRef = doc(db, 'figures', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Figure;
          setFigure(data);
          
          if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0]);
          } else if (data.imageUrl) {
            setSelectedImage(data.imageUrl);
          } else if (data.options && data.options.length > 0) {
            setSelectedImage(data.options[0].imageUrl);
          }
        } else {
          setError('La figura solicitada no existe.');
        }
      } catch (err) {
        console.error('Error fetching figure:', err);
        setError('Ocurrió un error al cargar la figura.');
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

      // Inyección de JSON-LD Schema.org para indexación rica en Google
      let scriptTag = document.querySelector('script#product-schema');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('id', 'product-schema');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: figure.name,
        image: figure.imageUrl ? [figure.imageUrl] : [],
        description: figure.description || `Figura de yeso ${figure.name}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'ARS',
          price: figure.price,
          availability: figure.badge === 'agotado' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'
        }
      });

      return () => {
        document.title = 'AbuOso Artesanías';
        const schema = document.querySelector('script#product-schema');
        if (schema) schema.remove();
      };
    }
  }, [figure]);

  const badgeConfig: Record<string, { text: string; color: string }> = {
    stock: { text: 'En Stock', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    pedido: { text: 'A pedido', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    agotado: { text: 'Agotado', color: 'bg-gray-100 text-gray-500 border-gray-200' },
    novedad: { text: '¡Novedad!', color: 'bg-rose-100 text-rose-600 border-rose-200' },
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-10 animate-pulse">
        <div className="w-20 h-5 bg-gray-200 rounded-md mb-4 sm:mb-6" />
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-abu-cream overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-gray-200 aspect-square" />
          <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col gap-4">
            <div className="w-20 h-6 bg-gray-200 rounded-full" />
            <div className="w-3/4 h-8 bg-gray-200 rounded-lg" />
            <div className="w-1/3 h-7 bg-gray-200 rounded-lg" />
            <div className="space-y-2 mt-4">
              <div className="w-full h-4 bg-gray-200 rounded-md" />
              <div className="w-full h-4 bg-gray-200 rounded-md" />
              <div className="w-5/6 h-4 bg-gray-200 rounded-md" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !figure) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-12 sm:mt-20">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-abu-brown mb-3">{error || 'Figura no encontrada'}</h2>
        <p className="text-gray-500 mb-8 max-w-md text-sm sm:text-base">Lo sentimos, la figura que estás buscando no existe o hubo un error al cargarla.</p>
        <Link to="/" className="bg-abu-brown text-white hover:bg-abu-dark px-6 py-3 rounded-xl flex items-center gap-2 transition-colors font-bold active:scale-95">
          <ArrowLeft size={18} /> Volver al catálogo
        </Link>
      </div>
    );
  }

  const whatsappNumber = APP_CONFIG.WHATSAPP_NUMBER;
  let optionText = '';
  if (selectedOption) {
    optionText = ` en color/tipo "${selectedOption.name}"`;
  }
  const message = `¡Hola! Vengo del catálogo. Me interesa la figura '${figure.name}'${optionText} ($${formatPrice(figure.price)}). ¿Tienen stock?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const productSlug = createSlug(figure.name, figure.id);
  const canonicalUrl = `${window.location.origin}/producto/${productSlug}`;

  const badgeData = figure.badge ? badgeConfig[figure.badge] : null;

  const onShare = () => {
    handleShare({
      title: `AbuOso Artesanías - ${figure.name}`,
      text: `¡Mirá esta figura: ${figure.name} a solo $${formatPrice(figure.price)}!`,
      url: canonicalUrl
    });
  };

  const allImages = figure.images || (figure.imageUrl ? [figure.imageUrl] : []);

  const effectiveOptions = figure ? [...(figure.options || [])] : [];
  if (figure && !effectiveOptions.some(o => o.name.toLowerCase() === 'personalizada')) {
    effectiveOptions.push({ name: 'Personalizada', imageUrl: figure.imageUrl || '' });
  }

  const productAbsoluteUrl = `https://abuoso-catalogo.web.app/producto/${productSlug}`;
  const metaImageUrl = selectedImage ? getOptimizedImageUrl(selectedImage, 1200) : 'https://abuoso-catalogo.web.app/logo.jpg';
  const metaDescription = figure.description || `Figura de yeso artesanal ${figure.name}. Hecha a mano con calidad y detalle en AbuOso Artesanías.`;

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-10">
      {/* Metadatos SEO y Open Graph dinámicos */}
      <title>{`${figure.name} | AbuOso Artesanías`}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={productAbsoluteUrl} />
      <meta property="og:title" content={`${figure.name} | AbuOso Artesanías`} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImageUrl} />
      <meta property="og:url" content={productAbsoluteUrl} />
      <meta name="twitter:title" content={`${figure.name} | AbuOso Artesanías`} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImageUrl} />

      {/* Datos Estructurados Schema.org para Google (Product) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": figure.name,
          "description": metaDescription,
          "image": metaImageUrl,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "ARS",
            "price": figure.price,
            "availability": figure.badge !== 'agotado' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        })}
      </script>

      <Link to="/" className="inline-flex items-center gap-2 text-abu-brown hover:text-abu-accent mb-4 sm:mb-6 transition-colors font-medium text-sm sm:text-base">
        <ArrowLeft size={18} /> Volver
      </Link>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-abu-cream overflow-hidden flex flex-col md:flex-row relative">
        {/* Galería de imágenes */}
        <div className="w-full md:w-1/2 flex flex-col bg-abu-cream/10">
          <div className="w-full bg-abu-cream/20 aspect-square md:aspect-auto md:flex-1 relative">
            {selectedImage ? (
              <>
                <img 
                  key={selectedImage}
                  src={getOptimizedImageUrl(selectedImage, 900)} 
                  alt={figure.name} 
                  onLoad={() => setImageLoaded(true)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">Sin imagen</div>
            )}
          </div>
          
          {/* Miniaturas de imágenes */}
          {allImages.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-white border-t border-abu-cream">
              {allImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    if (selectedImage !== img) {
                      setImageLoaded(false);
                      setSelectedImage(img);
                    }
                  }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === img ? 'border-abu-accent' : 'border-transparent hover:border-abu-cream'}`}
                >
                  <img src={getOptimizedImageUrl(img, 180)} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalles */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col relative">
          
          <button 
            onClick={onShare}
            aria-label={`Compartir ${figure.name}`}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 text-gray-400 hover:text-abu-accent hover:bg-abu-light rounded-full transition-all active:scale-90"
            title="Compartir producto"
          >
            <Share2 size={20} aria-hidden="true" />
          </button>

          {badgeData && (
            <span className={`inline-flex items-center font-bold px-3 py-1 rounded-full text-xs border w-fit mb-3 sm:mb-4 ${badgeData.color}`}>
              {badgeData.text}
            </span>
          )}
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-abu-brown mb-1.5 sm:mb-2 pr-10 leading-tight">{figure.name}</h1>
          <p className="text-xl sm:text-2xl font-extrabold text-abu-accent mb-4 sm:mb-6">${formatPrice(figure.price)}</p>
          
          {/* Opciones */}
          {effectiveOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Opciones disponibles</h3>
              <div className="flex flex-wrap gap-3">
                {effectiveOptions.map((opt, idx) => {
                  const isSelected = selectedOption?.name === opt.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedOption(opt);
                        if (opt.imageUrl && selectedImage !== opt.imageUrl) {
                          setImageLoaded(false);
                          setSelectedImage(opt.imageUrl);
                        }
                      }}
                      className={`flex items-center gap-2 p-1.5 pr-3 sm:pr-4 rounded-full border-2 transition-all active:scale-95 ${isSelected ? 'border-abu-accent bg-abu-light/30' : 'border-gray-200 hover:border-abu-cream bg-white'}`}
                    >
                      {opt.imageUrl ? (
                        <img src={getOptimizedImageUrl(opt.imageUrl, 100)} alt={opt.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm bg-abu-cream/30" />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200" />
                      )}
                      <span className={`text-sm font-medium ${isSelected ? 'text-abu-accent' : 'text-gray-600'}`}>
                        {opt.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-gray-600 mb-6 flex-1 text-sm sm:text-base">
            <h3 className="text-base sm:text-lg font-bold text-abu-dark mb-2">Descripción</h3>
            <p className="leading-relaxed">{figure.description}</p>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 italic">
              Todas nuestras figuras están hechas artesanalmente con yeso de alta calidad. 
              Pueden presentar pequeñas variaciones que las hacen únicas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-auto">
            <button 
              disabled={figure.badge === 'agotado' || !selectedOption}
              onClick={() => {
                const itemToAdd = selectedOption ? {
                  ...figure,
                  id: `${figure.id}-${selectedOption.name}`,
                  name: `${figure.name} (${selectedOption.name})`,
                  imageUrl: selectedOption.imageUrl || figure.imageUrl
                } : figure;
                addItem(itemToAdd);
                useToastStore.getState().addToast(`¡${itemToAdd.name} agregado al carrito!`, 'success');
              }}
              className="flex-1 bg-abu-light hover:bg-abu-cream text-abu-brown border border-abu-cream font-bold py-3 sm:py-3.5 rounded-xl transition-all active:scale-[0.98] hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:active:scale-100 disabled:hover:shadow-none text-sm sm:text-base"
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </button>
            <button
              disabled={figure.badge === 'agotado' || !selectedOption}
              onClick={() => window.open(whatsappUrl, '_blank')}
              className="flex-1 bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all active:scale-[0.98] hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-40 disabled:active:scale-100 disabled:hover:shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Pedir por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
