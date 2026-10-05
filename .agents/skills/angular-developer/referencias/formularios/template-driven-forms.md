# Template-Driven Forms

Los template-driven forms usan two-way data binding (`[(ngModel)]`) para actualizar el modelo de datos en el componente a medida que se realizan cambios en el template, y viceversa. Son ideales para formularios simples y usan directivas en el template HTML para gestionar el estado y la validación del formulario.

## Directivas principales

Los template-driven forms dependen de `FormsModule`, que proporciona estas directivas clave:

- `NgModel`: Reconcilia los cambios de valor del elemento del formulario con el modelo de datos (`[(ngModel)]`).
- `NgForm`: Crea automáticamente un `FormGroup` de nivel superior vinculado a la etiqueta `<form>`.
- `NgModelGroup`: Crea un `FormGroup` anidado vinculado a un elemento del DOM.

## Configuración

Primero, importa `FormsModule` en tu componente o módulo.

```ts
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
})
export class UserForm {
  user = {name: '', role: 'Guest'};

  onSubmit() {
    console.log('Form submitted!', this.user);
  }
}
```

## Construcción del template del formulario

### Two-way binding con `[(ngModel)]`

Usa `[(ngModel)]` en los elementos input. **Todo elemento que use `[(ngModel)]` DEBE tener un atributo `name`.** Angular usa el atributo `name` para registrar el control en el `NgForm` padre.

```html
<form #userForm="ngForm" (ngSubmit)="onSubmit()">
  <!-- Input básico -->
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" required [(ngModel)]="user.name" name="name" #nameCtrl="ngModel" />
  </div>

  <!-- Select box -->
  <div>
    <label for="role">Role:</label>
    <select id="role" [(ngModel)]="user.role" name="role">
      <option value="Admin">Admin</option>
      <option value="Guest">Guest</option>
    </select>
  </div>

  <!-- Botón de envío (deshabilitado si el formulario es inválido) -->
  <button type="submit" [disabled]="!userForm.form.valid">Submit</button>
</form>
```

## Estado del formulario y de los controles

Angular aplica automáticamente clases CSS a los controles y formularios según su estado:

| Estado             | Clase si es verdadero             | Clase si es falso |
| :----------------- | :-------------------------------- | :---------------- |
| Visitado           | `ng-touched`                      | `ng-untouched`    |
| Valor modificado   | `ng-dirty`                        | `ng-pristine`     |
| El valor es válido | `ng-valid`                        | `ng-invalid`      |
| Formulario enviado | `ng-submitted` (solo en `<form>`) | -                 |

Puedes usar estas clases para proporcionar retroalimentación visual en tu CSS:

```css
.ng-valid[required],
.ng-valid.required {
  border-left: 5px solid #42a948; /* verde */
}
.ng-invalid:not(form) {
  border-left: 5px solid #a94442; /* rojo */
}
```

## Validación y mensajes de error

Para mostrar mensajes de error de forma condicional, exporta la directiva `ngModel` a una template reference variable (p. ej., `#nameCtrl="ngModel"`).

```html
<input type="text" id="name" required [(ngModel)]="user.name" name="name" #nameCtrl="ngModel" />

<!-- Muestra el error solo si el control es inválido Y (touched O dirty) -->
@if (nameCtrl.invalid && (nameCtrl.dirty || nameCtrl.touched)) {
<div class="alert alert-danger">
  @if (nameCtrl.errors?.['required']) {
  <div>Name is required.</div>
  }
</div>
}
```

## Envío del formulario

1. Usa el evento `(ngSubmit)` en el elemento `<form>`.
2. Haz binding del estado deshabilitado del botón de envío a la validez general del formulario usando la template reference variable de `NgForm` (p. ej., `[disabled]="!userForm.form.valid"`).

## Restablecer el formulario

Para restablecer de forma programática el formulario a su estado pristine (limpiando los valores y los flags de validación), usa el método `reset()` en la instancia de `NgForm`.

```html
<button type="button" (click)="userForm.reset()">Reset</button>
```
