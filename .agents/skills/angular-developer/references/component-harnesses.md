# Testing con Component Harnesses

Los component harnesses son la forma estándar y preferida de interactuar con componentes en los tests. Proporcionan una API robusta y centrada en el usuario que hace que los tests sean menos frágiles y más fáciles de leer, al aislarlos de los cambios en la estructura interna del DOM de un componente.

## ¿Por qué usar harnesses?

- **Robustez:** Los tests no se rompen cuando refactorizas el HTML interno o las clases CSS de un componente.
- **Legibilidad:** Los tests describen las interacciones desde la perspectiva del usuario (p. ej., `button.click()`, `slider.getValue()`) en lugar de hacerlo mediante consultas al DOM (`fixture.nativeElement.querySelector(...)`).
- **Reutilización:** El mismo harness puede usarse tanto en unit tests como en tests E2E.

Angular Material proporciona un test harness para cada componente de su librería.

## Uso de un harness en un unit test

`TestbedHarnessEnvironment` es el punto de entrada para usar harnesses en unit tests.

### Ejemplo: Testing con un `MatButtonHarness`

```ts
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MyButtonContainerComponent} from './my-button-container.component';

describe('MyButtonContainerComponent', () => {
  let fixture: ComponentFixture<MyButtonContainerComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(MyButtonContainerComponent);
    // Crea un harness loader para el fixture del componente
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should find a button with specific text', async () => {
    // Carga el harness para un MatButton con el texto "Submit"
    const submitButton = await loader.getHarness(MatButtonHarness.with({text: 'Submit'}));

    // Usa la API del harness para interactuar con el componente
    expect(await submitButton.isDisabled()).toBe(false);
    await submitButton.click();

    // ... aserciones
  });
});
```

### Conceptos clave

1.  **`HarnessLoader`**: Un objeto usado para encontrar y crear instancias de harness. Obtén un loader para el fixture de tu componente usando `TestbedHarnessEnvironment.loader(fixture)`.

2.  **`loader.getHarness(HarnessClass)`**: Encuentra y devuelve de forma asíncrona una instancia de harness para el primer componente que coincida.

3.  **`HarnessClass.with({ ... })`**: Muchos harnesses proporcionan un método estático `with` que devuelve un `HarnessPredicate`. Esto te permite filtrar y encontrar componentes según sus propiedades, como el texto, el selector o el estado deshabilitado. Úsalo siempre para apuntar con precisión al componente que quieres testear.

4.  **API del harness:** Una vez que tienes una instancia de harness, usa sus métodos (p. ej., `.click()`, `.getText()`, `.getValue()`) para interactuar con el componente. Estos métodos manejan automáticamente la espera de operaciones asíncronas y la change detection.
