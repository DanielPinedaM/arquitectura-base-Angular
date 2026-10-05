# Fundamentos de testing

Esta guía cubre los principios y prácticas fundamentales para escribir unit tests en este repositorio, que usa Vitest como test runner.

## Filosofía principal: zoneless y async-first

Este proyecto sigue un enfoque de testing moderno y zoneless. Los cambios de estado programan actualizaciones de forma asíncrona, y los tests deben tenerlo en cuenta.

**NO** uses `fixture.detectChanges()` para disparar actualizaciones manualmente.
Usa **SIEMPRE** el patrón "Act, Wait, Assert":

1.  **Act:** Actualiza el estado o realiza una acción (p. ej., establecer un input del componente, hacer clic en un botón).
2.  **Wait:** Usa `await fixture.whenStable()` para permitir que el framework procese la actualización programada y renderice los cambios.
3.  **Assert:** Verifica el resultado.

### Ejemplo de estructura básica de un test

```ts
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MyComponent} from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let h1: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // Crea el fixture del componente
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    h1 = fixture.nativeElement.querySelector('h1');
  });

  it('should display the default title', async () => {
    // ACT: (Implícito) El componente se crea con el estado por defecto.
    // WAIT a que se complete el data binding inicial.
    await fixture.whenStable();
    // ASSERT sobre el estado inicial.
    expect(h1.textContent).toContain('Default Title');
  });

  it('should display a different title after a change', async () => {
    // ACT: Cambia la propiedad title del componente.
    component.title.set('New Test Title');

    // WAIT a que se complete la actualización asíncrona.
    await fixture.whenStable();

    // ASSERT que el DOM se haya actualizado.
    expect(h1.textContent).toContain('New Test Title');
  });
});
```

## TestBed y ComponentFixture

- **`TestBed`**: La utilidad principal para crear un módulo de Angular específico para el test. Usa `TestBed.configureTestingModule({...})` en tu `beforeEach` para declarar componentes, proveer servicios y configurar los imports necesarios para tu test.
- **`ComponentFixture`**: Un handle sobre la instancia del componente creado y su entorno.
  - `fixture.componentInstance`: Accede a la instancia de la clase del componente.
  - `fixture.nativeElement`: Accede al elemento raíz del DOM del componente.
  - `fixture.debugElement`: Un wrapper específico de Angular alrededor del `nativeElement` que proporciona formas más seguras e independientes de la plataforma de consultar el DOM (p. ej., `debugElement.query(By.css('p'))`).
