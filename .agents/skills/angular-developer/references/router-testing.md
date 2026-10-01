# Testing con RouterTestingHarness

Al testear componentes que involucran routing, es crucial **no hacer mock del Router ni de los servicios relacionados**. En su lugar, usa `RouterTestingHarness`, que proporciona una forma robusta y confiable de testear la lógica de routing en un entorno que refleja fielmente una aplicación real.

Usar el harness asegura que estás testeando la configuración real del router, los guards y los resolvers, lo que da lugar a tests más significativos.

## Configuración para el testing del router

`RouterTestingHarness` es la herramienta principal para testear escenarios de routing. También necesitas proveer tus rutas de test usando la función `provideRouter` en tu configuración de `TestBed`.

### Ejemplo de configuración

```ts
import {TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {Dashboard} from './dashboard.component';
import {HeroDetail} from './hero-detail.component';

describe('Dashboard Component Routing', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    // 1. Configura TestBed con las rutas de test
    TestBed.configureTestingModule({
      providers: [
        // Usa provideRouter con tus rutas específicas para el test
        provideRouter([
          {path: '', component: Dashboard},
          {path: 'heroes/:id', component: HeroDetail},
        ]),
      ],
    });

    // 2. Crea el RouterTestingHarness
    harness = await RouterTestingHarness.create();
  });
});
```

### Conceptos clave

1.  **`provideRouter([...])`**: Provee una configuración de routing específica para el test. Debe incluir las rutas necesarias para que el componente bajo test funcione correctamente.
2.  **`RouterTestingHarness.create(initialUrl?)`**: Crea el harness de forma asíncrona y, opcionalmente, realiza una navegación inicial.

## Escribir tests del router

Una vez creado el harness, puedes usarlo para dirigir la navegación y hacer aserciones sobre el estado del router y de los componentes activados.

### Ejemplo: Testing de la navegación

```ts
it('should navigate to a hero detail when a hero is selected', async () => {
  // 1. Navega al componente inicial y obtén su instancia
  const dashboard = await harness.navigateByUrl('/', Dashboard);

  // Supongamos que el dashboard tiene un método para seleccionar un hero
  const heroToSelect = {id: 42, name: 'Test Hero'};
  dashboard.selectHero(heroToSelect);

  // Espera la estabilidad después de la acción que dispara la navegación
  await harness.fixture.whenStable();

  // 2. Haz aserciones sobre la URL
  const router = TestBed.inject(Router);
  expect(router.url).toEqual('/heroes/42');

  // 3. Obtén el componente activado después de la navegación
  const heroDetail = harness.routeDebugElement?.componentInstance as HeroDetail;

  // 4. Haz aserciones sobre el estado del nuevo componente
  expect(heroDetail.hero.name).toBe('Test Hero');
});

it('should get the activated component directly', async () => {
  // Navega y obtén la instancia del componente en un solo paso
  const dashboardInstance = await harness.navigateByUrl('/', Dashboard);

  expect(dashboardInstance).toBeInstanceOf(Dashboard);
});
```

### Buenas prácticas

- **Navega con el harness:** Usa siempre `harness.navigateByUrl()` para simular la navegación. Este método devuelve una promise que se resuelve con la instancia del componente activado.
- **Accede al estado del router:** Inyecta `Router` desde `TestBed` para inspeccionar el estado actual del router.
- **Obtén los componentes activados:** Usa el componente devuelto por `navigateByUrl(url, ComponentType)`. Después de una navegación iniciada por la aplicación, lee `harness.routeDebugElement?.componentInstance`.
- **Espera la estabilidad:** Después de realizar una acción que provoque una navegación, haz siempre `await harness.fixture.whenStable()` para asegurar que el routing se haya completado antes de hacer aserciones.
