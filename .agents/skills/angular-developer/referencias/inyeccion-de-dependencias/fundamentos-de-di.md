# Fundamentos de la inyección de dependencias (DI)

La inyección de dependencias (DI) es un patrón de diseño que se usa para organizar y compartir código a lo largo de una aplicación, permitiéndote "inyectar" funcionalidades en diferentes partes. Esto mejora la mantenibilidad, la escalabilidad y la testeabilidad del código.

## Cómo funciona la DI en Angular

Hay dos formas principales en que el código interactúa con el sistema de DI de Angular:

1.  **Proveer**: Hacer que los valores (objetos, funciones, primitivos) estén disponibles para el sistema de DI.
2.  **Inyectar**: Pedirle esos valores al sistema de DI.

Los componentes, directivas y servicios de Angular participan automáticamente en la DI.

## Servicios

Un **servicio** es la forma más común de compartir datos y funcionalidad a lo largo de una aplicación. Es una clase TypeScript decorada con `@Service()`.

### Crear un servicio

Usa el decorador `@Service()` para hacer que el servicio sea un singleton disponible en toda la aplicación. Este es el enfoque recomendado para la mayoría de los servicios.

```ts
import {Service} from '@angular/core';

@Service()
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', {category, value});
  }
}
```

Los usos comunes de los servicios incluyen:

- Clientes de datos (llamadas a la API)
- Gestión del estado
- Autenticación y autorización
- Logging y manejo de errores
- Funciones utilitarias

## Inyectar dependencias

Usa la función `inject()` de Angular para solicitar dependencias.

### La función `inject()`

Puedes usar la función `inject()` para obtener una instancia de un servicio (o de cualquier otro token provisto).

```ts
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AnalyticsLogger} from './analytics-logger.service';

@Component({
  selector: 'app-navbar',
  template: `<a href="#" (click)="navigateToDetail($event)">Detail Page</a>`,
})
export class Navbar {
  // Inyectando dependencias usando inicializadores de campos de clase
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

### ¿Dónde se puede usar `inject()`? (Injection Context)

Puedes llamar a `inject()` en un **injection context**. Los injection contexts más comunes son durante la construcción de un componente, directiva o servicio.

Lugares válidos para llamar a `inject()`:

1.  **Inicializadores de campos de clase** (recomendado)
2.  **Cuerpo del constructor**
3.  **Route guards y resolvers** (que se ejecutan en un injection context)
4.  **Factory functions** usadas en los providers

```typescript
import {Component, Directive, Service, inject, ElementRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';

// 1. En un componente (inicializador de campo y constructor)
@Component(/* ... */)
export class Example {
  private service1 = inject(MyService); // ✅ Inicializador de campo

  private service2: MyService;
  constructor() {
    this.service2 = inject(MyService); // ✅ Cuerpo del constructor
  }
}

// 2. En una directiva
@Directive({
  /*...*/
})
export class MyDirective {
  private element = inject(ElementRef); // ✅ Inicializador de campo
}

// 3. En un servicio
@Service()
export class MyService {
  private http = inject(HttpClient); // ✅ Inicializador de campo
}

// 4. En un route guard (funcional)
export const authGuard = () => {
  const auth = inject(AuthService); // ✅ Route Guard
  return auth.isAuthenticated();
};
```
