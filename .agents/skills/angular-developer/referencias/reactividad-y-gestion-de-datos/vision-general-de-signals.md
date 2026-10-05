# Visión general de Angular Signals

Los signals son la base de la reactividad en las aplicaciones modernas de Angular. Un **signal** es un wrapper alrededor de un valor que notifica a los consumidores interesados cuando ese valor cambia.

## Writable signals (`signal`)

Usa `signal()` para crear estado que puede actualizarse directamente.

```ts
import {signal} from '@angular/core';

// Crea un writable signal
const count = signal(0);

// Lee el valor (siempre requiere llamar a la función getter)
console.log(count());

// Actualiza el valor directamente
count.set(3);

// Actualiza en función del valor anterior
count.update((value) => value + 1);
```

### Exponer como readonly

Al exponer estado desde un servicio, es una buena práctica exponer una versión readonly para evitar la mutación externa.

```ts
private readonly _count = signal(0);
// Los consumidores pueden leer esto, pero no pueden llamar a .set() ni a .update()
readonly count = this._count.asReadonly();
```

## Computed signals (`computed`)

Usa `computed()` para crear signals de solo lectura que derivan su valor de otros signals.

- **Evaluación lazy**: La función de derivación no se ejecuta hasta que se lee el computed signal.
- **Memoizado**: El resultado se almacena en caché. Solo se recalcula cuando cambia alguno de los signals de los que depende.
- **Dependencias dinámicas**: Solo se rastrean los signals que _realmente se leen_ durante la derivación.

```ts
import {signal, computed} from '@angular/core';

const count = signal(0);
const doubleCount = computed(() => count() * 2);

// doubleCount se actualiza automáticamente cuando count cambia.
```

## Contextos reactivos

Un **contexto reactivo** es un estado en runtime en el que Angular monitorea las lecturas de signals para establecer una dependencia.

Angular entra automáticamente en un contexto reactivo al evaluar:

- `computed` signals
- Callbacks de `effect`
- Cómputos de `linkedSignal`
- Templates de componentes

### Lecturas sin rastreo (`untracked`)

Si necesitas leer un signal dentro de un contexto reactivo _sin_ crear una dependencia (para que el contexto no se vuelva a ejecutar cuando el signal cambie), usa `untracked()`.

```ts
import {effect, untracked} from '@angular/core';

effect(() => {
  // Este effect solo se ejecuta cuando currentUser cambia.
  // NO se ejecuta cuando counter cambia, aunque counter se lea aquí.
  console.log(`User: ${currentUser()}, Count: ${untracked(counter)}`);
});
```

### Operaciones asíncronas en contextos reactivos

El contexto reactivo solo está activo para el código **síncrono**. Las lecturas de signals después de un `await` no serán rastreadas. **Lee siempre los signals antes de los límites asíncronos.**

```ts
// ❌ INCORRECTO: theme() no se rastrea porque se lee después del await
effect(async () => {
  const data = await fetchUserData();
  console.log(theme());
});

// ✅ CORRECTO: Lee el signal antes del await
effect(async () => {
  const currentTheme = theme();
  const data = await fetchUserData();
  console.log(currentTheme);
});
```
