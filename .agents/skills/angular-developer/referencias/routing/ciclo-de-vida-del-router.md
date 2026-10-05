# Ciclo de vida y eventos del router

Angular Router emite eventos a través del observable `Router.events`, lo que te permite rastrear el ciclo de vida de la navegación de principio a fin.

## Eventos comunes del router (en orden cronológico)

1. **`NavigationStart`**: La navegación comienza.
2. **`RoutesRecognized`**: El router hace coincidir la URL con una ruta.
3. **`GuardsCheckStart` / `End`**: Evaluación de `canActivate`, `canMatch`, etc.
4. **`ResolveStart` / `End`**: Fase de resolución de datos (obtención de datos mediante resolvers).
5. **`NavigationEnd`**: La navegación se completó con éxito.
6. **`NavigationCancel`**: La navegación se canceló (p. ej., un guard devolvió `false`).
7. **`NavigationError`**: La navegación falló (p. ej., un error en un resolver).

## Suscripción a los eventos

Inyecta el `Router` y filtra el observable `events`.

```ts
import {Router, NavigationStart, NavigationEnd} from '@angular/router';

export class MyService {
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((event) => {
      console.log('Navigated to:', event.url);
    });
  }
}
```

## Depuración

Habilita el logging detallado en consola de todos los eventos de routing durante el bootstrap de la aplicación.

```ts
provideRouter(routes, withDebugTracing());
```

## Casos de uso comunes

- **Indicadores de carga**: Muestra un spinner cuando se dispara `NavigationStart` y ocúltalo en `NavigationEnd`/`Cancel`/`Error`.
- **Analíticas**: Rastrea las vistas de página escuchando `NavigationEnd`.
- **Gestión del scroll**: Responde a los eventos `Scroll` para un comportamiento de scroll personalizado.
