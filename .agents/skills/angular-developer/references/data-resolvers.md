# Data Resolvers

Los data resolvers obtienen datos antes de que una ruta se active, asegurando que los componentes tengan los datos necesarios al renderizarse.

## Crear un resolver

Implementa el tipo `ResolveFn`.

```ts
export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id')!;
  return userService.getUser(id);
};
```

## Configurar la ruta

Agrega el resolver bajo la clave `resolve`.

```ts
{
  path: 'user/:id',
  component: UserProfile,
  resolve: {
    user: userResolver
  }
}
```

## Acceder a los datos resueltos

### 1. Mediante `ActivatedRoute` (tradicional)

```ts
private readonly route = inject(ActivatedRoute);
protected readonly data = toSignal(this.route.data);
protected readonly user = computed(() => this.data().user);
```

### 2. Mediante inputs del componente (moderno)

Habilita `withComponentInputBinding()` en `provideRouter` para pasar los datos resueltos directamente a `@Input` o `input()`.

```ts
// app.config.ts
provideRouter(routes, withComponentInputBinding());

// component.ts
user = input.required<User>();
```

## Manejo de errores

La navegación se bloquea si un resolver falla.

- Usa `withNavigationErrorHandler` para el manejo global.
- Usa `catchError` dentro del resolver para devolver un `RedirectCommand` o datos de respaldo.

```ts
return userService
  .get(id)
  .pipe(catchError(() => of(new RedirectCommand(router.parseUrl('/error')))));
```

## Buenas prácticas

- **Mantenlo ligero**: Obtén solo los datos críticos.
- **Proporciona retroalimentación**: Escucha los eventos del router para mostrar una barra de carga global durante la navegación, ya que la UI permanece en la página anterior hasta que el resolver termina.
