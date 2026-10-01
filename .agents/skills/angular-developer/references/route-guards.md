# Route Guards

Los route guards controlan si un usuario puede navegar hacia una ruta o salir de ella.

## Tipos de guards

- **`CanActivate`**: ¿Puede el usuario acceder a esta ruta? (p. ej., verificación de autenticación).
- **`CanActivateChild`**: ¿Puede el usuario acceder a las hijas de esta ruta?
- **`CanDeactivate`**: ¿Puede el usuario salir de esta ruta? (p. ej., cambios sin guardar).
- **`CanMatch`**: ¿Debería siquiera considerarse esta ruta para la coincidencia? (p. ej., feature flags). Si devuelve `false`, el router sigue verificando otras rutas.

## Crear un guard

Los guards son típicamente funcionales desde Angular 15.

```ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirige al login
  return router.parseUrl('/login');
};
```

## Aplicar guards

Agrégalos a la configuración de la ruta como un array. Se ejecutan en orden.

```ts
{
  path: 'admin',
  component: Admin,
  canActivate: [authGuard],
  canActivateChild: [adminChildGuard],
  canDeactivate: [unsavedChangesGuard]
}
```

## Valores de retorno

- `boolean`: `true` para permitir, `false` para bloquear.
- `UrlTree` o `RedirectCommand`: Redirige a una ruta diferente.
- `Observable` o `Promise`: Se resuelve en los tipos anteriores.

## Nota de seguridad

**Los guards del lado del cliente NO sustituyen a la seguridad del lado del servidor.** Verifica siempre los permisos en el servidor.
