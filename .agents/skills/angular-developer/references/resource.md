# Reactividad asíncrona con `resource`

Un `Resource` incorpora la obtención asíncrona de datos a la reactividad basada en signals de Angular. Ejecuta una función loader asíncrona cada vez que cambian sus dependencias, exponiendo el status y el resultado como signals síncronos.

## Uso básico

La función `resource` acepta un objeto de opciones con dos propiedades principales:

1. `params`: Un cómputo reactivo (como `computed`). Cuando los signals leídos aquí cambian, el resource vuelve a obtener los datos.
2. `loader`: Una función asíncrona que obtiene los datos en función de los parámetros.

```ts
import { Component, resource, signal, computed } from '@angular/core';

@Component({...})
export class UserProfile {
  protected readonly userId = signal('123');

  protected readonly userResource = resource({
    // Rastreando userId de forma reactiva
    params: () => ({ id: this.userId() }),

    // Se ejecuta cada vez que cambian los params
    loader: async ({ params, abortSignal }) => {
      const response = await fetch(`/api/users/${params.id}`, { signal: abortSignal });
      if (!response.ok) throw new Error('Network error');
      return response.json();
    }
  });

  // Usa el valor del resource en computed signals
  protected readonly userName = computed(() => {
    if (this.userResource.hasValue()) {
      return this.userResource.value()?.name;
    } else {
      return 'Loading...';
    }
  });
}
```

## Abortar peticiones

Si el signal `params` cambia mientras un loader anterior todavía se está ejecutando, el `Resource` intentará abortar la petición pendiente usando el `abortSignal` proporcionado. **Pasa siempre `abortSignal` a tus llamadas a `fetch`.**

## Recargar datos

Puedes forzar de forma imperativa al resource a volver a ejecutar el loader sin que cambien los params llamando a `.reload()`.

```ts
this.userResource.reload();
```

## Signals de status del resource

El objeto `Resource` proporciona varios signals para leer su estado actual:

- `value()`: Los datos resueltos, o `undefined`.
- `hasValue()`: Booleano que actúa como type-guard. `true` si existe un valor.
- `isLoading()`: Booleano que indica si el loader se está ejecutando actualmente.
- `error()`: El error lanzado por el loader, o `undefined`.
- `status()`: Una constante de tipo string que representa el estado exacto (`'idle'`, `'loading'`, `'resolved'`, `'error'`, `'reloading'`, `'local'`).

## Mutación local

Puedes actualizar de forma optimista el valor del resource directamente. Esto cambia el status a `'local'`.

```ts
this.userResource.value.set({name: 'Optimistic Update'});
```

## Obtención reactiva de datos con `httpResource`

Si estás usando el `HttpClient` de Angular, prefiere usar `httpResource`. Es un wrapper especializado que aprovecha el stack HTTP de Angular (incluidos los interceptors) mientras proporciona la misma API de resource basada en signals.
