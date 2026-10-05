# Comunicación HTTP con `HttpClient` y `httpResource`

Usa las APIs HTTP de Angular para la comunicación con el backend, de modo que las peticiones participen en la inyección de dependencias, los interceptors, el transfer cache y las funcionalidades de seguridad.

## Configuración

En Angular v21 y versiones posteriores, `HttpClient` está disponible para inyección por defecto. Agrega `provideHttpClient(...)` solo cuando una aplicación necesite configurar funcionalidades HTTP para un injector específico:

```ts
import {provideHttpClient, withInterceptors} from '@angular/common/http';

export const appConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
};
```

- `HttpClient` usa el backend fetch por defecto.
- Usa `withXhr()` solo cuando se requieran eventos de progreso de subida. No uses `withXhr()` para el server-side rendering.
- Usa `provideHttpClient(...)` para la configuración de funcionalidades como interceptors, opciones de XSRF, XHR o delegación de peticiones al padre.
- Llamar a `provideHttpClient()` sin funcionalidades no es necesario para peticiones HTTP básicas, pero configura el conjunto de funcionalidades HTTP por defecto para ese injector, incluido el interceptor XSRF de Angular.
- Prefiere `provideHttpClient(...)` sobre `HttpClientModule` para la configuración de funcionalidades, especialmente con múltiples injectors.
- Usa `withRequestsMadeViaParent()` cuando un injector hijo deba agregar interceptors y, al mismo tiempo, seguir delegando a la cadena HTTP del padre.

## `HttpClient`

Encapsula las llamadas al backend en servicios inyectables, no en componentes:

```ts
import {HttpClient} from '@angular/common/http';
import {Service, inject} from '@angular/core';

@Service()
export class UserService {
  private readonly http = inject(HttpClient);

  getUser(id: string) {
    return this.http.get<User>(`/api/users/${id}`);
  }
}
```

Reglas importantes:

- Las peticiones de `HttpClient` son `Observable`s fríos. No se envía ninguna petición hasta que alguien se suscribe al `Observable`. Múltiples suscripciones envían múltiples peticiones al backend.
- Suscríbete a las peticiones de mutación (`post`, `put`, `patch`, `delete`) para que se ejecuten.
- El parámetro de tipo genérico es solo una aserción de tipo. Valida en runtime los datos desconocidos del backend cuando no se confía en su estructura.
- Usa valores literales para `responseType` y `observe`; si las opciones se extraen, escribe valores como `responseType: 'text' as const`.
- `HttpHeaders` y `HttpParams` son inmutables; usa la instancia devuelta por `.set()` o `.append()`.
- Las opciones de fetch como `timeout`, `cache`, `priority`, `mode`, `redirect`, `credentials`, `keepalive`, `referrer`, `referrerPolicy` e `integrity` se soportan donde el backend las soporte. `withCredentials: true` sobrescribe `credentials`.
- Maneja los fallos mediante `HttpErrorResponse`. Los fallos de red y de timeout usan el status `0`; los fallos del backend usan el código de status del servidor.
- Prefiere el pipe `async` o `toSignal` para las lecturas en componentes, de modo que las suscripciones se limpien.

## Interceptors

Prefiere interceptors funcionales configurados con `withInterceptors`.

```ts
import {
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  return next(req.clone({setHeaders: {Authorization: 'Bearer token'}}));
}

export const appConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
};
```

- Los interceptors se ejecutan en el orden en que se listan.
- Los objetos de petición y de respuesta son mayormente inmutables; clónalos antes de modificarlos.
- Los bodies de las peticiones y respuestas no son profundamente inmutables. Evita mutar el body in-place porque los reintentos pueden ejecutar el mismo interceptor de nuevo.
- Usa `inject()` dentro de los interceptors funcionales para los servicios.
- Usa `HttpContextToken` para metadata por petición que los interceptors necesitan pero que el backend no debe recibir.
- Usa interceptors basados en DI solo para código existente, y habilítalos con `withInterceptorsFromDi()`.

## Seguridad

- `HttpClient` elimina el prefijo XSSI de las respuestas JSON cuando está presente.
- `provideHttpClient()` configura la protección XSRF por defecto para las peticiones de mutación relativas y del mismo origen. Lee la cookie `XSRF-TOKEN` y envía el header `X-XSRF-TOKEN`.
- El backend debe establecer la cookie XSRF y verificar el header. Personaliza los nombres con `withXsrfConfiguration(...)`; deshabilítala solo de forma deliberada con `withNoXsrfProtection()`.

## `httpResource`

Usa `httpResource` para crear una derivación asíncrona que obtiene datos por HTTP y expone el resultado como signals reactivos.

```ts
import {httpResource} from '@angular/common/http';
import {input} from '@angular/core';

export class UserProfile {
  readonly userId = input.required<string>();
  readonly user = httpResource(() => `/api/users/${this.userId()}`);
}
```

- `httpResource` es eager. Envía una petición cuando se ejecuta su cómputo reactivo de la petición, no cuando alguien se suscribe a un `Observable`.
- Cuando una dependencia cambia, cancela la petición pendiente y envía la siguiente.
- Devuelve `undefined` desde la función de la petición para omitir una petición al backend.
- Prefiere `httpResource` para las lecturas. Usa `HttpClient` directamente para mutaciones como `POST`, `PUT`, `PATCH` y `DELETE`.
- Protege las lecturas de `value()` con `hasValue()`; leer `value()` mientras el resource está en estado de error lanza una excepción.
- Usa `httpResource.text`, `httpResource.blob` o `httpResource.arrayBuffer` para respuestas que no son JSON.
- Usa la opción `parse` para validar o transformar las respuestas con un schema en runtime.
- Lee `headers()`, `statusCode()` y `progress()` cuando se necesite la metadata de la respuesta o el progreso de descarga. Establece `reportProgress: true` para los eventos de progreso.
