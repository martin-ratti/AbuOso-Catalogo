import { useToastStore } from '../store/toastStore';

interface ShareData {
  title: string;
  text: string;
  url: string;
}

export const handleShare = async (data: ShareData) => {
  const addToast = useToastStore.getState().addToast;

  if (navigator.share) {
    try {
      await navigator.share(data);
      // El navegador maneja el éxito silenciosamente o el usuario puede cancelar
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        // Fallback si falla por algo que no sea que el usuario cerró el modal
        copyToClipboard(data.url, addToast);
      }
    }
  } else {
    // Fallback para navegadores de escritorio que no soportan Web Share API
    copyToClipboard(data.url, addToast);
  }
};

const copyToClipboard = (url: string, addToast: (msg: string, type: 'success' | 'error' | 'info') => void) => {
  navigator.clipboard.writeText(url)
    .then(() => {
      addToast('Enlace copiado al portapapeles', 'success');
    })
    .catch(() => {
      addToast('No se pudo copiar el enlace', 'error');
    });
};
