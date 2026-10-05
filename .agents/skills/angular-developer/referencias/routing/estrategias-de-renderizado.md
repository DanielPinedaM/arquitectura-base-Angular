# Estrategias de renderizado

Angular soporta múltiples estrategias de renderizado para optimizar el SEO, el rendimiento y la interactividad.

## 1. Client-Side Rendering (CSR)

**Estrategia por defecto.** El contenido se renderiza completamente en el navegador.

- **Caso de uso**: Dashboards interactivos, herramientas internas.
- **Ventajas**: Lo más simple de configurar, bajo costo de servidor.
- **Desventajas**: SEO deficiente, visibilidad inicial del contenido más lenta (debe esperar al JS).

## 2. Static Site Generation (SSG / Prerendering)

El contenido se pre-renderiza en archivos HTML estáticos en **tiempo de build**.

- **Caso de uso**: Páginas de marketing, blogs, documentación.
- **Ventajas**: La carga inicial más rápida, excelente SEO, compatible con CDN.
- **Desventajas**: Requiere volver a hacer build para actualizar el contenido, no sirve para datos específicos del usuario.

## 3. Server-Side Rendering (SSR)

El contenido se renderiza en el servidor para la **petición inicial**. Las navegaciones posteriores ocurren del lado del cliente (estilo SPA).

- **Caso de uso**: Páginas de productos de e-commerce, sitios de noticias, contenido dinámico personalizado.
- **Ventajas**: Excelente SEO, visibilidad inicial del contenido rápida.
- **Desventajas**: Requiere un servidor (Node.js), mayor costo/latencia de servidor.

## Hydration

La hydration es el proceso de hacer interactivo en el navegador el HTML renderizado en el servidor.

- **Full Hydration**: Toda la aplicación se vuelve interactiva de una sola vez.
- **Incremental Hydration**: (Avanzado) Las partes se vuelven interactivas según se necesite usando bloques `@defer`.
- **Event Replay**: Captura y reproduce los eventos del usuario que ocurrieron antes de que terminara la hydration.

## Matriz de decisión

| Requisito                         | Estrategia                |
| :-------------------------------- | :------------------------ |
| **SEO + contenido estático**      | SSG                       |
| **SEO + contenido dinámico**      | SSR                       |
| **Sin SEO + alta interactividad** | CSR                       |
| **Mixto**                         | Híbrido (basado en rutas) |
