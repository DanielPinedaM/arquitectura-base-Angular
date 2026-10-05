# Guía de Angular CLI para agentes

Angular CLI (`ng`) es la herramienta principal para gestionar un workspace de Angular. Prefiere siempre los comandos del CLI sobre la creación manual de archivos o los comandos genéricos de `npm` al modificar la estructura del proyecto o agregar dependencias específicas de Angular.

## 1. Gestión de dependencias

**Usa SIEMPRE `ng add` para librerías de Angular** en lugar de `npm install`. `ng add` instala el paquete Y ejecuta los schematics de inicialización (p. ej., configurar `angular.json`, actualizar los root providers).

```bash
ng add @angular/material
ng add tailwindcss
ng add @angular/fire
```

Para actualizar la aplicación y sus dependencias (lo cual ejecuta automáticamente las migraciones de código):

```bash
ng update @angular/core@<latest or specific version> @angular/cli<latest or specific version>
```

## 2. Generación de código (`ng generate` o `ng g`)

Usa siempre el CLI para generar código y así asegurar que se apegue a los estándares de Angular y que actualice automáticamente los archivos de configuración necesarios.

| Objetivo     | Comando               | Notas                                                                                          |
| :----------- | :-------------------- | :--------------------------------------------------------------------------------------------- |
| Component    | `ng g c path/to/name` | Genera un componente. Usa `--inline-style` (`-s`) o `--inline-template` (`-t`) si se solicita. |
| Service      | `ng g s path/to/name` | Genera un servicio `@Service`.                                                                 |
| Directive    | `ng g d path/to/name` | Genera una directiva.                                                                          |
| Pipe         | `ng g p path/to/name` | Genera un pipe.                                                                                |
| Guard        | `ng g g path/to/name` | Genera un route guard funcional.                                                               |
| Environments | `ng g environments`   | Hace scaffolding de `src/environments/` y actualiza `angular.json` con file replacements.      |

_Nota: No existe un comando para generar una sola definición de ruta. Genera un componente y luego agrégalo manualmente al array `Routes` en `app.routes.ts`._

## 3. Servidor de desarrollo y proxy

Inicia el servidor de desarrollo local con hot-module replacement (HMR):

```bash
ng serve
```

### Proxy de la API del backend

Para hacer proxy de las peticiones a la API durante el desarrollo (p. ej., redirigir `/api` a un servidor Node local):

1. Crea `src/proxy.conf.json`:
   ```json
   {
     "/api/**": {"target": "http://localhost:3000", "secure": false}
   }
   ```
2. Actualiza `angular.json` bajo el target `serve`:
   ```json
   "serve": {
     "builder": "@angular/build:dev-server",
     "options": { "proxyConfig": "src/proxy.conf.json" }
   }
   ```

## 4. Build de la aplicación

Compila la aplicación en un directorio de salida (por defecto: `dist/<project-name>/browser`). Angular moderno usa el builder `@angular/build:application` (basado en esbuild).

```bash
ng build
```

- `ng build` usa por defecto la configuración de producción, que habilita la compilación Ahead-of-Time (AOT), la minificación y el tree-shaking.
- Apunta a configuraciones específicas definidas en `angular.json` usando `--configuration`: `ng build --configuration=staging`.

## 5. Testing

- **Unit Tests**: Ejecuta `ng test` para correr los unit tests mediante el test runner configurado (p. ej., Karma o Vitest).
- **End-to-End (E2E)**: Ejecuta `ng e2e`. Si no hay un framework E2E configurado, el CLI pedirá instalar uno (Cypress, Playwright, Puppeteer, etc.).

## 6. Deployment

Para hacer deploy de una aplicación, primero debes agregar un deployment builder y luego ejecutar el comando de deploy:

```bash
# Ejemplo para Firebase
ng add @angular/fire
ng deploy
```
