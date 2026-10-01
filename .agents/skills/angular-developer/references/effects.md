# Efectos secundarios con `effect` y `afterRenderEffect`

En Angular, un **effect** es una operación que se ejecuta cada vez que cambian uno o más valores de signals que rastrea.

## Cuándo usar `effect`

Los effects están pensados para sincronizar el estado de los signals con APIs imperativas que no usan signals.

**Casos de uso válidos:**

- Registro (logging) de analíticas.
- Sincronizar el estado con `localStorage` o `sessionStorage`.
- Realizar un renderizado personalizado en un `<canvas>` o en una librería de gráficos de terceros.

**REGLA CRÍTICA: NO uses effects para propagar estado.**
Si te encuentras usando `.set()` o `.update()` sobre un signal _dentro_ de un effect para mantener dos signals sincronizados, estás cometiendo un error. Esto provoca errores `ExpressionChangedAfterItHasBeenChecked` y bucles infinitos. **Usa siempre `computed()` o `linkedSignal()` para la derivación de estado.**

## Uso básico

Los effects se ejecutan de forma asíncrona durante el proceso de change detection. Siempre se ejecutan al menos una vez.

```ts
import { Component, signal, effect } from '@angular/core';

@Component({...})
export class Example {
  protected readonly count = signal(0);

  constructor() {
    // El effect debe crearse en un injection context (p. ej., un constructor)
    effect((onCleanup) => {
      console.log(`Count changed to ${this.count()}`);

      const timer = setTimeout(() => console.log('Timer finished'), 1000);

      // La función de cleanup se ejecuta antes de la siguiente ejecución, o al destruirse
      onCleanup(() => clearTimeout(timer));
    });
  }
}
```

## Manipulación del DOM con `afterRenderEffect`

El `effect` estándar se ejecuta _antes_ de que Angular actualice el DOM. Si necesitas inspeccionar o modificar manualmente el DOM en función de un cambio de un signal (p. ej., al integrar una librería de UI de terceros), usa `afterRenderEffect`.

`afterRenderEffect` se ejecuta después de que Angular ha terminado de renderizar el DOM.

### Fases de renderizado

Para evitar reflows (layout thrashing forzado), `afterRenderEffect` te obliga a dividir tus lecturas y escrituras del DOM en fases específicas.

```ts
import { Component, afterRenderEffect, viewChild, ElementRef } from '@angular/core';

@Component({...})
export class Chart {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    afterRenderEffect({
      // 1. Lee del DOM
      earlyRead: () => {
        return this.canvas().nativeElement.getBoundingClientRect().width;
      },
      // 2. Escribe en el DOM (recibe el resultado de la fase anterior como un Signal)
      write: (width) => {
        // NUNCA leas del DOM en la fase de escritura.
        setupChart(this.canvas().nativeElement, width());
      }
    });
  }
}
```

**Fases disponibles (ejecutadas en este orden):**

1. `earlyRead`
2. `write` (nunca leas aquí)
3. `mixedReadWrite` (evítala si es posible)
4. `read` (nunca escribas aquí)

_Nota: `afterRenderEffect` solo se ejecuta en el cliente, nunca durante el Server-Side Rendering (SSR)._
