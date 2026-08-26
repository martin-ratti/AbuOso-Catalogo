# 🧸 AbuOso Artesanías - Catálogo Web

Un catálogo web moderno, rápido y adaptado para dispositivos móviles, diseñado específicamente para **AbuOso Artesanías** (un emprendimiento de figuras de yeso). Permite a los clientes explorar los productos, agregarlos al carrito y enviar el pedido directamente por WhatsApp, además de contar con un panel de administración completo para gestionar el inventario y las categorías.

## 🚀 Tecnologías Utilizadas

* **React 19** con **TypeScript 6**: Interfaz reactiva ultrarrápida y código fuertemente tipado.
* **Vite 8**: Empaquetador y entorno de desarrollo de nueva generación.
* **Tailwind CSS v4**: Diseño moderno, responsivo y fluido utilizando utilidades CSS y los colores de la marca.
* **Zustand 5**: Manejo global y liviano del estado (Carrito de Compras, Catálogo, Autenticación, Búsqueda, Notificaciones).
* **React Router v7**: Navegación dinámica (SPA) entre el inicio, detalles de producto y el panel de administración protegido.
* **Lucide React**: Iconos minimalistas e integrados.
* **Oxlint**: Linter de código ultrarrápido basado en Rust.
* **Firebase v12**: 
  * *Firestore*: Base de datos NoSQL para productos y categorías.
  * *Storage*: Almacenamiento optimizado de las imágenes de los productos.
  * *Auth*: Autenticación segura para proteger el panel de administración.
  * *Hosting*: Despliegue global rápido y seguro de la aplicación.

## 🎨 Características Principales

### Para los Clientes (Catálogo Público)
* **Grilla Responsiva:** Diseño fluido que se adapta al tamaño de pantalla (2 columnas en móviles, hasta 6 en monitores).
* **Búsqueda Avanzada y Autocompletado:** Buscador integrado con dropdown de sugerencias en tiempo real.
* **Filtros por Categorías:** Navegación rápida estilo "Historias de Instagram" con iconos representativos.
* **Etiquetas de Estado (Badges):** Indicadores visuales como *En Stock, A pedido, Agotado, Novedad*.
* **Formato de Precios Localizado:** Los precios se formatean automáticamente (ej: `$20.000`), mejorando la UX y lectura.
* **Carrito y WhatsApp:** El cliente arma su pedido, calcula el total estimado y envía la orden detallada con un clic directo al WhatsApp del emprendimiento.
* **Detalle y Compartir (Share API):** Cada producto tiene una URL única para SEO y permite compartir enlaces directamente con la API nativa de celulares.

### Para el Emprendimiento (Panel de Administración)
* **Dashboard Privado (`/admin`):** Acceso restringido por inicio de sesión (Firebase Auth).
* **Gestión de Productos (CRUD):** Creación, edición, listado y eliminación de figuras, permitiendo cargar imágenes y precios.
* **Gestión de Categorías:** Definición de secciones personalizadas con asignación de íconos de sistema para catalogar los productos.
* **Feedback Visual Mejorado:** Notificaciones flotantes (Toasts), botones con microinteracciones y modales de confirmación de borrado.

## 🛠️ Instalación y Uso Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/martin-ratti/AbuOso-Catalogo.git
   cd AbuOso-Catalogo
   ```

2. **Instalar dependencias (se requiere pnpm):**
   ```bash
   pnpm install
   ```

3. **Levantar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```
   *La aplicación estará disponible en `http://localhost:5173`*

## 📦 Verificación de Código (Linter)

El proyecto utiliza Oxlint. Para revisar errores de sintaxis y buenas prácticas, ejecuta:
```bash
pnpm run lint
```

## 🚀 Despliegue (Deploy)

El proyecto está preparado para desplegarse fácilmente en **Firebase Hosting**.
Para compilar y publicar en producción:

```bash
pnpm run build
firebase deploy --only hosting
```

---
*Crear con las manos alimenta el alma. Hecho con ❤️ para AbuOso.*
