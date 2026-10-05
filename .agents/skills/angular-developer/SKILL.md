---
name: angular-developer
description: Genera código Angular y proporciona orientación arquitectónica. Se activa al crear proyectos, componentes, servicios o comunicación HTTP, o para buenas prácticas sobre reactividad (signals, linkedSignal, resource, httpResource), formularios, inyección de dependencias, routing, SSR, accesibilidad (ARIA), animaciones, estilos (estilos de componentes), testing, convenciones de nomenclatura o herramientas del CLI.
---

# Reglas para desarrolladores de Angular

## Resumen

Genera código Angular y proporciona orientación arquitectónica y buenas prácticas de Angular.

## ¿Cuándo aplicar la skill?

Consulta estas reglas cuando:

- Crees proyectos, componentes, servicios o comunicación HTTP
- Necesites buenas prácticas sobre reactividad (signals, linkedSignal, resource, httpResource), formularios, inyección de dependencias, routing, SSR, accesibilidad (ARIA), animaciones, estilos (estilos de componentes), testing, convenciones de nomenclatura o herramientas del CLI

## Reglas generales

1. Analiza siempre la versión de Angular del proyecto antes de dar orientación, ya que las buenas prácticas y las funcionalidades disponibles pueden variar significativamente entre versiones. Si creas un nuevo proyecto con Angular CLI, no especifiques una versión a menos que el usuario lo solicite.

2. Al generar código, sigue la guía de estilo y las buenas prácticas de Angular para la mantenibilidad y el rendimiento. Usa Angular CLI para hacer scaffolding de componentes, servicios, directivas, pipes y rutas para asegurar la consistencia.

3. Una vez que termines de generar código, ejecuta `ng build` para asegurar que no haya errores de build. Si hay errores, analiza los mensajes de error y corrígelos antes de continuar. No omitas este paso, ya que es crítico para asegurar que el código generado sea correcto y funcional.

## ¿Cómo Leer la Skill?

Lee **bajo demanda** los archivos `.md` ubicados en [`.agents/skills/angular-developer/referencias/`](referencias/): usa la [Tabla de Contenido](#tabla-de-contenido) como referencia para inferir cuáles archivos son necesarios para la tarea que estás resolviendo, y accede únicamente a esos archivos.

**Razón**: leer todos los archivos consume contexto y tokens innecesariamente.

Para decidir qué archivo leer, usa la columna **¿Cuándo leerlo?**: abre el archivo cuando tu tarea coincida con la situación que describe.

## Tabla de Contenido

### [Creación de nuevos proyectos](referencias/creacion-de-nuevos-proyectos/)

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Creación de nuevos proyectos](referencias/creacion-de-nuevos-proyectos/creacion-de-nuevos-proyectos.md) | Al crear un proyecto nuevo de Angular con `ng new`: reglas por defecto cuando el usuario no da lineamientos (última versión estable, Signal Forms) y cómo elegir el comando según la versión pedida (`npx @angular/cli@<requested_version> new`, `ng new` si `ng version` funciona, o `npx @angular/cli@latest new`). |

### [Componentes](referencias/componentes/)

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Componentes](referencias/componentes/componentes.md) | Al crear o modificar un componente de Angular (decorador `@Component` y su metadata: `selector`, `template`, `templateUrl`, `styles`, `imports`), o al escribir su template con control flow (`@if`/`@else`, `@for` con `track` y `@empty`, `@switch` con `@default never`) y etiquetas de autocierre (`<app-profile />`): fundamentos, anatomía y conceptos principales (host element, view, standalone). |
| [Inputs](referencias/componentes/inputs.md) | Al pasar datos de un componente padre a un hijo: declarar inputs con `input()` e `input.required()`, con alias y transforms (`booleanAttribute`), crear two-way binding con `model()` y `[(value)]`, o migrar desde el decorador legacy `@Input()`. |
| [Outputs (eventos personalizados)](referencias/componentes/outputs.md) | Al emitir eventos personalizados desde un componente hijo hacia el padre: declarar outputs con `output()` (`OutputEmitterRef`, `emit()`), escucharlos con `(evento)` y `$event`, usar alias, suscribirse de forma programática en componentes dinámicos o migrar desde `@Output()` con `EventEmitter`; incluye la nomenclatura de los eventos (sin el prefijo `on`). |
| [Host Elements de componentes](referencias/componentes/host-elements.md) | Al hacer binding de atributos, clases, estilos, propiedades o eventos sobre el elemento host de un componente (propiedad `host` del decorador `@Component`), al reemplazar `@HostBinding` o `@HostListener`, al resolver colisiones de bindings o al leer atributos estáticos del host con `inject(new HostAttributeToken(...))`. |
| [Convenciones de nomenclatura de Angular (guía de estilo de Angular v20+)](referencias/componentes/convenciones-de-nomenclatura.md) | Antes de crear, nombrar o renombrar archivos y clases de componentes, servicios, directivas, pipes o modelos (con o sin sufijos como `.component.ts`, `.service.ts`, `Component` o `Service`), o al organizar las carpetas `core/`, `features/` y `shared/`: convenciones de nomenclatura de Angular v20+ («Intent over Role»), que primero respetan el estilo que ya usa el proyecto. |

Si necesitas documentación más profunda que no se encuentre en las referencias anteriores, busca sobre componentes en la [documentación oficial de Angular](https://angular.dev/guide/components) con la tool `search_documentation` del MCP server `angular-cli`.

### [Reactividad y gestión de datos](referencias/reactividad-y-gestion-de-datos/)

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Visión general de Angular Signals](referencias/reactividad-y-gestion-de-datos/vision-general-de-signals.md) | Al crear o leer estado reactivo con signals en Angular: `signal()` con `.set()` y `.update()`, exponerlo como readonly con `asReadonly()`, derivar valores con `computed()`, entender los contextos reactivos, leer sin rastrear con `untracked()` o leer los signals antes de un `await` dentro de un effect asíncrono. |
| [Estado dependiente con `linkedSignal`](referencias/reactividad-y-gestion-de-datos/linked-signal.md) | Al crear estado que toma su valor inicial de otro signal o de un input, pero que el usuario puede cambiar después (por ejemplo, una opción seleccionada por defecto que debe reiniciarse o conservarse cuando cambia la lista, con `source` y `computation`), o al dudar entre `computed`, `linkedSignal` y `effect` para sincronizar estado. |
| [Reactividad asíncrona con `resource`](referencias/reactividad-y-gestion-de-datos/resource.md) | Al obtener datos asíncronos que dependen de signals y exponerlos como signals con `resource()` (`params`, `loader` con `abortSignal`, `reload()`, `value()`, `hasValue()`, `isLoading()`, `error()`, `status()`, actualización optimista con `value.set()`) sin usar `HttpClient`; con `HttpClient` se prefiere `httpResource`. |
| [Efectos secundarios con `effect` y `afterRenderEffect`](referencias/reactividad-y-gestion-de-datos/effects.md) | Al sincronizar signals con APIs imperativas (logging de analytics, `localStorage`, dibujar en un `<canvas>` o en una librería de gráficos), al manipular el DOM después del render con `afterRenderEffect` y sus fases (`earlyRead`, `write`, `read`), o cuando ves `.set()` dentro de un `effect()` para mantener dos signals sincronizados (un anti-pattern que provoca `ExpressionChangedAfterItHasBeenChecked`). |

### [Comunicación HTTP](referencias/comunicacion-http/)

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Comunicación HTTP con `HttpClient` y `httpResource`](referencias/comunicacion-http/http-client.md) | Al comunicarte con un backend desde Angular: configurar `provideHttpClient` con `withInterceptors`, encapsular las llamadas de `HttpClient` en servicios (Observables fríos, `HttpErrorResponse`, `HttpHeaders` y `HttpParams`), escribir interceptors funcionales, configurar la protección XSRF o leer datos con `httpResource` (`hasValue()`, `parse`, `httpResource.text` y `httpResource.blob`). |

### [Formularios](referencias/formularios/)

En la mayoría de los casos, para aplicaciones nuevas, **prefiere signal forms**. Al tomar una decisión sobre formularios, analiza el proyecto y considera las siguientes reglas:

- Si la aplicación usa v22 o una versión posterior y se trata de un formulario nuevo, **prefiere Signal Forms**.
- Para aplicaciones más antiguas o al trabajar con formularios existentes, usa el tipo de formulario adecuado que coincida con la estrategia de formularios actual de la aplicación.

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Signal Forms](referencias/formularios/signal-forms.md) | Al crear, validar o depurar un formulario con Signal Forms (`@angular/forms/signals`), la opción preferida para formularios nuevos: `form()` sobre un modelo `signal`, validators y reglas en la schema function (`required`, `email`, `min`, `validate`, `validateAsync`, `validateStandardSchema`, `disabled`, `hidden`, `readonly`, `applyWhen`, `applyEach`, `debounce`), binding con `[formField]`, estado con `field().valid()`, `submit()` con un callback `async`, o al corregir errores de build como `Property 'value' does not exist on type 'FieldTree'` o `NG8022`. |
| [Template-Driven Forms](referencias/formularios/template-driven-forms.md) | Al trabajar con un formulario existente basado en `FormsModule` y `[(ngModel)]` (con `name` obligatorio, `#userForm="ngForm"`, `NgModelGroup`, `(ngSubmit)`, las clases `ng-touched`, `ng-dirty` y `ng-valid`, y `reset()`), o cuando la estrategia de formularios de la app es template-driven para formularios simples. |
| [Reactive Forms](referencias/formularios/reactive-forms.md) | Al trabajar con un formulario existente basado en `ReactiveFormsModule` (`FormControl`, `FormGroup`, `FormArray`, `FormBuilder` o `NonNullableFormBuilder`, `[formGroup]`, `formControlName`, `formArrayName`, `patchValue()`, `setValue()`, el observable `events`, `markAllAsTouched()`), o cuando la estrategia de formularios de la app es reactive forms para formularios complejos. |

### [Inyección de dependencias](referencias/inyeccion-de-dependencias/)

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Fundamentos de la inyección de dependencias (DI)](referencias/inyeccion-de-dependencias/fundamentos-de-di.md) | Al empezar con la inyección de dependencias en Angular: qué significa proveer e inyectar, crear un servicio singleton con `@Service()`, solicitar dependencias con `inject()` y en qué lugares se puede llamar (inicializadores de campos, constructor, guards funcionales, factory functions). |
| [Creación y uso de servicios](referencias/inyeccion-de-dependencias/creacion-de-servicios.md) | Al crear un servicio con `ng generate service` o con `@Service()`, guardar su estado en un `signal()` privado expuesto con `.asReadonly()`, inyectarlo en componentes u otros servicios con `inject()` y derivar estado con `computed()`, o cuando un componente necesita su propia instancia con `@Service({autoProvided: false})` en `providers`. |
| [Definición de dependency providers](referencias/inyeccion-de-dependencias/definicion-de-providers.md) | Al registrar dependencias de forma automática o manual: `providedIn: 'root'`, `InjectionToken` para valores que no son clases (configuración, funciones), el array `providers` con `useClass`, `useValue`, `useFactory`, `useExisting` y `multi`, los scopes de los providers (aplicación, componente, ruta) o funciones `provide*` para librerías. |
| [Injection Context](referencias/inyeccion-de-dependencias/injection-context.md) | Cuando `inject()` lanza un error por usarse fuera de un injection context (por ejemplo, dentro de un método o de un callback), cuando necesitas inyectar dependencias de forma dinámica con `runInInjectionContext` y un `EnvironmentInjector`, o al escribir funciones utilitarias que usan `inject()` y deben validar el contexto con `assertInInjectionContext`. |
| [Hierarchical Injectors](referencias/inyeccion-de-dependencias/hierarchical-injectors.md) | Al entender o depurar cómo Angular resuelve una dependencia (`EnvironmentInjector` frente a `ElementInjector`), al usar modificadores de `inject()` (`optional`, `self`, `skipSelf`, `host`) o al decidir entre `providers` y `viewProviders` para aislar un servicio del contenido proyectado. |

### [Pipes](referencias/pipes/)

Al formatear valores en templates, crear pipes personalizados o reutilizar lógica similar a la de un pipe en TypeScript, consulta la siguiente referencia. Prefiere pipes en los templates; fuera de los templates, evita inyectar clases de pipes solo para llamar a `transform()`.

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Pipes](referencias/pipes/pipes.md) | Al formatear valores en templates con pipes integrados (`DatePipe`, `CurrencyPipe`, `DecimalPipe`, `PercentPipe`), al crear un pipe personalizado (`@Pipe`, `PipeTransform`, nombre en camelCase, `pure: false`) o cuando necesitas la lógica de un pipe en TypeScript sin inyectar la clase del pipe (`formatDate`, `formatCurrency` o `formatNumber` con `LOCALE_ID`, o una función extraída). |

### [Angular Aria](referencias/angular-aria/)

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Angular Aria](referencias/angular-aria/angular-aria.md) | Al construir componentes personalizados accesibles (headless) de tipo Accordion, Listbox, Combobox, Select o Multiselect, Menu o Menubar, Tabs, Toolbar, Tree o Grid con `@angular/aria` (directivas `ngAccordionGroup`, `ngListbox`, `ngCombobox`, `ngMenu`, `ngTabs`, `ngToolbar`, `ngTree`, `ngGrid`), al darles estilo con CSS sobre los atributos ARIA (`aria-expanded`, `aria-selected`), al testearlos con sus harnesses o al integrarlos con Signal Forms mediante `[formField]`. |

### [Routing](referencias/routing/)

Si necesitas documentación más profunda o más contexto, busca sobre routing en la [documentación oficial de Angular](https://angular.dev/guide/routing) con la tool `search_documentation` del MCP server `angular-cli`.

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Definir rutas](referencias/routing/definir-rutas.md) | Al definir o modificar las rutas de la app (array `Routes` en `app.routes.ts` y `provideRouter`): paths estáticos, parámetros (`'user/:id'`), el wildcard `**` al final, el orden de coincidencia, redirecciones con `redirectTo` (también condicionales), títulos de página (`title`), `data`, providers de ruta y rutas hijas (`children`). |
| [Estrategias de carga de rutas](referencias/routing/estrategias-de-carga.md) | Al decidir si una ruta se carga de forma eager o lazy, o al configurar lazy loading con `loadComponent` o `loadChildren` (con `import()` dinámico y export `default`), incluso eligiendo qué cargar según el contexto con `inject()` dentro del loader. |
| [Mostrar rutas con outlets](referencias/routing/mostrar-rutas-con-outlets.md) | Al decidir dónde se renderiza el componente de una ruta con `<router-outlet />`: outlets anidados para rutas hijas, outlets con nombre (`name="sidebar"` y `outlet` en la ruta), los eventos `activate` y `deactivate`, o pasar datos al componente de la ruta con `routerOutletData` y `ROUTER_OUTLET_DATA`. |
| [Navegar a rutas](referencias/routing/navegar-a-rutas.md) | Al navegar entre rutas: enlaces declarativos con `RouterLink` y `routerLinkActive` (paths absolutos o relativos), navegación programática con `Router.navigate()` (con `queryParams`, `fragment` o `relativeTo`) o con `navigateByUrl()` (con `replaceUrl`), y los tipos de parámetros de URL (route, query y matrix params). |
| [Route Guards](referencias/routing/route-guards.md) | Al restringir el acceso a una ruta (por ejemplo, exigir login o un rol), al impedir salir de una página con cambios sin guardar o al activar rutas según feature flags: guards funcionales (`CanActivateFn`, `CanActivateChild`, `CanDeactivate`, `CanMatch`) con `inject()`, que devuelven `boolean`, `UrlTree` o `RedirectCommand`. |
| [Data Resolvers](referencias/routing/data-resolvers.md) | Cuando un componente de ruta necesita datos cargados antes de que se active la ruta: resolvers con `ResolveFn` en la clave `resolve`, lectura de los datos con `ActivatedRoute` y `toSignal` o como inputs con `withComponentInputBinding()`, y manejo de errores con `catchError` y `RedirectCommand` o con `withNavigationErrorHandler`. |
| [Ciclo de vida y eventos del router](referencias/routing/ciclo-de-vida-del-router.md) | Al reaccionar a la navegación o depurarla: suscribirse a `Router.events` (`NavigationStart`, `NavigationEnd`, `NavigationCancel`, `NavigationError`, guards y resolvers en orden cronológico) para mostrar un indicador de carga global, registrar vistas de página o gestionar el scroll, o habilitar `withDebugTracing()`. |
| [Estrategias de renderizado](referencias/routing/estrategias-de-renderizado.md) | Al elegir cómo se renderiza la app o cada ruta según el SEO y la interactividad: Client-Side Rendering (CSR), Static Site Generation o prerendering (SSG) y Server-Side Rendering (SSR), junto con la hydration (full, incremental con `@defer` y event replay). |
| [Animaciones de transición entre rutas](referencias/routing/animaciones-de-rutas.md) | Al agregar animaciones de transición entre rutas con la View Transitions API: `withViewTransitions()` en `provideRouter`, personalización en el CSS global con `::view-transition-old()` y `::view-transition-new()`, `view-transition-name` y `onViewTransitionCreated` para omitir transiciones. |

### [Estilos y animaciones](referencias/estilos-y-animaciones/)

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Animaciones de Angular](referencias/estilos-y-animaciones/animaciones-de-angular.md) | Al animar en Angular elementos que entran o salen del DOM o que cambian de estado (primero revisa la versión en `package.json`): `animate.enter` y `animate.leave` con CSS nativo (v20.2+), los eventos `(animate.leave)` con `animationComplete()` para librerías como GSAP, transiciones con clases, altura automática con CSS grid, o el DSL legacy de `@angular/animations` (`trigger`, `state`, `transition`, `provideAnimationsAsync`) en proyectos antiguos. |
| [Estilos de componentes](referencias/estilos-y-animaciones/estilos-de-componentes.md) | Al definir los estilos de un componente (`styles`, `styleUrl`), elegir la view encapsulation (`Emulated`, `ShadowDom`, `None`), dar estilo al elemento host con `:host` o `:host-context()`, decidir si usar `::ng-deep` (desaconsejado) o entender cómo afectan los estilos externos (`<link>`, `@import`). |

### [Testing](referencias/testing/)

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Fundamentos de testing](referencias/testing/fundamentos-de-testing.md) | Al escribir o corregir unit tests de componentes con Vitest y `TestBed` (`configureTestingModule`, `createComponent`, `ComponentFixture`, `debugElement`) en un proyecto zoneless: sigue el patrón «Act, Wait, Assert» con `await fixture.whenStable()` en lugar de `fixture.detectChanges()`. |
| [Testing con Component Harnesses](referencias/testing/component-harnesses.md) | Al escribir tests que interactúan con componentes (sobre todo de Angular Material) a través de harnesses en lugar de consultas al DOM: `TestbedHarnessEnvironment.loader(fixture)`, `HarnessLoader`, `loader.getHarness()` con `HarnessClass.with({...})` y los métodos del harness (`click()`, `getText()`, `getValue()`), como en `MatButtonHarness`. |
| [Testing con RouterTestingHarness](referencias/testing/router-testing.md) | Al testear componentes que navegan o dependen del routing (rutas, guards, resolvers) sin hacer mock del `Router`: usa `RouterTestingHarness.create()` con `provideRouter` en `TestBed`, navega con `harness.navigateByUrl()`, lee el componente activado con `harness.routeDebugElement` y espera con `harness.fixture.whenStable()`. |
| [Testing End-to-End (E2E)](referencias/testing/e2e-testing.md) | Al configurar o ejecutar tests end-to-end (E2E) cuando el workspace todavía no tiene un framework E2E o el usuario pide cambiarlo: agrega Playwright, Cypress, Nightwatch, WebdriverIO o Puppeteer con `ng add` y ejecútalos con `ng e2e`. |

### [Herramientas](referencias/herramientas/)

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Guía de Angular CLI para agentes](referencias/herramientas/cli.md) | Al usar Angular CLI (`ng`) para agregar librerías de Angular con `ng add` (en lugar de `npm install`), actualizar con `ng update`, generar código (`ng g c`, `ng g s`, `ng g d`, `ng g p`, `ng g g`, `ng g environments`), levantar el servidor de desarrollo con `ng serve` y un proxy de la API, compilar con `ng build` (`--configuration`), ejecutar `ng test` o `ng e2e`, o hacer deploy con `ng deploy`. |
| [Migraciones automáticas y modernización del código](referencias/herramientas/migraciones.md) | Al refactorizar o modernizar un codebase de Angular con los schematics oficiales de `@angular/core` en lugar de reemplazos manuales: migrar a control flow integrado, inputs basados en signals, signal queries, outputs funcionales, `inject()`, etiquetas de autocierre o standalone (en tres fases, con `ng build` entre cada una). |
| [Angular CLI MCP Server](referencias/herramientas/mcp.md) | Al configurar o usar el Angular CLI MCP Server (`npx @angular/cli mcp`) en un IDE o en un CLI de IA (Cursor, VS Code, Gemini CLI, Antigravity), con opciones como `--read-only` o `--local-only`, o al consultar qué tools ofrece (`get_best_practices`, `search_documentation`, `list_projects`, `devserver.start`, `run_target`, `onpush_zoneless_migration`). |
| [Configuración de entornos](referencias/herramientas/configuracion-de-entornos.md) | Al configurar valores que cambian según el entorno (por ejemplo, la URL de la API): archivos de environment generados con `ng generate environments` y reemplazados en tiempo de build (sin secretos), `isDevMode()`, o configuración en runtime cargando un JSON con `provideAppInitializer` para desplegar el mismo build en varios entornos. |
