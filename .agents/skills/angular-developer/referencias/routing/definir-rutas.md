# Definir rutas

Las rutas son objetos que definen qué componente debe renderizarse para un path de URL específico.

## Configuración básica

Define las rutas en un array `Routes` y provéelas usando `provideRouter` en tu `appConfig`.

```ts
// app.routes.ts
export const routes: Routes = [
  {path: '', component: HomePage},
  {path: 'admin', component: AdminPage},
];

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

## Paths de URL

- **Estáticos**: Coinciden con un string exacto (p. ej., `'admin'`).
- **Parámetros de ruta**: Segmentos dinámicos con el prefijo de dos puntos (p. ej., `'user/:id'`).
- **Wildcard**: Coincide con cualquier URL usando `**`. Útil para páginas de "Not Found". **Colócalo siempre al final del array.**

## Estrategia de coincidencia

Angular usa una estrategia de **gana la primera coincidencia**. Las rutas específicas deben ir antes que las menos específicas.

## Redirecciones

Usa `redirectTo` para apuntar un path hacia otro.

```ts
{ path: 'articles', redirectTo: '/blog' },
{ path: 'blog', component: Blog },
```

### Redirecciones condicionales

Pasa una función a `redirectTo` para aplicar lógica al redirigir.

```ts
{
  path: 'restaurant/:location/menu',
  redirectTo: ({ params }) => {
    const base = `/restaurant/${params['location']}/menu`;
    const hour = new Date().getHours();

    if (hour < 11) return `${base}/breakfast`;
    if (hour < 17) return `${base}/lunch`;
    return `${base}/dinner`;
  },
},
```

## Títulos de página

Asocia títulos a las rutas para la accesibilidad. Los títulos pueden ser estáticos o dinámicos (mediante `ResolveFn` o un `TitleStrategy` personalizado).

```ts
{ path: 'home', component: Home, title: 'Home Page' }
```

## Datos y providers de ruta

- **Datos estáticos**: Adjunta metadata usando la propiedad `data`.
- **Providers de ruta**: Limita el alcance de las dependencias a una ruta específica y a sus hijas usando el array `providers`.

## Rutas anidadas (hijas)

Define sub-vistas usando la propiedad `children`. Los componentes padre deben incluir un `<router-outlet />`.

```ts
{
  path: 'product/:id',
  component: Product,
  children: [
    { path: 'info', component: ProductInfo },
    { path: 'reviews', component: ProductReviews },
  ],
}
```
