# 🧸 AbuOso Artesanías - Catálogo Web

Un catálogo web moderno, rápido y adaptado para dispositivos móviles, diseñado específicamente para **AbuOso Artesanías** (un emprendimiento de figuras de yeso). Permite a los clientes explorar los productos, agregarlos al carrito y enviar el pedido directamente por WhatsApp.

## 🚀 Tecnologías Utilizadas

* **React 19** con **TypeScript**: Para una interfaz rápida y código tipado.
* **Vite**: Como empaquetador ultrarrápido.
* **Tailwind CSS v4**: Para un diseño moderno, responsivo y fácil de mantener utilizando los colores de la marca.
* **Zustand**: Para el manejo global del estado del Carrito de Compras.
* **React Router v7**: Para la navegación entre el inicio y el detalle de cada figura.
* **Lucide React**: Librería de iconos minimalistas.
* **Firebase** (Firestore, Storage, Hosting): Preparado para leer datos reales desde la base de datos y publicar la web en internet.

## 🎨 Características Principales

* **Grilla Responsiva:** Se adapta automáticamente al tamaño de la pantalla (desde 2 columnas en móviles hasta 6 en monitores grandes).
* **Burbujas de Categorías:** Filtros rápidos estilo "Historias de Instagram" para facilitar la navegación.
* **Etiquetas de Estado (Badges):** Indicadores visuales automáticos (*En Stock, A pedido, Agotado, Novedad*).
* **Carrito y WhatsApp:** Sistema híbrido donde el cliente arma su carrito y envía la orden consolidada directo al WhatsApp del emprendimiento.
* **Páginas de Detalle:** Cada producto tiene su propia URL para compartir fácilmente en redes sociales.

## 🛠️ Instalación y Uso Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/martin-ratti/AbuOso-Catalogo.git
   cd AbuOso-Catalogo
   ```

2. **Instalar dependencias (usando pnpm):**
   ```bash
   pnpm install
   ```

3. **Levantar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```
   *La aplicación estará disponible en `http://localhost:5173`*

## 📦 Despliegue (Deploy)

El proyecto está configurado para ser desplegado en **Firebase Hosting**.
Para publicar los últimos cambios en producción, simplemente ejecuta:

```bash
pnpm run build
firebase deploy --only hosting
```

---
*Crear con las manos alimenta el alma. Hecho con ❤️ para AbuOso.*
