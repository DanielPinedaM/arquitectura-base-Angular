# Inputs

Los inputs permiten que los datos fluyan de un componente padre a un componente hijo. Angular recomienda usar la API de `input` basada en signals para aplicaciones modernas.

## Inputs basados en signals

Declara los inputs usando la función `input()`. Esta devuelve un `InputSignal`.

```ts
import {Component, input, computed} from '@angular/core';

@Component({
  selector: 'app-user',
  template: `<p>{{ label() }} ({{ age() }})</p>`,
})
export class User {
  // Input opcional con valor por defecto
  readonly name = input('Guest');

  // Input requerido
  readonly age = input.required<number>();

  // Los inputs son signals reactivos
  protected readonly label = computed(() => `Name: ${this.name()}`);
}
```

### Uso en el template

```html
<app-user [name]="userName" [age]="25" />
```

## Opciones de configuración

La función `input` acepta un objeto de configuración:

- **Alias**: Cambia el nombre de la propiedad usado en los templates.
- **Transform**: Modifica el valor antes de que llegue al componente.

```ts
import { input, booleanAttribute } from '@angular/core';

@Component({...})
export class CustomButton {
  // Ejemplo de alias
  readonly label = input('', { alias: 'btnLabel' });

  // Ejemplo de transform usando un helper integrado
  readonly disabled = input(false, { transform: booleanAttribute });
}
```

## Model Inputs (two-way binding)

Usa `model()` para crear un input que soporte two-way data binding.

```ts
@Component({
  selector: 'custom-counter',
  template: `<button (click)="increment()">+</button>`,
})
export class CustomCounter {
  readonly value = model(0);

  increment() {
    this.value.update((v) => v + 1);
  }
}
```

### Uso

```html
<!-- Two-way binding con un signal -->
<custom-counter [(value)]="mySignal" />

<!-- Two-way binding con una propiedad simple -->
<custom-counter [(value)]="myProperty" />
```

## Inputs basados en decoradores (@Input)

La API legacy sigue siendo soportada, pero no se recomienda para código nuevo.

```ts
import { Component, Input } from '@angular/core';

@Component({...})
export class Legacy {
  @Input({ required: true }) value = 0;
  @Input({ transform: trimString }) label = '';
}
```

## Buenas prácticas

- **Prefiere signals**: Usa `input()` en lugar de `@Input()` para una mejor reactividad y seguridad de tipos.
- **Inputs requeridos**: Usa `input.required()` para datos obligatorios y así obtener errores en tiempo de build.
- **Transforms puros**: Asegúrate de que las funciones transform de los inputs sean puras y analizables estáticamente.
- **Evita colisiones**: No uses nombres de inputs que colisionen con propiedades estándar del DOM (p. ej., `id`, `title`).
