---
name: angular-developer
description: Genera código Angular y proporciona orientación arquitectónica. Se activa al crear proyectos, componentes, servicios o comunicación HTTP, o para buenas prácticas sobre reactividad (signals, linkedSignal, resource, httpResource), formularios, inyección de dependencias, routing, SSR, accesibilidad (ARIA), animaciones, estilos (estilos de componentes), testing, convenciones de nomenclatura o herramientas del CLI.
license: MIT
metadata:
  author: Copyright 2026 Google LLC
  version: '1.0'
---

# Lineamientos para desarrolladores de Angular

1. Analiza siempre la versión de Angular del proyecto antes de dar orientación, ya que las buenas prácticas y las funcionalidades disponibles pueden variar significativamente entre versiones. Si creas un nuevo proyecto con Angular CLI, no especifiques una versión a menos que el usuario lo solicite.

2. Al generar código, sigue la guía de estilo y las buenas prácticas de Angular para la mantenibilidad y el rendimiento. Usa Angular CLI para hacer scaffolding de componentes, servicios, directivas, pipes y rutas para asegurar la consistencia.

3. Una vez que termines de generar código, ejecuta `ng build` para asegurar que no haya errores de build. Si hay errores, analiza los mensajes de error y corrígelos antes de continuar. No omitas este paso, ya que es crítico para asegurar que el código generado sea correcto y funcional.

## Creación de nuevos proyectos

Si el usuario no proporciona lineamientos, estas son algunas reglas por defecto a seguir al crear un nuevo proyecto de Angular:

1. Usa la última versión estable de Angular a menos que el usuario especifique lo contrario.
2. Usa Signal Forms para la gestión de formularios en proyectos nuevos (estable en Angular v22 y versiones posteriores) [Más información](references/signal-forms.md).

**Reglas de ejecución para `ng new`:**
Cuando se te pida crear un nuevo proyecto de Angular, debes determinar el comando de ejecución correcto siguiendo estos pasos estrictos:

**Paso 1: Verifica si el usuario indicó una versión explícita.**

- **SI** el usuario solicita una versión específica (p. ej., Angular 15), omite las instalaciones locales y usa estrictamente `npx`.
- **Comando:** `npx @angular/cli@<requested_version> new <project-name>`

**Paso 2: Verifica si existe una instalación de Angular.**

- **SI** no se solicita una versión específica, ejecuta `ng version` en la terminal para verificar si Angular CLI ya está instalado en el sistema.
- **SI** el comando se ejecuta correctamente y devuelve una versión instalada, usa directamente la instalación local/global.
- **Comando:** `ng new <project-name>`

**Paso 3: Recurre a la última versión.**

- **SI** no se solicita una versión específica Y el comando `ng version` falla (lo que indica que no existe una instalación de Angular), debes usar `npx` para obtener la última versión.
- **Comando:** `npx @angular/cli@latest new <project-name>`

## Componentes

Al trabajar con componentes de Angular, consulta las siguientes referencias según la tarea:

- **Fundamentos**: Anatomía, metadata, conceptos principales, etiquetas de autocierre y control flow del template (@if, @for, @switch). Lee [components.md](references/components.md)
- **Inputs**: Inputs basados en signals, transforms y model inputs. Lee [inputs.md](references/inputs.md)
- **Outputs**: Outputs basados en signals y buenas prácticas para eventos personalizados. Lee [outputs.md](references/outputs.md)
- **Host Elements**: Host bindings e inyección de atributos. Lee [host-elements.md](references/host-elements.md)
- **Convenciones de nomenclatura**: Estilo de nomenclatura moderno de Angular v20+ ("Intent over Role") para archivos, componentes, servicios, directivas, pipes y modelos. Lee [naming-conventions.md](references/naming-conventions.md)

Si necesitas documentación más profunda que no se encuentre en las referencias anteriores, lee la documentación en `https://angular.dev/guide/components`.

## Reactividad y gestión de datos

Al gestionar el estado y la reactividad de los datos, usa Angular Signals y consulta las siguientes referencias:

- **Visión general de signals**: Conceptos principales de signals (`signal`, `computed`), contextos reactivos y `untracked`. Lee [signals-overview.md](references/signals-overview.md)
- **Estado dependiente (`linkedSignal`)**: Creación de estado escribible vinculado a signals de origen. Lee [linked-signal.md](references/linked-signal.md)
- **Reactividad asíncrona (`resource`)**: Obtención de datos asíncronos directamente en el estado de un signal. Lee [resource.md](references/resource.md)
- **Efectos secundarios (`effect`)**: Logging, manipulación del DOM de terceros (`afterRenderEffect`) y cuándo NO usar effects. Lee [effects.md](references/effects.md)

## Comunicación HTTP

Al comunicarte con servicios de backend, usa las APIs HTTP de Angular y consulta la siguiente referencia:

- **HTTP Client y Resources**: `provideHttpClient`, `HttpClient`, interceptors y `httpResource`. Lee [http-client.md](references/http-client.md)

## Formularios

En la mayoría de los casos, para aplicaciones nuevas, **prefiere signal forms**. Al tomar una decisión sobre formularios, analiza el proyecto y considera los siguientes lineamientos:

- Si la aplicación usa v22 o una versión posterior y se trata de un formulario nuevo, **prefiere Signal Forms**.
- Para aplicaciones más antiguas o al trabajar con formularios existentes, usa el tipo de formulario adecuado que coincida con la estrategia de formularios actual de la aplicación.

- **Signal Forms**: Usa signals para la gestión del estado del formulario. Lee [signal-forms.md](references/signal-forms.md)
- **Template-driven forms**: Úsalos para formularios simples. Lee [template-driven-forms.md](references/template-driven-forms.md)
- **Reactive forms**: Úsalos para formularios complejos. Lee [reactive-forms.md](references/reactive-forms.md)

## Inyección de dependencias

Al implementar la inyección de dependencias en Angular, sigue estos lineamientos:

- **Fundamentos**: Visión general de la inyección de dependencias, los servicios y la función `inject()`. Lee [di-fundamentals.md](references/di-fundamentals.md)
- **Creación y uso de servicios**: Creación de servicios, la opción `providedIn: 'root'` e inyección en componentes u otros servicios. Lee [creating-services.md](references/creating-services.md)
- **Definición de dependency providers**: Provisión automática vs manual, `InjectionToken`, `useClass`, `useValue`, `useFactory` y scopes. Lee [defining-providers.md](references/defining-providers.md)
- **Injection Context**: Dónde se permite `inject()`, `runInInjectionContext` y `assertInInjectionContext`. Lee [injection-context.md](references/injection-context.md)
- **Hierarchical Injectors**: `EnvironmentInjector` vs `ElementInjector`, reglas de resolución, modificadores (`optional`, `skipSelf`) y `providers` vs `viewProviders`. Lee [hierarchical-injectors.md](references/hierarchical-injectors.md)

## Pipes

Al formatear valores en templates, crear pipes personalizados o reutilizar lógica similar a la de un pipe en TypeScript, consulta la siguiente referencia. Prefiere pipes en los templates; fuera de los templates, evita inyectar clases de pipes solo para llamar a `transform()`.

- **Pipes**: Imports de pipes integrados, nomenclatura e implementación de pipes personalizados, pipes puros vs impuros y patrones de reutilización en TypeScript usando funciones de formato standalone o funciones simples extraídas. Lee [pipes.md](references/pipes.md)

## Angular Aria

Al construir componentes personalizados accesibles para cualquiera de los siguientes patrones: Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid, consulta la siguiente referencia:

- **Componentes de Angular Aria**: Construcción de componentes headless y accesibles (Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid) y estilos de atributos ARIA. Lee [angular-aria.md](references/angular-aria.md)

## Routing

Al implementar la navegación en Angular, consulta las siguientes referencias:

- **Definir rutas**: Paths de URL, segmentos estáticos vs dinámicos, wildcards y redirecciones. Lee [define-routes.md](references/define-routes.md)
- **Estrategias de carga de rutas**: Eager loading vs lazy loading, y carga según el contexto. Lee [loading-strategies.md](references/loading-strategies.md)
- **Mostrar rutas con outlets**: Uso de `<router-outlet>`, outlets anidados y outlets con nombre. Lee [show-routes-with-outlets.md](references/show-routes-with-outlets.md)
- **Navegar a rutas**: Navegación declarativa con `RouterLink` y navegación programática con `Router`. Lee [navigate-to-routes.md](references/navigate-to-routes.md)
- **Controlar el acceso a rutas con guards**: Implementación de `CanActivate`, `CanMatch` y otros guards para la seguridad. Lee [route-guards.md](references/route-guards.md)
- **Data Resolvers**: Obtención anticipada de datos antes de la activación de la ruta con `ResolveFn`. Lee [data-resolvers.md](references/data-resolvers.md)
- **Ciclo de vida y eventos del router**: Orden cronológico de los eventos de navegación y depuración. Lee [router-lifecycle.md](references/router-lifecycle.md)
- **Estrategias de renderizado**: CSR, SSG (Prerendering) y SSR con hydration. Lee [rendering-strategies.md](references/rendering-strategies.md)
- **Animaciones de transición entre rutas**: Habilitar y personalizar la View Transitions API. Lee [route-animations.md](references/route-animations.md)

Si necesitas documentación más profunda o más contexto, visita la [guía oficial de Angular Routing](https://angular.dev/guide/routing).

## Estilos y animaciones

Al implementar estilos y animaciones en Angular, consulta las siguientes referencias:

- **Animaciones de Angular**: Uso de CSS nativo (recomendado) o del DSL legacy para efectos dinámicos. Lee [angular-animations.md](references/angular-animations.md)
- **Estilos de componentes**: Buenas prácticas para estilos de componentes y encapsulación. Lee [component-styling.md](references/component-styling.md)

## Testing

Al escribir o actualizar tests, consulta las siguientes referencias según la tarea:

- **Fundamentos**: Buenas prácticas para unit testing (Vitest), patrones asíncronos y `TestBed`. Lee [testing-fundamentals.md](references/testing-fundamentals.md)
- **Component Harnesses**: Patrones estándar para una interacción robusta con componentes. Lee [component-harnesses.md](references/component-harnesses.md)
- **Testing del router**: Uso de `RouterTestingHarness` para tests de navegación confiables. Lee [router-testing.md](references/router-testing.md)
- **Testing End-to-End (E2E)**: Configuración y ejecución de tests E2E. Lee [e2e-testing.md](references/e2e-testing.md)

## Herramientas

Al trabajar con las herramientas de Angular, consulta las siguientes referencias:

- **Angular CLI**: Creación de aplicaciones, generación de código (componentes, rutas, servicios), serving y build. Lee [cli.md](references/cli.md)
- **Modernización del código**: Refactorización automática hacia estándares modernos usando migraciones. Lee [migrations.md](references/migrations.md)
- **Angular MCP Server**: Tools disponibles, configuración y funcionalidades experimentales. Lee [mcp.md](references/mcp.md)
- **Configuración de entornos**: Estrategias para la configuración en tiempo de build y en runtime. Lee [environment-configuration.md](references/environment-configuration.md)
