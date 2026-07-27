# Ejecución de Proyecto

* Runtime: Node.js
* Administrador de versiones: fnm
* Manejador de paquetes: pnpm
* Archivo de bloqueo: pnpm-lock.yaml

# Scripts de desarrollo

| Comando            | Ambiente     | Variable de Entorno                         |
| ------------------ | ------------ | ------------------------------------------- |
| `pnpm start:local` | Local host   | `src/environments/environment.localhost.ts` |
| `pnpm start:prod`  | Producción   | `src/environments/environment.prod.ts`      |
| `pnpm start:test`  | Pruebas      | `src/environments/environment.test.ts`      |

#  Generar Carpeta `dist` (build) para Desplegar

| Comando           | Ambiente     | Variable de Entorno                    |
| ----------------- | ------------ | -------------------------------------- |
| `pnpm build:test` | Pruebas      | `src/environments/environment.test.ts` |
| `pnpm build:prod` | Producción   | `src/environments/environment.prod.ts` |

# Ejecutar Carpeta `dist` con Archivos de Compilación
`pnpm serve:dist` ejecuta en `http://localhost:2000` los archivos ya compilados dentro de la carpeta `dist`. NO recibe ni lee variables de entorno.

## Regla
El ambiente queda **hardcodeado dentro de la carpeta `dist`** durante el build. NO se define al ejecutar `pnpm serve:dist`.

***Motivo:*** Los comandos `build:*` usan `fileReplacements` de `angular.json`, que reemplaza `src/environments/environment.ts` por el archivo del ambiente **antes** de compilar. Es decir, **las variables de entorno quedan hardcodeadas dentro de los archivos `.js` generados**, no se leen en tiempo de ejecución.

## Pasos
1. Generar la carpeta `dist` con el ambiente deseado, usando uno de los comandos de la sección "Generar Carpeta `dist` (build) para Desplegar"

2. Ejecutar la carpeta `dist`

```bash
pnpm serve:dist
```

3. En el navegador abrir `http://localhost:2000`

## Cambiar de Ambiente
Volver a ejecutar `pnpm serve:dist` NO cambia el ambiente. Para cambiarlo, generar de nuevo la carpeta `dist` con `pnpm build:test` o `pnpm build:prod` según el ambiente requerido, y después ejecutar `pnpm serve:dist`.

Angular CLI no tiene un comando para servir la carpeta `dist`; `ng serve` compila en memoria y no usa los archivos compilados. Por eso este script usa el paquete `serve`, y la bandera `-s` (`--single`) hace el fallback a `index.html` que necesita el Angular Router para que funcionen los deep links (por ejemplo, recargar el navegador en `http://localhost:2000/iniciar-sesion`).

# Reglas Obligatorias para la IA
* No generes análisis, recomendaciones ni comentarios adicionales hasta que empiece a realizar preguntas.

* Todas las respuestas, recomendaciones y fragmentos de código deben respetar obligatoriamente la arquitectura, reglas, patrones y convenciones definidas en este documento.

* No cuestiones, reemplaces, contradigas ni ignores las decisiones de arquitectura definidas en este proyecto.

* Siempre que respondas con código, debes indicar explícitamente la ubicación exacta de cada archivo basándote en la estructura base del proyecto definida en este documento.

* Si existe alguna ambigüedad, falta de contexto o algún aspecto importante de arquitectura, estructura o convenciones que no esté definido, primero debes preguntar antes de asumir una implementación.

* Si durante la conversación recibes instrucciones contradictorias, debes priorizar siempre las reglas y decisiones definidas inicialmente en este documento.

* La arquitectura, reglas y convenciones definidas en este documento tienen prioridad absoluta. Sin embargo, como no todos los casos posibles están documentados, si un problema no puede resolverse respetando la arquitectura actual o requiere una solución no contemplada en el README, primero debes advertir explícitamente que dicha solución se sale de la arquitectura o convenciones establecidas antes de generar una implementación.

# Reglas de Idioma

## Responder en Español
Responder en español siempre, excepto lo que esta en "Excepciones, Responder en Ingles"

Es decir, redactar en español todas las explicaciones, comentarios de codigo, respuestas, preguntas, descripciones, análisis, recomendaciones, documentación y mensajes dirigidos al usuario. Con la excepcion de lo siguiente que tiene que estar en ingles:

## Excepciones, Responder en Ingles
* Términos técnicos de uso común en desarrollo de software: middleware, service, controller, repository, signal, interceptor, provider, endpoint, payload, patrones de diseño, etc.

* Nombres de frameworks, librerías, paquetes, APIs

* Código fuente (todo, **excepto los comentarios de codigo**): Identificadores, nombres de archivos y carpetas, clases, interface, enum, métodos, funciones, parámetros, variables, ruta base del controlador de Nest, ruta de endpoint de Nest

## Excepciones dentro de las Excepciones, esto debe estar en Español
Aunque la sección anterior indica que los "nombres de archivos y carpetas" van en inglés, existen dos casos puntuales que quedan **excluidos de esa excepción** y por lo tanto deben estar en español:

1. Los `value` de `path` definidos en `src/app/app.routes.ts`
2. Las carpetas dentro de `src/app/features/<feature>` que representen una ruta y que estén asociadas a un enrutado en `src/app/app.routes.ts`

### Explicación
Cada carpeta dentro de `<feature>` que represente una ruta, y que esté asociada a un enrutado en `src/app/app.routes.ts`, tiene que estar en español.

### Ejemplo
Al definir las rutas en `src/app/app.routes.ts`:

```typescript
export const routes: Routes = [
  {
    path: '',
    component: MainAuthComponent,
    children: [
      {
        path: 'iniciar-sesion', // <- value de path, en español
        component: LoginComponent,
      },
    ],
  },
];
```

Los `value` de `path` son rutas de navegación (URLs). Es decir:

1. Dentro de `src/app/features/<feature>` existen carpetas que representan rutas y que están en español.
2. Esas carpetas están asociadas a su respectivo `path` en `src/app/app.routes.ts`.
3. Los `value` de `path` van en español.

Por ejemplo, si existe la carpeta `src/app/features/auth/recuperar-clave/` asociada a `path: 'recuperar-clave'`, tanto el nombre de la carpeta como el `value` del `path` van en español. El resto del código fuente dentro de esa carpeta (nombres de archivos `.ts`, clases, componentes, métodos, variables, etc.) sigue las reglas generales de la sección "Excepciones, Responder en Ingles" y se mantiene en inglés.

# Reglas OBLIGATORIAS para Angular
Este proyecto usa *Angular 22*.

SIEMPRE usar las tools `search_documentation` y `get_best_practices` del MCP server `angular-cli`, ya sea para responder una pregunta del usuario, explicar un concepto, analizar código existente, generar código nuevo o modificar archivos. Tus datos de entrenamiento de Angular están desactualizados porque Angular tiene breaking changes frecuentes entre versiones; el MCP de `angular-cli` es la fuente de la verdad.

En caso de que falle la conexión al MCP server `angular-cli`, OBLIGATORIO detener la ejecución inmediatamente y mostrar el siguiente mensaje al usuario, sin modificaciones:

> **La conexión con el MCP server `angular-cli` falló. Conecte el MCP y vuelva a enviar el prompt.**

## Compatibilidad con zone.js
Esta PROHIBIDO:
* Eliminar zone.js del build en `angular.json`

* Eliminar zone.js de los polyfills de build

* Eliminar zone.js y zone.js/testing de la sección de test

**Razon**: Existen librerías de terceros que dependen de Zone.js. Sin Zone.js, cualquier callback asíncrono de estas librerías no refrescará la vista automáticamente.

## Usar Angular 22 Moderno, NUNCA Legacy
* Signal-based reactivity

* OBLIGATORIO Utilizar Signal Forms junto con los componentes UI de formularios de Spartan NG. PROHIBIDO utilizar `ngModel` (Template-driven Forms) o `FormGroup` (Reactive Forms), incluyendo Typed Reactive Forms.

* **Signals API**:
  * `signal()`
  * `.set()`
  * `.update()`
  * `computed()`
  * `effect()`
  * `afterRenderEffect()`
  * `linkedSignal`
  * `resource()`

* **Estado global con signals:** Todo estado global o compartido entre componentes debe manejarse con la API de signals de Angular, expuesto desde un servicio singleton `@Service()`. PROHIBIDO usar BehaviorSubject, ReplaySubject, Subject u otros stores basados en RxJS para mantener estado. RxJS queda reservado únicamente para flujos asíncronos de eventos (HTTP, websockets, streams), nunca como contenedor de estado.

* `input()` y `output()` con signals importados desde `import { input, output } from '@angular/core'`

* Standalone Components (no `NgModules`). No es necesario escribir `@Component({standalone: true })` porque ese es el valor por defecto

* Function Interceptors (no class-based interceptors)

* **Control Flow Directives:** `@for`, `@if`, `@switch`, `@case`, `@default` (no `*ngFor`, `*ngIf`, `ngSwitch`)

* Inyección de dependencias con `inject()` (no constructor injection)

- **Servicios singleton:** usar `@Service()` en vez de `@Injectable({providedIn: 'root'})`. `@Service()` es el equivalente moderno y conciso, ya provee la instancia como singleton en root por defecto, sin configuración extra. Reservar `@Injectable` solo para casos avanzados (constructor injection, useClass/useValue/useFactory, scopes distintos a root).
