# Animaciones de Angular

Al animar elementos en Angular, **primero analiza la versión de Angular del proyecto** en `package.json`.
Para aplicaciones modernas (**Angular v20.2 y versiones posteriores**), prefiere usar CSS nativo con `animate.enter` y `animate.leave`. Para aplicaciones más antiguas, es posible que necesites usar el paquete deprecado `@angular/animations`.

## 1. Animaciones con CSS nativo (v20.2+ recomendado)

Angular moderno proporciona `animate.enter` y `animate.leave` para animar elementos cuando entran o salen del DOM. Aplican clases CSS en los momentos apropiados.

### `animate.enter` y `animate.leave`

Úsalos directamente en los elementos para aplicar clases CSS durante la fase de entrada o de salida. Angular elimina automáticamente las clases de entrada cuando la animación termina. Para `animate.leave`, Angular espera a que la animación termine antes de eliminar el elemento del DOM.

Ejemplo de `animate.enter`:

```html
@if (isShown()) {
<div class="enter-container" animate.enter="enter-animation">
  <p>The box is entering.</p>
</div>
}
```

```css
/* Asegúrate de tener un estilo inicial si usas transitions en lugar de keyframes */
.enter-container {
  border: 1px solid #dddddd;
  margin-top: 1em;
  padding: 20px;
  font-weight: bold;
  font-size: 20px;
}
.enter-container p {
  margin: 0;
}
.enter-animation {
  animation: slide-fade 1s;
}
@keyframes slide-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

_Nota: `animate.leave` puede agregarse a elementos hijos que se están eliminando._

### Event bindings y librerías de terceros

Puedes hacer binding a `(animate.enter)` y `(animate.leave)` para llamar funciones o usar librerías JS como GSAP.

```html
@if(show()) {
<div (animate.leave)="onLeave($event)">...</div>
}
```

```ts
import { AnimationCallbackEvent } from '@angular/core';

onLeave(event: AnimationCallbackEvent) {
  // Lógica de animación personalizada aquí
  // CRÍTICO: ¡DEBES llamar a animationComplete() al terminar para que Angular elimine el elemento!
  event.animationComplete();
}
```

## 2. Animaciones CSS avanzadas

CSS ofrece herramientas robustas para secuencias de animación avanzadas.

### Animar estado y estilos

Alterna clases CSS en los elementos usando property binding para disparar transiciones.

```html
<div [class.open]="isOpen">...</div>
```

```css
div {
  transition: height 0.3s ease-out;
  height: 100px;
}
div.open {
  height: 200px;
}
```

### Animar altura automática

Puedes usar `css-grid` para animar hacia una altura automática.

```css
.container {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s;
}
.container.open {
  grid-template-rows: 1fr;
}
.container > div {
  overflow: hidden;
}
```

### Animaciones escalonadas y paralelas

- **Escalonadas**: Usa `animation-delay` o `transition-delay` con valores diferentes para los elementos de una lista.
- **Paralelas**: Aplica múltiples animaciones en la propiedad abreviada `animation` (p. ej., `animation: rotate 3s, fade-in 2s;`).

### Control programático

Obtén las animaciones directamente usando las Web APIs estándar:

```ts
const animations = element.getAnimations();
animations.forEach((anim) => anim.pause());
```

## 3. DSL de animaciones legacy (deprecado)

Para proyectos más antiguos (anteriores a v20.2 o donde `@angular/animations` ya se usa intensivamente), se usa el DSL de la metadata del componente.

**Importante:** No mezcles animaciones legacy con `animate.enter`/`leave` en el mismo componente.

### Configuración

```ts
bootstrapApplication(App, {
  providers: [provideAnimationsAsync()],
});
```

### Definir transiciones

```ts
import {signal} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  animations: [
    trigger('openClose', [
      state('open', style({opacity: 1})),
      state('closed', style({opacity: 0})),
      transition('open <=> closed', [animate('0.5s')]),
    ]),
  ],
  template: `<div [@openClose]="isOpen() ? 'open' : 'closed'">...</div>`,
})
export class OpenClose {
  protected readonly isOpen = signal(true);
}
```
