# Ejecución de Proyecto

* Runtime: Node.js 24
* Administrador de versiones: fnm
* Manejador de paquetes: pnpm
* Archivo de bloqueo: pnpm-lock.yaml

# Compatibilidad con zone.js
Esta PROHIBIDO:
* Eliminar zone.js del build en `angular.json`

* Eliminar zone.js de los polyfills de build

* Eliminar zone.js y zone.js/testing de la sección de test

**Razon**: Existen librerías de terceros que dependen de Zone.js. Sin Zone.js, cualquier callback asíncrono de estas librerías no refrescará la vista automáticamente.

# Reglas **OBLIGATORIAS** de Angular
Este proyecto usa Angular 22. Sus breaking changes pueden diferir de tus datos de entrenamiento.

Antes de escribir código o responder, consultar estas fuentes, listadas de mayor a menor precedencia:

1. [Skill `angular-conventions`](.claude/skills/angular-conventions/SKILL.md): Reglas propias del proyecto que definen su arquitectura.

2. tool `get_best_practices` del MCP server `angular-cli`: Reglas del equipo oficial de Angular (Google).

3. tool `search_documentation` del MCP server `angular-cli`: Documentación oficial de Angular

4. [Skill `angular-developer`](.claude/skills/angular-developer/): El cómo, con ejemplos de código.

5. Tus datos de entrenamiento: Permitidos, no están prohibidos, pero ceden ante cualquier fuente anterior.

## Buenas Practicas de Angular
* Usar lazy loading para todas las rutas de `src\app\app.routes.ts`

* NO uses los decoradores `@HostBinding` ni `@HostListener`. Coloca los host bindings dentro del objeto host del decorador `@Component` o `@Directive`.

* Usa `NgOptimizedImage` para todas las imágenes estáticas.
  * `NgOptimizedImage` no funciona con imágenes inline en base64.

* NO establezcas explícitamente `changeDetection: ChangeDetectionStrategy.OnPush`. `OnPush` es el valor por defecto.

## Usar Angular 22 Moderno, **NUNCA** Legacy
* Usar `input()` y `output()` con signals importados desde `import { input, output } from '@angular/core'`. NO los decoradores `@Input()` ni `@Output()`

* Usar `model()` para propiedades con two-way binding con la sintaxis `[(prop)]`, en lugar de combinar `input()` con `output()`

* Usar standalone components, no `NgModules`

* No escribir `@Component({standalone: true })` porque ese es el valor por defecto.

* Usar function interceptors (no class-based interceptors)

* **Control Flow Directives:** `@for`, `@if`, `@switch`, `@case`, `@default` (no `*ngFor`, `*ngIf`, `ngSwitch`)

* Inyección de dependencias con `inject()` (no constructor injection)

* **Servicios singleton:** usar `@Service()` en vez de `@Injectable({providedIn: 'root'})`. `@Service()` es el equivalente moderno y conciso, ya provee la instancia como singleton en root por defecto, sin configuración extra. Reservar `@Injectable` solo para casos avanzados (constructor injection, useClass/useValue/useFactory, scopes distintos a root).


## Formularios
* Usar signal forms importado desde `@angular/forms/signals` junto con los componentes UI de formularios de Spartan NG ubicados en `src\shared\design\ui\spartan-ng\form`

* **PROHIBIDO** usar alternativas a signal forms: `ngModel` (Template-driven Forms), `FormGroup` (Reactive Forms), callback tipo `onChange`, etc.

* Conectar el Zod schema con signal forms usando `import { validateStandardSchema } from '@angular/forms/signals'`, invocándolo dentro de la schema function, que es el callback que recibe `form()` como segundo argumento

* **PROHIBIDO** usar cualquier alternativa a Zod para validar formularios: los validators nativos de signal forms (`required()`, `minLength()`, `pattern()`, `min()`, `validate()`, etc.) importados desde `@angular/forms/signals`, los `Validators` nativos de Angular (`import { Validators } from '@angular/forms'`), o validator functions custom sin Zod. La única función de validación permitida con esquemas de zod es `validateStandardSchema`

* Los Zod schema tienen que estar dentro de un archivo `.schema.ts` dentro de la carpeta padre del componente al que pertenece cada validación de formulario

## Gestión de Estado
* Mantén las transformaciones de estado puras y predecibles

* Usar signal-based reactivity

* **Signals API**:
  * `signal()`
  * `toSignal()`
  * `computed()` para el estado derivado
  * `linkedSignal` para el estado derivado de múltiples fuentes reactivas que deben mantenerse sincronizadas
  * **NO** uses `mutate` en signals porque fue removido de la API, usar:
    * `.update((prev) => next)` cuando el nuevo estado se calcula **a partir del anterior**
    * `.set(value)` cuando se **sobrescribe por completo** y no depende del estado anterior
  * `effect()`
  * `afterRenderEffect()`
  * `resource()`

* **Estado global con signals:** Todo estado global o compartido entre componentes debe manejarse con la API de signals de Angular, expuesto desde un servicio singleton `@Service()`. PROHIBIDO usar BehaviorSubject, ReplaySubject, Subject u otros stores basados en RxJS para mantener estado. RxJS queda reservado únicamente para flujos asíncronos de eventos (HTTP, websockets, streams), nunca como contenedor de estado.

# Resumen de la Skill `angular-conventions`

## Tipado en TypeScript
* Usar strict type checking

* Preferir la inferencia de tipos cuando el tipo sea obvio

* Prohibido el tipo `any`; usa `unknown` cuando el tipo sea incierto.

* Preferir `interface` para tipos de objeto (`Task`) y para el tipo de los elementos en arrays de objetos (`Task[]`).

* Usar `Record<Clave, Valor>` para objetos con claves dinámicas.

* Usar `type` para tipos primitivos, literales y uniones.
