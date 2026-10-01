# Reactive Forms

Los reactive forms proporcionan un enfoque basado en el modelo para manejar los inputs de los formularios. Están construidos en torno a streams observables y proporcionan acceso síncrono al modelo de datos, lo que los hace más escalables y testeables que los template-driven forms.

## Clases principales

Los reactive forms se construyen usando estas clases fundamentales de `@angular/forms`:

- `FormControl`: Gestiona el valor y la validez de un input individual.
- `FormGroup`: Gestiona un grupo de controles (una estructura similar a un objeto).
- `FormArray`: Gestiona un array de controles indexado numéricamente.
- `FormBuilder`/`NonNullableFormBuilder`: Un servicio que proporciona factory methods para crear instancias de controles.

## Configuración

Importa `ReactiveFormsModule` en tu componente.

```ts
import {Component, inject} from '@angular/core';
import {ReactiveFormsModule, NonNullableFormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-editor.component.html',
})
export class ProfileEditor {
  private readonly fb = inject(NonNullableFormBuilder);

  // Usando FormBuilder para una definición concisa
  protected readonly profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: '',
    address: this.fb.group({
      street: '',
      city: '',
    }),
    aliases: this.fb.array([this.fb.control('')]),
  });

  protected onSubmit() {
    console.warn(this.profileForm.value);
  }
}
```

## Binding en el template

Usa directivas para hacer binding del modelo a la vista:

- `[formGroup]`: Hace binding de un `FormGroup` a un `<form>` o `<div>`.
- `formControlName`: Hace binding de un control con nombre dentro de un grupo a un input.
- `formGroupName`: Hace binding de un `FormGroup` anidado.
- `formArrayName`: Hace binding de un `FormArray` anidado.
- `[formControl]`: Hace binding de un `FormControl` standalone.

```html
<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
  <input type="text" formControlName="firstName" />

  <div formGroupName="address">
    <input type="text" formControlName="street" />
  </div>

  <div formArrayName="aliases">
    @for (alias of profileForm.controls.aliases.controls; track alias) {
    <input type="text" [formControlName]="$index" />
    }
  </div>

  <button type="submit" [disabled]="!profileForm.valid">Submit</button>
</form>
```

## Acceso a los controles

Usa `.controls` para acceder fácilmente a los controles.

```ts
addAlias() {
  this.profileForm.controls.aliases.push(this.fb.control(''));
}
```

## Actualización de valores

- `patchValue()`: Actualiza solo las propiedades especificadas. Falla silenciosamente ante discrepancias estructurales.
- `setValue()`: Reemplaza el modelo completo. Aplica estrictamente la estructura del formulario.

```ts
updateProfile() {
  this.profileForm.patchValue({
    firstName: 'Nancy',
    address: { street: '123 Drew Street' }
  });
}
```

## Eventos de cambio unificados

Angular moderno (v18+) proporciona un único observable `events` en todos los controles para rastrear los eventos de value, status, pristine, touched, reset y submit.

```ts
import {ValueChangeEvent, StatusChangeEvent} from '@angular/forms';

this.profileForm.events.subscribe((event) => {
  if (event instanceof ValueChangeEvent) {
    console.log('New value:', event.value);
  }
});
```

## Gestión manual del estado

- `markAsTouched()` / `markAllAsTouched()`: Útil para mostrar errores de validación al hacer submit.
- `markAsDirty()` / `markAsPristine()`: Rastrea si el valor ha sido modificado.
- `updateValueAndValidity()`: Dispara manualmente el recálculo del valor y del status.
- Las opciones `{ emitEvent: false }` o `{ onlySelf: true }` pueden pasarse a la mayoría de los métodos para controlar la propagación.
