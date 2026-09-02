# Metamorfosis — Librería Online

Contexto de proyecto para Claude Code. Leé esto completo antes de tocar cualquier archivo.

## Regla de trabajo (no negociable)
No hagas ningún cambio de código, ni crees o edites archivos de implementación, sin que Lucas lo autorice explícitamente paso a paso. Explicá qué vas a hacer y esperá el OK antes de actuar. Esto aplica a todo el proyecto, de principio a fin, no solo al arranque.

## Qué es esto
Sitio web vitrina para Metamorfosis, una librería de libros usados que hoy vende de forma local en Mar del Plata vía Instagram (@libros.metamorfosis). El sitio muestra su catálogo real, permite buscar y filtrar, y deriva la compra a WhatsApp/Instagram — no tiene carrito ni pago online. Es un proyecto freelance sin costo para la dueña, y también pieza de portfolio de Lucas del Valle (lucasdv-developer.vercel.app).

## Alcance
**Sí incluye:** vitrina de catálogo, búsqueda, filtros (precio / estado / género), orden, toggle "mostrar vendidos", contacto por WhatsApp/Instagram, sección Sobre mí, home con identidad de marca.
**No incluye:** carrito, checkout, pasarela de pago, panel de admin con login, base de datos paga, dominio pago.

## Stack y costos
- 100% gratuito: sin dominio propio (subdominio tipo `metamorfosis.vercel.app`, nombre exacto a definir), sin backend pago.
- Sitio estático — pensado en Next.js + Vercel (gratis), a confirmar con Lucas antes de fijarlo.
- Fuente de datos: la dueña edita una planilla (hoy Excel, pensada para migrar a Google Sheets publicada); el sitio la lee, ella nunca toca código.
- Portadas: sin fotos propias. Resolver por título/autor contra una API pública de libros; si no hay resultado, usar una imagen de repuesto genérica.

## Modelo de datos (planilla)
Columnas: `Libro`, `Autor`, `Estado` (Usado / Nuevo — hoy todo es "Usado" pero a futuro va a sumar libros nuevos), `Precio` (formato `$X.XXX,00`), `Stock` (Disponible / Vendido), `Género` (columna nueva a agregar — no existe todavía en la planilla real, la dueña la tiene que completar).

Reglas:
- Un libro "Vendido" se oculta del catálogo por defecto; hay un toggle para verlo igual.
- Dataset real: 66 libros cargados actualmente (usado también en el mockup de diseño, ver abajo).

## Identidad de marca (ya definida — no inventar una nueva)
- **Logo:** bichito con anteojos leyendo, "METAMORFOSIS — LIBRERIA ONLINE" en arco. Ya existe una versión con el fondo removido (PNG transparente), generada durante el mockup.
- **Patrón de marca:** cuadriculado ondulado, pedido explícitamente por la dueña como elemento de fondo. Usar con moderación: funciona bien como franja tipo "guarda de libro" arriba/abajo de las secciones. Evitar ponerlo detrás de texto o del logo directamente — pierde contraste y se ve sucio (ya lo probamos y falló en la primera iteración del mockup).
- **Paleta** (extraída de los assets reales, no inventar otros colores):
  - `--paper: #ECDAC4` (crema, fondo principal)
  - `--paper-light: #F6ECDC` (crema claro, tarjetas/paneles)
  - `--ink: #491710` (marrón oscuro, color principal / texto)
  - `--ink-soft: #703D2A` (marrón secundario, acentos)
- **Tipografía:** Fraunces (display/títulos) + Literata (texto/cuerpo), vía Google Fonts.
- **Concepto de layout:** "pasar las páginas de un libro" — franjas del patrón como guardas arriba/abajo, logo en medallón circular sobre fondo liso, catálogo con tarjetas tipo lomo/tapa de libro en tonos monocromáticos de la paleta (sin fotos de portada propias).

## Contenido real
- WhatsApp: +54 9 2235 47-4644 → link `https://wa.me/5492235474644`
- Instagram: [@libros.metamorfosis](https://www.instagram.com/libros.metamorfosis/)
- Entrega: retiro en persona en Mar del Plata + envío a todo el país.
- Texto de "Sobre mí": todavía no existe, hay un placeholder en el mockup — no publicarlo como definitivo.

## Referencia de diseño
`metamorfosis-mockup.html` (sumalo al repo) es un mockup estático ya aprobado en su segunda iteración: header + hero con medallón + Sobre mí + Catálogo funcional (JS vanilla, con los 66 libros reales, búsqueda/filtros/orden/toggle de vendidos ya funcionando) + Contacto + guardas de patrón. Es la referencia visual y de interacción a seguir — no es la arquitectura final (datos hardcodeados, sin conexión real a la planilla ni a una API de portadas), pero el sistema de diseño y el comportamiento del catálogo ya están validados con Lucas.

## Pendientes / decisiones abiertas
- Nombre final del subdominio.
- Texto real de "Sobre mí" (lo tiene que mandar la dueña).
- Migración de la planilla a Google Sheets publicada, o mecanismo alternativo.
- La dueña todavía tiene que completar la columna Género en los 66 libros existentes.

## Próximo paso sugerido (confirmar con Lucas antes de arrancar cualquiera)
1. Definir stack final y estructura del repo.
2. Resolver la fuente de datos (Google Sheets publicada + forma de leerla).
3. Portar el diseño del mockup a componentes reales, conectados a datos reales.
4. Recién ahí, con aprobación explícita paso a paso, tocar código de producción.
