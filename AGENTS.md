# Descripción del Proyecto
Arquitectura base agnóstica a las features para iniciar un nuevo proyecto en Angular, configurada para trabajar con IA

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

## Fuentes de consulta
Antes de editar código y responder, consulta solo las fuentes cuya columna **¿Cuándo leerlo?** coincida con la tarea, y aplica a la vez las reglas y la documentación consultadas.

Cuando las fuentes se contradicen, gana la de número menor en la columna **Prioridad**:

| Prioridad | Fuente | ¿Qué es? | ¿Cuándo leerlo? |
| --- | --- | --- | --- |
| 1 | [Skill `angular-conventions`](.agents/skills/angular-conventions/SKILL.md) | Reglas propias del proyecto | Antes de crear, mover, modificar o revisar código, y al responder cómo se hace algo en este proyecto. |
| 2 | tool `get_best_practices` del MCP server `angular-cli` | Reglas de terceros de Google sobre buenas prácticas de Angular | Una vez, al inicio de la sesión: cuando el usuario envíe el primer mensaje. |
| 3 | tool `search_documentation` del MCP server `angular-cli` | [Documentación oficial completa de Angular](https://angular.dev) | Solo si en la skill `angular-developer` el tema no existe o le falta información. |
| 4 | [Skill `angular-developer`](.agents/skills/angular-developer/SKILL.md) | Resumen de la [documentación oficial de Angular](https://angular.dev) | Al responder sobre APIs de Angular, al usar una API (aunque creas conocerla) y ante errores. Consúltala antes que `search_documentation`: al ser un resumen, es más rápida. |
| 5 | Datos de entrenamiento | Tu conocimiento previo | Puedes usarlo, pero las fuentes anteriores tienen prioridad: este proyecto usa Angular 22, cuyos breaking changes pueden haberlo dejado desactualizado. Que esté desactualizado no significa que esté mal; solo que puede no aplicar a esta versión. |

## Preguntar
Si detectas un error, una inconsistencia o una ambigüedad, o tienes alguna duda, detente y pregúntame antes de escribir o modificar código. No supongas cómo debe implementarse algo.

**Razón:** preguntar cuesta menos que revisar y deshacer código basado en una suposición incorrecta.

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
