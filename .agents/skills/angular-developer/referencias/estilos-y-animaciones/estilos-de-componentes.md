# Estilos de componentes

Los componentes de Angular pueden definir estilos que se aplican específicamente a su template, lo que permite la encapsulación y la modularidad.

## Definir estilos

Los estilos pueden definirse inline o en archivos separados.

```ts
@Component({
  selector: 'app-photo',
  // Estilos inline
  styles: `
    img {
      border-radius: 50%;
    }
  `,
  // O archivo externo
  styleUrl: 'photo.component.css',
})
export class Photo {}
```

## View Encapsulation

Cada componente tiene una configuración de view encapsulation que determina cómo se delimita el alcance de los estilos.

| Modo                            | Comportamiento                                                                                                          |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| `Emulated` (por defecto)        | Limita el alcance de los estilos al componente usando atributos HTML únicos. Los estilos globales aún pueden filtrarse. |
| `ShadowDom`                     | Usa la API nativa de Shadow DOM del navegador para aislar los estilos por completo.                                     |
| `None`                          | Deshabilita la encapsulación. Los estilos del componente se vuelven globales.                                           |
| `ExperimentalIsolatedShadowDom` | Garantiza estrictamente que solo se apliquen los estilos del componente.                                                |

### Uso

```ts
import { ViewEncapsulation } from '@angular/core';

@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class GlobalStyled {}
```

## Selectores especiales

### `:host`

Apunta al host element del componente (el elemento que coincide con el selector del componente).

```css
:host {
  display: block;
  border: 1px solid black;
}
```

### `:host-context()`

Apunta al host element según alguna condición en sus ancestros.

```css
/* Aplica estilos si algún ancestro tiene la clase 'theme-dark' */
:host-context(.theme-dark) {
  background-color: #333;
}
```

### `::ng-deep`

Deshabilita la view encapsulation para una regla específica, permitiendo que se "filtre" hacia los componentes hijos.
**Nota: El equipo de Angular desaconseja enfáticamente el uso de `::ng-deep`.** Solo se soporta por compatibilidad con versiones anteriores.

## Estilos en templates

Puedes usar elementos `<style>` directamente en el template de un componente. Las reglas de view encapsulation siguen aplicándose.

```html
<style>
  .dynamic-class {
    color: red;
  }
</style>
<div class="dynamic-class">Hello</div>
```

## Estilos externos

Usar `<link>` o `@import` en CSS se trata como estilos externos. **Los estilos externos no se ven afectados por la view encapsulation emulada.**
