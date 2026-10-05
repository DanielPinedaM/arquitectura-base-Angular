# Outputs (eventos personalizados)

Los outputs permiten que un componente hijo emita eventos personalizados que un componente padre puede escuchar. Angular recomienda usar la nueva función `output()` para aplicaciones modernas.

## Outputs basados en funciones

Declara los outputs usando la función `output()`. Esta devuelve un `OutputEmitterRef`.

```ts
import {Component, output} from '@angular/core';

@Component({
  selector: 'custom-slider',
  template: `<button (click)="changeValue(50)">Set to 50</button>`,
})
export class CustomSlider {
  // Output sin datos de evento
  readonly panelClosed = output<void>();

  // Output con datos de evento (number)
  readonly valueChanged = output<number>();

  changeValue(newValue: number) {
    this.valueChanged.emit(newValue);
  }
}
```

### Uso en el template

Haz binding al evento del output usando paréntesis `()`. Si el evento emite datos, accede a ellos usando la variable especial `$event`.

```html
<custom-slider (panelClosed)="savePanelState()" (valueChanged)="logValue($event)" />
```

## Opciones de configuración

La función `output` acepta un objeto de configuración para especificar un alias.

```ts
@Component({...})
export class CustomSlider {
  // El evento se llama 'valueChanged' en el template,
  // pero se accede como 'changed' en la clase del componente.
  readonly changed = output<number>({ alias: 'valueChanged' });
}
```

## Suscripción programática

Al crear componentes de forma dinámica, puedes suscribirte a los outputs de forma programática:

```ts
const componentRef = viewContainerRef.createComponent(CustomSlider);

const subscription = componentRef.instance.valueChanged.subscribe((val) => {
  console.log('Value changed:', val);
});

// Limpia manualmente si es necesario (Angular limpia automáticamente los componentes destruidos)
subscription.unsubscribe();
```

## Outputs basados en decoradores (@Output)

La API legacy usa el decorador `@Output()` con un `EventEmitter`. Sigue siendo soportada, pero no se recomienda para código nuevo.

```ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({...})
export class LegacyExample {
  @Output() readonly valueChanged = new EventEmitter<number>();

  // Con alias
  @Output('customEventName') readonly changed = new EventEmitter<void>();
}
```

## Buenas prácticas

- **Prefiere `output()`**: Usa el `output()` basado en funciones en lugar de `@Output()` y `EventEmitter`.
- **Nomenclatura**: Usa `camelCase` para los nombres de los outputs. Evita el prefijo `on` (p. ej., usa `valueChanged` en lugar de `onValueChanged`).
- **Sin bubbling en el DOM**: Los eventos personalizados de Angular no hacen bubbling hacia arriba en el árbol del DOM como los eventos nativos.
- **Evita colisiones**: No elijas nombres que colisionen con eventos nativos del DOM (como `click` o `submit`).
