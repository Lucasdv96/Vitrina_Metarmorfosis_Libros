# Metamorfosis — Librería Online

Sitio vitrina para **Metamorfosis**, una librería de libros usados que vende de forma local en Mar del Plata vía Instagram ([@libros.metamorfosis](https://www.instagram.com/libros.metamorfosis/)). El sitio muestra el catálogo real, permite buscar y filtrar, y deriva la compra a WhatsApp/Instagram — no tiene carrito ni pago online.

Proyecto freelance sin costo para la dueña, y pieza de portfolio de [Lucas del Valle](https://lucasdv-developer.vercel.app).

## Qué incluye

- Catálogo con búsqueda por título/autor, filtros (estado, género, precio) y orden.
- Toggle para mostrar/ocultar libros vendidos (ocultos por defecto).
- Sección "Sobre mí" y contacto directo por WhatsApp e Instagram.
- Identidad de marca propia: paleta, tipografías (Fraunces + Literata) y patrón de guarda.

**No incluye** (fuera de alcance a propósito): carrito, checkout, pasarela de pago, panel de admin con login, base de datos paga.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- CSS plano (sin framework de UI) con variables de diseño propias
- [pnpm](https://pnpm.io/) como gestor de paquetes
- Deploy gratuito en [Vercel](https://vercel.com/)

## Fuente de datos

El catálogo se arma a partir de una planilla que edita la dueña (hoy en migración a Google Sheets publicada como CSV). Mientras esa publicación no esté lista, el sitio usa un snapshot local de los libros reales como fuente de datos (`web/app/lib/raw-books-data.ts`), leído a través del mismo parser tolerante que después va a leer el CSV en vivo — el cambio a datos en vivo es de una sola línea en `web/app/lib/books.ts`.

## Estructura del proyecto

```
web/
  app/
    components/     Header, Hero, Sobre, Catalog, Contact, Footer
    lib/             tipos, parser de CSV, snapshot de datos, formateo
    globals.css      estilos y variables de diseño
    page.tsx         composición de la página
  public/            logo, patrón de guarda, favicon
```

## Correr el proyecto localmente

Requiere [Node.js](https://nodejs.org/) 20+ y pnpm (`corepack enable && corepack prepare pnpm@latest --activate`).

```bash
cd web
pnpm install
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Pendientes

- Publicar la planilla real como Google Sheets → CSV y conectar el sitio a esa fuente en vivo.
- Completar la columna "Género" en la planilla real (hoy no existe).
- Texto definitivo de "Sobre mí" (el actual es un placeholder).
- Nombre final del subdominio de producción.
- Portadas reales de los libros vía API pública (a futuro; hoy el catálogo usa tarjetas monocromáticas sin fotos).

## Contacto de la librería

- WhatsApp: [+54 9 2235 47-4644](https://wa.me/5492235474644)
- Instagram: [@libros.metamorfosis](https://www.instagram.com/libros.metamorfosis/)
