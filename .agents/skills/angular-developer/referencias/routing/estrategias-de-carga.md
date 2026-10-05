# Estrategias de carga de rutas

Angular soporta dos estrategias principales para cargar rutas y componentes, con el fin de equilibrar el tiempo de carga inicial y la capacidad de respuesta de la navegación.

## Eager Loading

Los componentes se empaquetan en el payload inicial de JavaScript y están disponibles de inmediato.

```ts
{ path: 'home', component: Home }
```

- **Ventajas**: Transiciones fluidas.
- **Desventajas**: Aumenta el tamaño del bundle inicial.

## Lazy Loading

Los componentes o rutas se cargan solo cuando el usuario navega hacia ellos. Esto crea "chunks" de JavaScript separados.

### Lazy loading de componentes

Usa `loadComponent` para obtener el componente bajo demanda.

```ts
{
  path: 'admin',
  loadComponent: () => import('./admin').then(m => m.Admin),
}
```

### Lazy loading de rutas hijas

Usa `loadChildren` para obtener un conjunto de rutas.

```ts
{
  path: 'settings',
  loadChildren: () => import('./settings/settings.routes'),
}
```

Devuelve directamente la promise de `import()` solo cuando el archivo cargado usa un export `default`.

## Injection Context y lazy loading

Las funciones loader se ejecutan dentro del **injection context** de la ruta actual. Esto te permite llamar a `inject()` para tomar decisiones de carga según el contexto.

```ts
{
  path: 'dashboard',
  loadComponent: () => {
    const flags = inject(FeatureFlags);
    return flags.isPremium
      ? import('./premium-dashboard')
      : import('./basic-dashboard');
  },
}
```

## Recomendación

- Usa **Eager Loading** para las landing pages principales.
- Usa **Lazy Loading** para todas las demás áreas de features, para mantener pequeño el bundle inicial.
