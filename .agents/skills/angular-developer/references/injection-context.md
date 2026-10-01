# Injection Context

La función `inject()` solo puede usarse cuando el código se está ejecutando dentro de un **injection context**.

## ¿Dónde está disponible un injection context?

Un injection context está disponible automáticamente en:

1. **Inicializadores de campos** de clases instanciadas por la DI (`@Service`, `@Injectable`, `@Component`, `@Directive`, `@Pipe`).
2. **Constructores** de clases instanciadas por la DI.
3. **Factory functions** especificadas en configuraciones de `useFactory` o de `InjectionToken`.
4. **APIs funcionales** ejecutadas por Angular (p. ej., route guards funcionales, resolvers, interceptors).

```ts
@Component({...})
export class Example {
  // ✅ Válido: inicializador de campo
  private router = inject(Router);

  constructor() {
    // ✅ Válido: constructor
    const http = inject(HttpClient);
  }

  onClick() {
    // ❌ Inválido: no es un injection context
    // const auth = inject(AuthService);
  }
}
```

## `runInInjectionContext`

Si necesitas ejecutar una función dentro de un injection context (a menudo necesario para la creación dinámica de componentes o para testing), usa `runInInjectionContext`. Esto requiere acceso a un injector existente (como `EnvironmentInjector` o `Injector`).

```ts
import {inject, EnvironmentInjector, runInInjectionContext, Service} from '@angular/core';

@Service()
export class MyService {
  private injector = inject(EnvironmentInjector);

  doSomethingDynamic() {
    runInInjectionContext(this.injector, () => {
      // ✅ Ahora es válido usar inject() aquí
      const router = inject(Router);
    });
  }
}
```

## `assertInInjectionContext`

Usa `assertInInjectionContext` en funciones utilitarias para garantizar que se llamen desde un contexto válido. Lanza un error claro si no es así.

```ts
import {assertInInjectionContext, inject, ElementRef} from '@angular/core';

export function injectNativeElement<T extends Element>(): T {
  assertInInjectionContext(injectNativeElement);
  return inject(ElementRef).nativeElement;
}
```
