# Signal Forms

Los Signal Forms son el enfoque recomendado para manejar formularios en aplicaciones modernas de Angular (v21+). Proporcionan una forma reactiva, type-safe y basada en el modelo de gestionar el estado de los formularios usando Angular Signals.

**CRÍTICO**: DEBES usar la nueva API de Signal Forms de Angular para toda la funcionalidad relacionada con formularios. NO uses null como valor ni como tipo de ningún campo.

## Imports

Puedes importar lo siguiente desde `@angular/forms/signals`:

```ts
import {
  form,
  FormField,
  submit,
  // Reglas para el estado de los campos
  disabled,
  hidden,
  readonly,
  debounce,
  // Helpers de schema
  applyWhen,
  applyEach,
  schema,
  // Validación personalizada
  validate,
  validateHttp,
  validateStandardSchema,
  // Metadata
  metadata,
} from '@angular/forms/signals';
```

## Crear un formulario

Usa la función `form()` con un modelo Signal. La estructura del formulario se deriva directamente del modelo.

```ts
import {Component, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';

@Component({
  // ...
  imports: [FormField],
})
export class Example {
  // 1. Define tu modelo con valores iniciales (evita undefined)
  protected readonly userModel = signal({
    name: '', // CRÍTICO: NUNCA uses null ni undefined como valores iniciales
    email: '',
    age: 0, // Usa 0 para números, NO null
    address: {
      street: '',
      city: '',
    },
    hobbies: [] as string[], // Usa [] para arrays, NO null
  });

  // INCORRECTO - NO HAGAS ESTO:
  // badModel = signal({
  //   name: null,      // ERROR: usa '' en su lugar
  //   age: null,       // ERROR: usa 0 en su lugar
  //   items: null      // ERROR: usa [] en su lugar
  // });

  // 2. Crea el formulario
  protected readonly userForm = form(this.userModel);
}
```

## Validación

Importa los validators desde `@angular/forms/signals`.

```ts
import {required, email, min, max, minLength, maxLength, pattern} from '@angular/forms/signals';
```

Úsalos en la schema function que se pasa a `form()`:

```ts
userForm = form(this.userModel, (schemaPath) => {
  // Requerido
  required(schemaPath.name, {message: 'Name is required'});

  // Requerido condicional.
  required(schemaPath.name, {
    when({valueOf}) {
      return valueOf(schemaPath.age) > 10;
    },
  });

  // Email
  email(schemaPath.email, {message: 'Invalid email'});

  // Min/Max para números
  min(schemaPath.age, 18);
  max(schemaPath.age, 100);

  // MinLength/MaxLength para strings/arrays
  minLength(schemaPath.password, 8);
  maxLength(schemaPath.description, 500);

  // Pattern (Regex), aplicado solo cuando se cumple la condición
  pattern(schemaPath.zipCode, /^\d{5}$/, {
    when({valueOf}) {
      return valueOf(schemaPath.country) === 'US';
    },
  });
});
```

## FieldState vs FormField: el requisito parental

Es importante entender la diferencia entre **FormField** (la estructura) y **FieldState** (los datos/signals reales).

**REGLA**: Debes **LLAMAR** a un campo como una función para acceder a sus signals de estado (valid, touched, dirty, hidden, etc.).

```ts
// f es un FormField (estructural)
const f = form(signal({cat: {name: 'pirojok-the-cat', age: 5}}));

f.cat.name; // FormField: ¡No puedes obtener flags desde aquí!
f.cat.name.touched(); // ERROR: touched() no existe en FormField

f.cat.name(); // FieldState: Llamarlo te da acceso a los signals
f.cat.name().touched(); // VÁLIDO: Accediendo al signal
f.cat().name.touched(); // ERROR: f.cat() es estado, ¡no tiene hijos!
```

De forma similar, en un template:

```html
<!-- INCORRECTO: Property 'hidden' does not exist on type 'FormField' -->
@if (bookingForm.hotelDetails.hidden()) { ... }

<!-- CORRECTO: Llámalo primero -->
@if (bookingForm.hotelDetails().hidden()) { ... }
```

## Disabled / Readonly / Hidden

Controla el status de los campos usando reglas en el schema.

```ts
import {disabled, readonly, hidden} from '@angular/forms/signals';

userForm = form(this.userModel, (schemaPath) => {
  // Deshabilitado condicionalmente
  disabled(schemaPath.password, {when: ({valueOf}) => !valueOf(schemaPath.createAccount)});

  // Oculto condicionalmente (NO lo elimina del modelo, solo lo marca como hidden)
  hidden(schemaPath.shippingAddress, {when: ({valueOf}) => valueOf(schemaPath.sameAsBilling)});

  // Readonly
  readonly(schemaPath.username);
});
```

## Binding

Importa `FormField` y usa la directiva `[formField]`.

```ts
import {FormField} from '@angular/forms/signals';
```

Todas las props del estado, como `disabled`, `hidden`, `readonly` y `name`, se vinculan automáticamente.
_NO_ hagas binding del campo `name`.

**CRÍTICO: ATRIBUTOS PROHIBIDOS**
Al usar `[formField]`, NO DEBES establecer los siguientes atributos en el template (ni estáticos ni con binding):

- `min`, `max` (usa validators en el schema en su lugar)
- `value`, `[value]`, `[attr.value]` en **inputs de tipo text/number/date** (ya lo maneja `[formField]`)
- `[attr.min]`, `[attr.max]`
- `[disabled]`, `[readonly]` (ya lo maneja `[formField]`)

**Excepción**: El `value` estático en `<input type="radio">` y `<input type="checkbox">` está **permitido y es obligatorio** — identifica qué opción representa el input, no el valor del campo vinculado.

```html
<!-- CORRECTO: value en el radio especifica qué opción representa este botón -->
<input type="radio" value="economy" [formField]="bookingForm.package.tier" />

<!-- INCORRECTO: binding de value en un input normal -->
<input [value]="someVar" [formField]="form.name" />
```

NO hagas esto: `<input min="1" [formField]>` ni `<input [value]="val" [formField]>`.

```html
<!-- Input -->
<input [formField]="userForm.name" />

<!-- Checkbox -->
<input type="checkbox" [formField]="userForm.isAdmin" />

<!-- Select -->
<select [formField]="userForm.country">
  <option value="us">US</option>
</select>

<!-- userForm.name NO puede ser nullable, porque input no acepta null-->
<input [formField]="userForm.name" />
```

## Reactive Forms

**NO importes** `FormControl`, `FormGroup`, `FormArray` ni `FormBuilder` desde `@angular/forms`. Los Signal Forms reemplazan estos conceptos por completo.
Signal forms NO tiene un builder.

## Acceso al estado

Cada campo del formulario es una función que devuelve su estado.

```ts
// Accede al campo llamándolo
const emailState = this.userForm.email();

// Valor (WritableSignal)
const value = this.userForm().value();

// Estado de validación (Signals)
const isValid = this.userForm().valid();
const isInvalid = this.userForm().invalid();
const errors = this.userForm().errors(); // Array de errores
const isPending = this.userForm().pending(); // Validación asíncrona pendiente

// Estado de interacción (Signals)
const isTouched = this.userForm().touched();
const isDirty = this.userForm().dirty();

// Estado de disponibilidad (Signals)
const isDisabled = this.userForm().disabled();
const isHidden = this.userForm().hidden();
const isReadonly = this.userForm().readonly();
```

¡IMPORTANTE!: Asegúrate de llamar al campo para obtener su estado.

```ts
form().invalid()
form.field().dirty()
form.field.subfield().touched()
form.a.b.c.d().value()
form.address.ssn().pending()
form().reset()

// La única excepción es length:
form.children.length
form.length // NOTA: ¡sin paréntesis!
form.client.addresses.length  // Sin "()"

@for (income of form.addresses; track $index) {/**/}
```

## Envío

Usa la función `submit()`. Marca automáticamente todos los campos como touched antes de ejecutar la acción.

**CRÍTICO**: El callback de `submit()` DEBE ser `async` y DEBE devolver una Promise.

```ts
import { submit } from '@angular/forms/signals';

// CORRECTO - callback async
onSubmit() {
  submit(this.userForm, async () => {
    // Esto solo se ejecuta si el formulario es válido
    await this.apiService.save(this.userModel());
    console.log('Saved!');
  });
}

// INCORRECTO - falta la palabra clave async
onSubmit() {
  submit(this.userForm, () => {  // ERROR: debe ser async
    console.log('Saved!');
  });
}
```

## Manejo de errores

`field().errors()` devuelve el array de errores de tipo ValidationError:

```ts
interface ValidationError {
  readonly kind: string;
  readonly message?: string;
}
```

_NO_ devuelvas null desde los validators.
Cuando no haya errores, devuelve undefined

### Contexto

Las funciones que se pasan a reglas como `validate()`, `disabled()`, `applyWhen` reciben un objeto de contexto. Es **CRÍTICO** entender su estructura:

```ts
validate(
  schemaPath.username,
  ({
    value, // Signal<T>: Valor actual escribible del campo
    fieldTree, // FieldTree<T>: Subcampos (si es un grupo/array)
    state, // FieldState<T>: Accede a flags como state.valid(), state.dirty()
    valueOf, // (path) => T: Lee valores de OTROS campos (rastreando dependencias), p. ej. valueOf(schemaPath.password)
    stateOf, // (path) => FieldState: Accede al estado (valid/dirty) de OTROS campos, p. ej. stateOf(schemaPath.password).valid()
    pathKeys, // Signal<string[]>: Path desde la raíz hasta este campo
  }) => {
    // INCORRECTO: if (touched()) ... (touched no está en el contexto)
    // CORRECTO: if (state.touched()) ...

    if (value() === 'admin') {
      return {kind: 'reserved', message: 'Username admin is reserved'};
    }
  },
);
```

### IMPORTANTE: Los paths NO son signals

Dentro del callback de `form()`, `schemaPath` y sus hijos (p. ej., `schemaPath.user.name`) **NO** son signals y **NO** se pueden llamar.

```ts
// INCORRECTO - Esto lanzará un error:
applyWhen(p.ssn, () => p.ssn().touched(), (ssnField) => { ... });

// CORRECTO - Usa stateOf() para obtener el estado de un path:
applyWhen(p.ssn, ({ stateOf }) => stateOf(p.ssn).touched(), (ssnField) => { ... });

// CORRECTO - Usa valueOf() para obtener el valor de un path:
applyWhen(p.ssn, ({ valueOf }) => valueOf(p.ssn) !== '', (ssnField) => { ... });
```

### Múltiples elementos

- Usa `applyEach` para aplicar reglas por cada elemento.
- **CRÍTICO**: El callback de `applyEach` recibe SOLO UN argumento (el path del elemento), NO dos:

```ts
// CORRECTO - un solo argumento
applyEach(s.items, (item) => {
  required(item.name);
});

// INCORRECTO - NO pases el index
applyEach(s.items, (item, index) => {
  // ERROR: el callback recibe 1 argumento
  required(item.name);
});
```

- En el template, usa `@for` para iterar sobre los elementos.
- Para eliminar un elemento de un array, simplemente elimina el elemento correspondiente del array en los datos.
- **Binding de `select`**: SÍ PUEDES hacer binding a `<select [formField]="form.country">`. Asegúrate de que las opciones tengan atributos `value`.

### Bucles @for anidados

**CRÍTICO**: Angular NO tiene `$parent`. En los bucles anidados, almacena el índice externo en una variable:

```html
<!-- INCORRECTO - $parent no existe -->
@for (item of form.items; track $index) { @for (option of item.options; track $index) {
<button (click)="removeOption($parent.$index, $index)">Remove</button>
<!-- ERROR -->
} }

<!-- CORRECTO - usa let para almacenar el índice externo -->
@for (item of form.items; track $index; let outerIndex = $index) { @for (option of item.options;
track $index) {
<button (click)="removeOption(outerIndex, $index)">Remove</button>
} }
```

### Deshabilitar el botón del formulario

```html
<button [disabled]="form().invalid() || form().pending()" />
<!-- O -->
<button [disabled]="taxForm.invalid()" />
```

NO uses `[disabled]` en un input. `[formField]` se encargará de esto.
NO uses `[readonly]` en un input. `[formField]` se encargará de esto.
Si necesitas deshabilitar un campo o hacerlo readonly, usa las reglas `disabled()` o `readonly()` en el schema.

### Validación asíncrona

No uses `validate()` para lo asíncrono; en su lugar, usa `validateAsync()`:

**CRÍTICO**:

1. La opción `params` DEBE ser una función que devuelva el valor a validar.
2. El handler `onError` es **OBLIGATORIO** — ¡NO es opcional!

```ts
import {resource} from '@angular/core';
import {validateAsync} from '@angular/forms/signals';

userForm = form(this.userModel, (s) => {
  validateAsync(s.username, {
    // 1. DEBE ser una función - params recibe el contexto y devuelve el valor
    params: ({value}) => value(),

    // 2. Crea el resource - factory recibe un Signal
    factory: (username) =>
      resource({
        params: username, // Usa 'params' en resource()
        loader: async ({params: value}) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return value === 'taken';
        },
      }),

    // 3. Mapea el éxito a errores
    onSuccess: (isTaken) =>
      isTaken ? {kind: 'taken', message: 'Username is already taken'} : undefined,

    // 4. Maneja los errores - ¡ESTO ES OBLIGATORIO!
    onError: () => ({kind: 'error', message: 'Validation failed'}),
  });
});
```

**Ejemplos INCORRECTOS:**

```ts
// INCORRECTO - params debe ser una función
validateAsync(s.username, {
  params: s.username, // ERROR: debe ser ({ value }) => value()
  // ...
});

// INCORRECTO - falta onError (¡es obligatorio!)
validateAsync(s.username, {
  params: ({value}) => value(),
  factory: (username) => resource({/* ... */}),
  onSuccess: (result) => (result ? {kind: 'error'} : undefined),
  // ERROR: ¡falta 'onError', pero es obligatorio!
});
```

### Uso de resource

**CRÍTICO**: En el `resource()` de Angular, usa `params` para el signal de entrada.

```ts
// CORRECTO
resource({
  params: mySignal,
  loader: async ({params: value}) => {
    /* ... */
  },
});

// INCORRECTO
resource({
  request: mySignal, // ERROR: debería ser 'params'
  loader: async ({request}) => {
    /* ... */
  },
});
```

Usa `debounce()` para retrasar la sincronización entre la UI y el modelo.

```ts
import {debounce} from '@angular/forms/signals';

userForm = form(this.userModel, (s) => {
  // Retrasa las actualizaciones del modelo 300ms
  debounce(s.username, 300);
});
```

### Validación condicional

```ts
form(this.model, (path) => {
  applyWhen(
    path.name,
    ({value}) => value().first !== 'admin',
    (namePath) => {
      required(namePath.last);
      disabled(namePath.last, {when: ({valueOf}) => valueOf(path.locked)});
    },
  );
});
```

`applyWhen` pasa el path mapeado al primer argumento.
Si necesitas el campo padre, simplemente pásalo a `applyWhen`:

```ts
form(this.model, (path) => {
  applyWhen(
    path.cat,
    ({value}) => value().name !== 'admin',
    (catPath) => {
      required(catPath.age);
    },
  );
});
```

## Errores comunes (NO HAGAS ESTO)

| Escenario de error                  | INCORRECTO (error común)                      | CORRECTO (forma correcta)                                                               |
| :---------------------------------- | :-------------------------------------------- | :-------------------------------------------------------------------------------------- |
| **Acceso a flags**                  | `form.field.valid()`                          | `form.field().valid()`                                                                  |
| **Acceso al valor**                 | `form.field.value()`                          | `form.field().value()`                                                                  |
| **Establecer el valor**             | `form.field.set(x)`                           | Actualiza el signal del modelo: `this.model.update(...)`                                |
| **Flags de la raíz del formulario** | `form.invalid()`                              | `form().invalid()`                                                                      |
| **Doble llamada**                   | `form.field()()`                              | `form.field().value()`                                                                  |
| **Contexto de las reglas**          | `({ touched }) => touched()`                  | `({ state }) => state.touched()`                                                        |
| **Llamar a los paths**              | `applyWhen(p.foo, () => p.foo() === 'x')`     | `applyWhen(p.foo, ({ valueOf }) => valueOf(p.foo) === 'x')`                             |
| **Argumentos de applyWhen**         | `applyWhen(condition, () => {...})`           | `applyWhen(path, condition, schemaFn)` - necesita 3 argumentos                          |
| **Longitud del array**              | `form.items().length`                         | `form.items.length` (estructural)                                                       |
| **Array de selección múltiple**     | `<select multiple [formField]="form.labels">` | `<select multiple>` no está soportado. Usa un campo booleano + checkbox por cada opción |
| **Atributo readonly**               | `<input readonly [formField]>`                | Usa la regla `readonly()` en el schema                                                  |
| **Atributos min/max**               | `<input min="1" max="10">`                    | Usa las reglas `min()` y `max()` en el schema                                           |
| **Binding de value**                | `<input [value]="val">`                       | NO uses `[value]` con `[formField]` (el `value` estático en radio/checkbox está bien)   |
| **Callback de submit**              | `submit(form, () => { ... })`                 | `submit(form, async () => { ... })`                                                     |
| **Params asíncronos**               | `params: s.field`                             | `params: ({ value }) => value()`                                                        |
| **onError asíncrono**               | Omitir `onError`                              | `onError` es OBLIGATORIO en `validateAsync`                                             |
| **API de resource()**               | `request: signal`                             | `params: signal`                                                                        |
| **Argumentos de applyEach**         | `applyEach(s.items, (item, index) => ...)`    | `applyEach(s.items, (item) => ...)`                                                     |
| **@for anidado**                    | `$parent.$index`                              | Usa `let outerIndex = $index`                                                           |
| **Import de FormState**             | `import { FormState }`                        | `FormState` no existe, usa `FieldState`                                                 |
| **Null en el modelo**               | `signal({ name: null })`                      | `signal({ name: '' })` o `signal({ age: 0 })`                                           |
| **Sintaxis de validate**            | `validate(s.field, { value } => ...)`         | `validate(s.field, ({ value }) => ...)`                                                 |
| **Array de checkboxes**             | `[formField]="form.tags"` (string[])          | Los checkboxes SOLO hacen binding a `boolean`: un campo booleano por cada opción        |

## Ejemplo de formulario grande

### `src/app/app.ts`

```ts
import {Component, signal} from '@angular/core';
import {
  form,
  FormField,
  submit,
  required,
  email,
  min,
  hidden,
  applyEach,
  validate,
} from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  imports: [FormField],
  templateUrl: './app.html',
})
export class App {
  protected readonly model = signal({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
    },
    tripDetails: {
      destination: 'Mars',
      launchDate: '',
    },
    package: {
      tier: 'economy',
      extras: {wifi: false, gym: false},
    },
    companions: [] as Array<{name: string; relation: string}>,
  });

  protected readonly bookingForm = form(this.model, (s) => {
    required(s.personalInfo.firstName, {message: 'First name is required'});
    required(s.personalInfo.lastName, {message: 'Last name is required'});
    required(s.personalInfo.email, {message: 'Email is required'});
    email(s.personalInfo.email, {message: 'Invalid email address'});
    required(s.personalInfo.age, {message: 'Age is required'});
    min(s.personalInfo.age, 18, {message: 'Must be at least 18'});

    required(s.tripDetails.destination);
    required(s.tripDetails.launchDate);
    validate(s.tripDetails.launchDate, ({value}) => {
      const date = new Date(value());
      if (isNaN(date.getTime())) return undefined;
      const today = new Date();
      if (date < today) {
        return {kind: 'pastData', message: 'Launch date must be in the future'};
      }
      return undefined;
    });

    // valueOf se usa para acceder a los valores de otros campos en las reglas
    hidden(s.package.extras, {when: ({valueOf}) => valueOf(s.package.tier) === 'economy'});

    applyEach(s.companions, (companion) => {
      required(companion.name, {message: 'Companion name required'});
      required(companion.relation, {message: 'Relation required'});
    });
  });

  addCompanion() {
    this.model.update((m) => ({
      ...m,
      companions: [...m.companions, {name: '', relation: ''}],
    }));
  }

  removeCompanion(index: number) {
    this.model.update((m) => ({
      ...m,
      companions: m.companions.filter((_, i) => i !== index),
    }));
  }

  onSubmit() {
    // CRÍTICO: el callback de submit DEBE ser async
    submit(this.bookingForm, async () => {
      console.log('Booking Confirmed:', this.model());
      // Si necesitas hacer trabajo asíncrono:
      // await this.apiService.save(this.model());
    });
  }
}
```

### `src/app/app.html`

```html
<form (submit)="onSubmit(); $event.preventDefault()">
  <h1>Interstellar Booking</h1>

  <section>
    <h2>Personal Info</h2>

    <label>
      First Name
      <input [formField]="bookingForm.personalInfo.firstName" />
      @if (bookingForm.personalInfo.firstName().touched() &&
      bookingForm.personalInfo.firstName().errors().length) {
      <span>{{ bookingForm.personalInfo.firstName().errors()[0].message }}</span>
      }
    </label>

    <label>
      Last Name
      <input [formField]="bookingForm.personalInfo.lastName" />
      @if (bookingForm.personalInfo.lastName().touched() &&
      bookingForm.personalInfo.lastName().errors().length) {
      <span>{{ bookingForm.personalInfo.lastName().errors()[0].message }}</span>
      }
    </label>

    <label>
      Email
      <input type="email" [formField]="bookingForm.personalInfo.email" />
      @if (bookingForm.personalInfo.email().touched() &&
      bookingForm.personalInfo.email().errors().length) {
      <span>{{ bookingForm.personalInfo.email().errors()[0].message }}</span>
      }
    </label>

    <label>
      Age
      <input type="number" [formField]="bookingForm.personalInfo.age" />
      @if (bookingForm.personalInfo.age().touched() &&
      bookingForm.personalInfo.age().errors().length) {
      <span>{{ bookingForm.personalInfo.age().errors()[0].message }}</span>
      }
    </label>
  </section>

  <section>
    <h2>Trip Details</h2>

    <label>
      Destination
      <select [formField]="bookingForm.tripDetails.destination">
        <option value="Mars">Mars</option>
        <option value="Moon">Moon</option>
        <option value="Titan">Titan</option>
      </select>
    </label>

    <label>
      Launch Date
      <input type="date" [formField]="bookingForm.tripDetails.launchDate" />
      @if (bookingForm.tripDetails.launchDate().touched() &&
      bookingForm.tripDetails.launchDate().errors().length) {
      <span>{{ bookingForm.tripDetails.launchDate().errors()[0].message }}</span>
      }
    </label>
  </section>

  <section>
    <h2>Package</h2>

    <label>
      <input type="radio" value="economy" [formField]="bookingForm.package.tier" />
      Economy
    </label>
    <label>
      <input type="radio" value="business" [formField]="bookingForm.package.tier" />
      Business
    </label>
    <label>
      <input type="radio" value="first" [formField]="bookingForm.package.tier" />
      First Class
    </label>

    @if (!bookingForm.package.extras().hidden()) {
    <div>
      <h3>Extras</h3>
      <!-- Opciones múltiples: un campo booleano por opción, vinculado a un checkbox -->
      <label>
        <input type="checkbox" [formField]="bookingForm.package.extras.wifi" />
        WiFi
      </label>
      <label>
        <input type="checkbox" [formField]="bookingForm.package.extras.gym" />
        Gym
      </label>
    </div>
    }
  </section>

  <section>
    <h2>Companions</h2>
    <button type="button" (click)="addCompanion()">Add Companion</button>

    @for (companion of bookingForm.companions; track $index) {
    <div>
      <input [formField]="companion.name" placeholder="Name" />
      @if (companion.name().touched() && companion.name().errors().length) {
      <span>{{ companion.name().errors()[0].message }}</span>
      }

      <input [formField]="companion.relation" placeholder="Relation" />
      @if (companion.relation().touched() && companion.relation().errors().length) {
      <span>{{ companion.relation().errors()[0].message }}</span>
      }

      <button type="button" (click)="removeCompanion($index)">Remove</button>
    </div>
    }
  </section>

  <button [disabled]="bookingForm().invalid()">Submit</button>
</form>
```

## Recuperación ante errores de build

Si encuentras errores de build, estas son las correcciones más comunes:

### `Property 'value' does not exist on type 'FieldTree'`

**Problema**: Acceder a `.value()` directamente en un campo sin llamarlo primero.

```ts
// INCORRECTO
const val = this.form.field.value();
// CORRECTO
const val = this.form.field().value();
```

### `Property 'set' does not exist on type 'FieldTree'`

**Problema**: Intentar establecer valores en el árbol del formulario. Los Signal Forms están basados en el modelo.

```ts
// INCORRECTO
this.form.address.street.set('Main St');
// CORRECTO - actualiza el signal del modelo en su lugar
this.model.update((m) => ({...m, address: {...m.address, street: 'Main St'}}));
```

### `Type 'string[]' is not assignable to type 'string'`

**Problema**: Hacer binding de `[formField]` a un campo de tipo array con un `<select>`. El control nativo `<select>` solo soporta un único valor string, y `<select multiple>` no está soportado por `[formField]`.

```html
<!-- INCORRECTO - assignees es string[], select espera string -->
<select [formField]="form.assignees">
  ...
</select>

<!-- TAMBIÉN INCORRECTO - <select multiple> no está soportado por [formField] -->
<select multiple [formField]="form.assignees">
  ...
</select>

<!-- CORRECTO - Modela cada opción como su propio campo booleano, vinculado a un checkbox (ver abajo) -->
```

### `NG8022: Setting the 'readonly/min/max/value' attribute is not allowed`

**Problema**: Conflicto entre los atributos HTML y la directiva `[formField]`.

```html
<!-- INCORRECTO -->
<input [formField]="form.age" min="18" max="99" />
<input [formField]="form.name" [value]="'John'" />

<!-- CORRECTO - Usa reglas en el schema -->
min(s.age, 18); max(s.age, 99); // Luego simplemente:
<input [formField]="form.age" />
```

### `TS2322: Type 'string[]' is not assignable to type 'boolean'`

**Problema**: Hacer binding de un checkbox a un campo de tipo array en lugar de a un campo booleano.

```html
<!-- INCORRECTO - tags es string[] -->
<input type="checkbox" [formField]="form.tags" />

<!-- CORRECTO - Mapea cada opción a un campo booleano en el modelo -->
protected readonly model = signal({ hasWifi: false, hasGym: false });
<input type="checkbox" [formField]="form.hasWifi" />
<input type="checkbox" [formField]="form.hasGym" />
```

### `Expected 3 arguments, but got 2` para applyWhen

**Problema**: Falta el argumento del path en `applyWhen`.

```ts
// INCORRECTO
applyWhen(isJoint, () => { ... });

// CORRECTO - applyWhen(path, condition, schemaFn)
applyWhen(s.spouse, ({valueOf}) => valueOf(s.status) === 'joint', (spousePath) => {
  required(spousePath.name);
});
```

### `Module has no exported member 'FormState'`

**Problema**: Importar un tipo que no existe.

```ts
// INCORRECTO
import {FormState} from '@angular/forms/signals';

// FormState no existe. Si necesitas acceso al tipo, la instancia del
// formulario proporciona todo el estado necesario mediante field().valid(), etc.
```

### `No pipe found with name 'number'` / `'json'` / `'date'`

**Problema**: Usar pipes en los templates.

```html
<!-- INCORRECTO -->
{{ totalPrice() | number:'1.2-2' }}

<!-- CORRECTO - formatea en el componente -->
protected readonly totalPriceFormatted = computed(() => this.totalPrice().toFixed(2));
<!-- luego: -->
{{ totalPriceFormatted() }}
```

### `$parent.$index` en bucles @for anidados

**Problema**: Angular no tiene `$parent`.

```html
<!-- INCORRECTO -->
@for (item of items; track $index) { @for (sub of item.subs; track $index) {
<button (click)="remove($parent.$index, $index)">X</button>
} }

<!-- CORRECTO -->
@for (item of items; track $index; let outerIdx = $index) { @for (sub of item.subs; track $index) {
<button (click)="remove(outerIdx, $index)">X</button>
} }
```
