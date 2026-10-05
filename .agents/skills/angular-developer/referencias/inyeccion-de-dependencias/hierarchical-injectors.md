# Hierarchical Injectors

El sistema de inyección de dependencias de Angular es jerárquico, lo que significa que el alcance de los servicios puede limitarse a diferentes niveles de la aplicación.

## Tipos de jerarquías de injectors

1. **Jerarquía de `EnvironmentInjector`**: Se configura mediante `@Service()`, `@Injectable({ providedIn: 'root' })` o `ApplicationConfig.providers` durante el bootstrap. Son singletons globales.
2. **Jerarquía de `ElementInjector`**: Se crea implícitamente en cada elemento del DOM. Se configura mediante el array `providers` o `viewProviders` en `@Component()` o `@Directive()`.

## Reglas de resolución

Cuando se solicita una dependencia, Angular la resuelve en dos fases:

1. Busca hacia arriba en el árbol de **`ElementInjector`**, empezando desde el componente/directiva que la solicita hasta el elemento raíz.
2. Si no la encuentra, busca en el árbol de **`EnvironmentInjector`**, empezando desde el environment injector más cercano hasta la raíz.
3. Si aún no la encuentra, lanza un error (a menos que esté marcada como opcional).

## Modificadores de resolución

Puedes alterar cómo Angular busca una dependencia usando el objeto de opciones en `inject()`:

- **`optional`**: Si no se encuentra la dependencia, devuelve `null` en lugar de lanzar un error.
- **`self`**: Solo verifica el `ElementInjector` actual. No busca hacia arriba en el árbol padre.
- **`skipSelf`**: Empieza a buscar en el `ElementInjector` padre, omitiendo el elemento actual.
- **`host`**: Deja de buscar al alcanzar el límite de la vista del componente host.

```ts
@Component({...})
export class Example {
  // Devuelve null si no se encuentra, en lugar de fallar
  optionalService = inject(MyService, { optional: true });

  // Omite los providers de este componente, busca en el padre
  parentService = inject(ParentService, { skipSelf: true });
}
```

## `providers` vs `viewProviders`

Al proveer un servicio a nivel de componente:

- **`providers`**: El servicio está disponible para el componente, su vista (template) y cualquier **contenido proyectado** (`<ng-content>`).
- **`viewProviders`**: El servicio está disponible para el componente y su vista, pero **NO** para el contenido proyectado. Úsalo para aislar servicios del contenido que pasan los consumidores.
