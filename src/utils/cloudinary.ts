const CLOUD_NAME = 'dh23yepxy';
const UPLOAD_PRESET = 'abuoso_unsigned';

export async function uploadToCloudinary(file: File): Promise<string> {
  // Comprimir la imagen antes de subir
  const compressedBlob = await compressImage(file);
  
  const formData = new FormData();
  formData.append('file', compressedBlob);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'abuoso-catalogo');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Error al subir imagen a Cloudinary');
  }

  const data = await res.json();
  return data.secure_url;
}

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Error al comprimir imagen'));
          },
          'image/webp',
          0.75
        );
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
