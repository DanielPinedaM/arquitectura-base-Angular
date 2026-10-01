# Creación y uso de servicios

Los servicios en Angular son piezas de código reutilizables que manejan la obtención de datos, la lógica de negocio o la gestión del estado a las que múltiples componentes u otros servicios necesitan acceder.

## Crear un servicio

Puedes generar un servicio usando Angular CLI:

```bash
ng generate service my-data
```

O puedes crear manualmente una clase TypeScript y decorarla con `@Service()`. Para la gestión reactiva del estado, almacena los datos en un `signal()` privado y exponlo públicamente mediante `.asReadonly()`:

```ts
import {Service, signal} from '@angular/core';

@Service()
export class BasicDataStore {
  private readonly dataSignal = signal<string[]>([]);

  // Expone el estado como un signal de solo lectura para evitar la mutación externa directa
  readonly data = this.dataSignal.asReadonly();

  addData(item: string): void {
    this.dataSignal.update((items) => [...items, item]);
  }
}
```

### El decorador `@Service`

Usar `@Service` es el enfoque recomendado para la mayoría de los servicios. Le indica a Angular que:

- **Cree una única instancia (singleton)** para toda la aplicación.
- **La haga disponible en todas partes** automáticamente, sin necesidad de listarla en ningún array `providers`.
- **Habilite el tree-shaking**, lo que significa que el servicio solo se incluye en el bundle final de JavaScript si realmente se inyecta en algún lugar.

#### La opción `autoProvided`

Si no quieres crear un singleton de tu servicio, puedes establecer `@Service({autoProvided: false})` y declarar el servicio en un array `providers`.

## Inyectar un servicio

Una vez creado un servicio, puedes inyectarlo en componentes, directivas u otros servicios usando la función `inject()`.

### Inyectar en un componente

```ts
import {Component, inject} from '@angular/core';
import {BasicDataStore} from './basic-data-store.service';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>Data items: {{ dataStore.data().length }}</p>
      <button (click)="dataStore.addData('New Item')">Add Item</button>
    </div>
  `,
})
export class Example {
  // Inyecta el servicio como un campo de clase
  readonly dataStore = inject(BasicDataStore);
}
```

### Inyectar en otro servicio

Los servicios pueden inyectar otros servicios exactamente de la misma manera. Usa `computed()` para derivar valores de los servicios inyectados de forma reactiva:

```ts
import {Service, computed, inject, signal} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store.service';

@Service()
export class CombinedDataStore {
  // Inyectando otro servicio
  private readonly advancedDataStore = inject(AdvancedDataStore);
  private readonly dataSignal = signal<string[]>([]);

  // Combina el estado reactivo de este servicio y del servicio inyectado
  readonly allData = computed(() => [...this.dataSignal(), ...this.advancedDataStore.data()]);
}
```

## Patrones avanzados de servicios

Aunque `@Service` cubre la mayoría de los escenarios, a veces puedes necesitar:

- **Instancias específicas de un componente**: Si un componente necesita su propia instancia aislada de un servicio, provéela directamente en el array `@Component({ providers: [MyService] })` del componente y establece la opción `autoProvided: false`: `@Service({autoProvided: false})`
- **Factory providers**: Para la creación dinámica.
- **Value providers**: Para inyectar objetos de configuración.
