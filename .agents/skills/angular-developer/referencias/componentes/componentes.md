# Componentes

Los componentes de Angular son los bloques de construcción fundamentales de una aplicación. Cada componente consta de una clase TypeScript con comportamientos, un template HTML y un selector CSS.

## Definición de un componente

Usa el decorador `@Component` para definir la metadata de un componente.

```ts
@Component({
  selector: 'app-profile',
  template: `
    <img src="profile.jpg" alt="Profile photo" />
    <button (click)="save()">Save</button>
  `,
  styles: `
    img {
      border-radius: 50%;
    }
  `,
})
export class Profile {
  save() {
    /* ... */
  }
}
```

## Opciones de metadata

- `selector`: El selector CSS que identifica a este componente en los templates.
- `template`: Template HTML inline (preferido para templates pequeños).
- `templateUrl`: Ruta a un archivo HTML externo.
- `styles`: Estilos CSS inline.
- `styleUrl` / `styleUrls`: Ruta(s) a archivo(s) CSS externo(s).
- `imports`: Lista los componentes, directivas o pipes usados en el template de este componente.

## Uso de componentes

Para usar un componente, agrégalo al array `imports` del componente que lo consume y usa su selector en el template.

```ts
@Component({
  selector: 'app-root',
  imports: [Profile],
  template: `<app-profile />`,
})
export class App {}
```

### Etiquetas de autocierre

Angular soporta etiquetas de autocierre para componentes personalizados.

**Regla:** Usa siempre etiquetas de autocierre cuando un componente no contenga contenido proyectado ni nodos hijos:

```html
<!-- Preferido: conciso y moderno -->
<app-profile />
<app-user-card [user]="currentUser()" />
<router-outlet />

<!-- Evitar: etiquetas de cierre redundantes para elementos vacíos -->
<app-profile></app-profile>
<app-user-card [user]="currentUser()"></app-user-card>
<router-outlet></router-outlet>
```

## Control flow del template

Angular usa bloques integrados para el renderizado condicional y los bucles.

### Renderizado condicional (`@if`)

Usa `@if` para mostrar contenido de forma condicional. Puedes incluir bloques `@else if` y `@else`.

```html
@if (user.isAdmin) {
<admin-dashboard />
} @else if (user.isModerator) {
<mod-dashboard />
} @else {
<standard-dashboard />
}
```

**Alias del resultado**: Guarda el resultado de la expresión para reutilizarlo.

```html
@if (user.settings(); as settings) {
<p>Theme: {{ settings.theme }}</p>
}
```

### Bucles (`@for`)

El bloque `@for` itera sobre colecciones. La expresión `track` es **obligatoria** para el rendimiento y la reutilización del DOM.

```html
<ul>
  @for (item of items(); track item.id; let i = $index, total = $count) {
  <li>{{ i + 1 }}/{{ total }}: {{ item.name }}</li>
  } @empty {
  <li>No items to display.</li>
  }
</ul>
```

**Variables implícitas**: `$index`, `$count`, `$first`, `$last`, `$even`, `$odd`.

### Alternar contenido (`@switch`)

El bloque `@switch` renderiza contenido según un valor. Usa igualdad estricta (`===`) y **no tiene fallthrough**.

```html
@switch (status()) { @case ('loading') { <app-spinner /> } @case ('error') { <app-error-msg /> }
@case ('success') { <app-data-grid /> } @default {
<p>Unknown status</p>
} }
```

**Verificación exhaustiva de tipos**: Usa `@default never;` para asegurar que se manejen todos los casos de un union type.

```html
@switch (state) { @case ('on') { ... } @case ('off') { ... } @default never; // Da error si se agrega un nuevo
estado como 'standby' }
```

## Conceptos principales

- **Host Element**: El elemento del DOM que coincide con el selector del componente.
- **View**: El DOM renderizado por el template del componente dentro del host element.
- **Standalone**: Por defecto, los componentes son standalone (desde Angular 19, `standalone: true` es el valor por defecto). Para versiones anteriores, `standalone: true` debe ser explícito o el componente debe formar parte de un `NgModule`.
- **Árbol de componentes**: Las aplicaciones de Angular se estructuran como un árbol de componentes, donde cada componente puede alojar componentes hijos.
- **Nomenclatura de componentes**: No agregues sufijos el sufijo `Component` para las clases de componentes (p. ej., AppComponent) a menos que el proyecto haya sido configurado para usar esa configuración de nomenclatura.
