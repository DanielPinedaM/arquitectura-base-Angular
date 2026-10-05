# Estado dependiente con `linkedSignal`

La función `linkedSignal` te permite crear estado escribible que está intrínsecamente vinculado a algún otro estado. Es perfecta para el estado que necesita un valor por defecto derivado de un input o de otro signal, pero que aun así el usuario puede modificar de forma independiente.

Si el estado de origen cambia, el `linkedSignal` se restablece a un nuevo valor calculado.

## Uso básico

Cuando solo necesitas recalcular en función de un origen, pasa una función de cómputo. `linkedSignal` funciona como `computed`, pero el signal resultante es escribible (puedes llamar a `.set()` o `.update()` sobre él).

```ts
import { Component, signal, linkedSignal } from '@angular/core';

@Component({...})
export class ShippingMethodPicker {
  protected readonly shippingOptions = signal(['Ground', 'Air', 'Sea']);

  // Por defecto es la primera opción.
  // Si shippingOptions cambia, selectedOption se restablece a la nueva primera opción.
  protected readonly selectedOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShipping(index: number) {
    // ¡Aún podemos actualizar manualmente este signal!
    this.selectedOption.set(this.shippingOptions()[index]);
  }
}
```

## Uso avanzado: tener en cuenta el estado anterior

A veces, cuando el estado de origen cambia, quieres preservar la selección manual del usuario si todavía es válida. Para hacer esto, usa la sintaxis de objeto proporcionando `source` y `computation`.

La función `computation` recibe el nuevo valor del origen y un objeto `previous` que contiene el valor anterior del origen y el valor anterior del `linkedSignal`.

```ts
interface ShippingMethod { id: number; name: string; }

@Component({...})
export class ShippingMethodPicker {
  protected readonly shippingOptions = signal<ShippingMethod[]>([
    {id: 0, name: 'Ground'}, {id: 1, name: 'Air'}, {id: 2, name: 'Sea'}
  ]);

  protected readonly selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
    source: this.shippingOptions,
    computation: (newOptions, previous) => {
      // Si las opciones recién cargadas aún contienen la opción que el usuario
      // seleccionó previamente, la mantiene seleccionada. Si no, se restablece a la primera opción.
      return newOptions.find(opt => opt.id === previous?.value.id) ?? newOptions[0];
    }
  });
}
```

### Cuándo usar `linkedSignal` vs `computed` vs `effect`

- Usa `computed`: Cuando el estado se deriva **estrictamente** de otro estado y nunca debe actualizarse manualmente.
- Usa `linkedSignal`: Cuando el estado se deriva de otro estado, pero el usuario **debe** poder sobrescribirlo o actualizarlo manualmente.
- **Nunca** uses `effect` para sincronizar una parte del estado con otra. Eso es un anti-pattern. Usa `computed` o `linkedSignal` en su lugar.
