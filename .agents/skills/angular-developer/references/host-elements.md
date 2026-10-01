# Host Elements de componentes

El **host element** es el elemento del DOM que coincide con el selector de un componente. El template del componente se renderiza dentro de este elemento.

## Binding al host element

Usa la propiedad `host` en el decorador `@Component` para hacer binding de propiedades, atributos, estilos y eventos al host element. Este es el **enfoque preferido** sobre los decoradores legacy.

```ts
@Component({
  selector: 'custom-slider',
  host: {
    'role': 'slider', // Atributo estático
    '[attr.aria-valuenow]': 'value', // Attribute binding
    '[class.active]': 'isActive()', // Class binding
    '[style.color]': 'color()', // Style binding
    '[tabIndex]': 'disabled ? -1 : 0', // Property binding
    '(keydown)': 'onKeyDown($event)', // Event binding
  },
})
export class CustomSlider {
  protected readonly value = 0;
  protected readonly disabled = false;
  protected readonly isActive = signal(false);
  protected readonly color = signal('blue');

  onKeyDown(event: KeyboardEvent) {
    /* ... */
  }
}
```

## Decoradores legacy

`@HostBinding` y `@HostListener` se soportan por compatibilidad con versiones anteriores, pero deben evitarse en código nuevo.

```ts
export class CustomSlider {
  @HostBinding('tabIndex')
  get tabIndex() {
    return this.disabled ? -1 : 0;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    /* ... */
  }
}
```

## Colisiones de bindings

Si tanto el componente (host binding) como el consumidor (template binding) hacen binding a la misma propiedad:

1. **Estático vs estático**: Gana el binding de la instancia (consumidor).
2. **Estático vs dinámico**: Gana el binding dinámico.
3. **Dinámico vs dinámico**: Gana el host binding del componente.

## Inyección de atributos del host

Usa `HostAttributeToken` con la función `inject` para leer atributos estáticos del host element en el momento de la construcción.

```ts
import {Component, HostAttributeToken, inject} from '@angular/core';

@Component({
  selector: 'app-btn',
  template: `<ng-content />`,
})
export class AppButton {
  // Lanza un error si falta 'type', a menos que se inyecte con { optional: true }
  type = inject(new HostAttributeToken('type'));
}
```

Uso:

```html
<app-btn type="primary">Click Me</app-btn>
```
