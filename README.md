![logo-angular](./docs/readme-md/img/logo-angular.png)

---

> [!TIP]
> # 🧠 Todo este proyecto usa Signals. Mira los siguientes videos 🔗 para aprender:
>
> ## 1. [Estados con Signals VS forma tradicional](https://youtu.be/jqGjE6iqkvg)
> ## 2. [Resource y LinkedSignal](https://youtu.be/eEzLCLB5NUQ?si=DmCVg7jVBcHAZP1R)
> ## 3. [Rxjs VS Signals](https://youtu.be/lSzO2D3OCjY?si=Yr4nlZ2AanGWW0WN)
> ## 4. [Forms with Signals](https://youtu.be/7V9I9_qwx74?si=0aKj22-K5G2bLqT_)
> ## 5. [input y output con Signals `import { input, output } from '@angular/core'`](https://youtu.be/_XnEoK47Il0?si=-FGhn2ho6J1Dmn8B)

> [!TIP]
> # 🎥 **Aprende**
>
> Puedes hacer clic en el nombre de cada tecnología para ver cursos y aprenderlas

# 🅰️ Stack Frontend del Proyecto
A continuación se resumen las principales tecnologías del proyecto y el motivo por el que se utilizan. No se incluyen todas las dependencias.

* Node.js 24.21.0

* [**Angular 22:**](https://cursos.devtalles.com/courses/angular-moderno) _Framework opinionado_, excelente para proyectos grandes, aplicaciones complejas y formularios complejos. Desde la versión 17 hasta la 22 ha incorporado cambios importantes, como los _Signals_ (_reactividad_) y las nuevas _directivas de control_ de flujo _`@for`_, _`@if`_, _`@switch`_, _`@case`_.

* [**TypeScript 7:**](https://youtu.be/fUgxxhI_bvc?si=rRY7NTzsONRSwyNN) Agrega _tipado estático_ al lenguaje, permitiendo detectar errores durante el desarrollo y mejorar el _autocompletado_, la _refactorización_ y el _mantenimiento del código_. Además, permite tener el mismo lenguaje de programación en frontend y backend.

* [**Luxon 3:**](https://moment.github.io/luxon/) Corrige los errores de _`new Date()`_ de JavaScript y y tiene una API muy completa para manejo de fechas.

* [**CSS:**](https://youtu.be/K3xmRF8ab1o?si=w1Ox_P5e2R934Xby)

1. No es necesario usar Sass, porque CSS ya tiene de forma nativa:
  * [CSS anidado (CSS nesting)](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting). Ejemplo:

```CSS
.parent {
  color: blue;

  .child {
    color: red;
  }
}
```

  * [Variables de CSS (CSS custom properties)](https://css-tricks.com/a-complete-guide-to-custom-properties/). Ejemplo:

```CSS
:root {
  --spacing: 16px;
}

.button {
  padding: var(--spacing);
}
```

Estas son 2 de las principales razones por las que se decide usar Sass y no CSS, pero en versiones mas nuevas de CSS, se empezo a implementar funciones que antes solamente estaban en Sass

2. [`@layer`](https://css-tricks.com/css-cascade-layers/) resuelve problemas de [_especificidad_](https://css-tricks.com/specifics-on-css-specificity/) y [_cascada_](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts) al controlar el orden de prioridad entre las _capas_, reduciendo la necesidad de usar [`!important`](https://css-tricks.com/when-using-important-is-the-right-choice/)

3. [Tailwind 4 no se puede configurar con Sass](https://tailwindcss.com/docs/compatibility)

* [**Tailwind CSS 4:** ](https://youtu.be/R5EXap3vNDA?si=9TV4hucexfUBXgGk) Usa _clases utilitarias (utility classes)_, esto significa que si tienes conocimiento en CSS, cada clase de CSS tiene su equivalente en Tailwind. Ejemplo: En CSS se escribe

```CSS
div {
  display: flex;
}
```

y en Tailwind se escribe

```TSX
<div className="flex">
  {/* ... */}
</div>
```

En este proyecto se usa CSS para estilos globales y Tailwind para los estilos de cada componente

* [**Spartan ng:**](https://spartan.ng/components)
1. Tiene una lista de _componentes UI_ muy completa, con integración nativa con Tailwind

2. Usar una librería de UI permite abstraer lógica; la librería ya se encarga de crear los componentes y de manejar los estados. Solo tiene que usar los componentes de UI.

3. Para componentes de UI como formularios y ventanas modales no se usa etiquetas nativas de HTML porque implica tener que "programar a mano" una librería de UI y seria reinventar la rueda

4. Spartan ng es lo mas balanceado que hay entre una libreria que es totalmente Headless y una libreria de UI muy opinionada, es decir, por ejemplo modificar los estilos de [Angular Material](https://material.angular.dev/) se puede, pero es complejo y si usas una libreria totalmente Headless como [Headless UI](https://headlessui.com/) vas a enfrentarte con el problema de tener que escribir muchos estilos manualmente. Spartan ng es un punto medio: Tiene estilos por defecto pero permite editarlos facilmente usando CSS y Tailwind

5. Para modificar los estilos de Spartan ng no se requiere usar hacks de CSS como `::ng-deep` o `!important`

* [**Zod 4:**](https://youtu.be/bUzGfrjg66M?si=PqQtfsXKDVA0HnuP)

1. Permite utilizar la _misma sintaxis de código_ y reutilizar los mismos _esquemas de validación_ en frontend y backend de Node.js.

En frontend valida _formularios_ y _datos de entrada_, con integración con _React Hook Form_ (React) y [_Forms with Signals_ (Angular)](https://angular.dev/guide/forms/signals/validation). En backend valida _`body`_, _`query`_ y _`params`_ de las _solicitudes http_, garantizando la integridad de los datos antes de procesarlos.

2. El mismo esquema de Zod se reutiliza para crear tipos de datos de TypeScript

3. Se integra con TypeScript, ofrece validación de tipos en _tiempo de compilación_ y validación de datos en _tiempo de ejecución (runtime)_

* [**Material Symbols Icons:**](https://fonts.google.com/icons) Contiene iconos para todo. Sus estilos se pueden personalizar con _Tailwind_.

# ⚙️ Configurar lo Siguiente **UNA SOLA VEZ**

## 🛠️ Antes de Empezar
Para que la configuración funcione, debes tener instalado:
* [VS Code](https://code.visualstudio.com/) o cualquier editor basado en VS Code ([Antigravity IDE](https://antigravity.google/product/antigravity-ide), [Cursor](https://cursor.com/get-started), Windsurf, etc.)

* [Git Bash](https://youtu.be/niPExbK8lSw?si=tHx4IYZBdrUmW6ey)

* [Node.js](https://nodejs.org/)

* [Claude Code](https://youtu.be/Bf7hfpItrDk?si=5pW919OUbtSqJlyP)

* [pnpm](https://pnpm.io/installation)

* [fnm](https://github.com/Schniz/fnm)

> [!TIP]
> # ⚡ **Empieza de inmediato**
>
> 👍 Si quieres empezar a programar con IA sin perder tiempo configurando herramientas, utiliza **Claude Code**. Este proyecto ya incluye las configuraciones de **MCP**, **Skills** y [`AGENTS.md`](https://youtu.be/eS5HmdpcqnM?si=D7X-HFPQAfCkZ4Ks) listas para usar.
>
> 👎 Si prefieres otra IA, deberás configurar manualmente sus funcionalidades equivalentes según la forma en que esa herramienta las implemente.

## Instalar `pnpm`
1. Abrir Git Bash

2. Instalar:

```console
npm install -g pnpm@latest-11
```

3. Cerrar y volver abrir Git Bash

4. Si la instalacion es correcta, al ejecutar

```console
pnpm -v
```

Debe mostrar la version de `pnpm` instalada

## `fnm`
Para que `fnm` automáticamente al entrar a la carpeta del proyecto seleccione la versión correcta de Node.js que se especifica en el archivo `.nvmrc` que esta en la raiz del proyecto. Hacer esto:

1. Abrir Git Bash.

2. Instalar Node.js 24.21.0:

```console
fnm install 24.21.0
```

3. Copiar completo el siguiente comando y ejecutarlo:

```console
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.bashrc
source ~/.bashrc
```

4. Cerrar y volver abrir Git Bash

5. Para verificar que funcione ejecutar los siguientes comandos en el siguiente orden:

```console
cd /ruta/a/carpeta/raiz/del/proyecto
```

```console
fnm current
```

```console
node -v
```

6. Debería mostrarte `v24.21.0` automáticamente, sin que hayas escrito manualmente

```console
fnm use 24.21.0
```

## ⌨️ Autocompletado, Formatear Código y Linter
Usar VS Code o cualquier editor basado en VS Code (Antigravity, Cursor, Windsurf, etc.) para instalar las siguientes extensiones:

* [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

* [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

* [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

* [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

* [Console Ninja](https://marketplace.visualstudio.com/items?itemName=WallabyJs.console-ninja)

* [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)

* [Angular Snippets (Version 18)](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)

* [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

* [Auto Import](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport)

* [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

* [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

* [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)

No es necesario buscar cada extensión manualmente en el marketplace: el archivo `.vscode/extensions.json` ya está configurado con esas extensiones como recomendadas. Al abrir el proyecto, el editor mostrará una notificación sugiriendo instalarlas; también puede instalarlas desde la pestaña **Extensions** filtrando por `@recommended`.

La configuración de autocompletado, formateo de código y linter ya está incluida en los siguientes archivos. No es necesario realizar modificaciones adicionales:

* `.vscode/`
* `.editorconfig`
* `.prettierrc`
* `eslint.config.js`

# ⚙️ Entorno de Ejecución
Usar Node.js, prohibido usar alternativas como:

* [Bun](https://bun.com/)
* [Deno](https://deno.com/)

# 📦 Manejador de Paquetes
Usar `pnpm`, `pnpm-lock.yaml` y `pnpm dlx <paquete>` version `>=11.0.0 <12.0.0`. Esta 🚫 **BLOQUEADO** el uso de otras alternativas como:

| Concepto ⬇️ / Nombre manejador de paquetes ➡️            | `npm`                                   | `yarn`                              |
| --------------------------------------------------------- | --------------------------------------- | ----------------------------------- |
| Lockfile                                                  | `package-lock.json`                     | `yarn.lock`                         |
| Ejecutar un paquete temporal (sin instalarlo globalmente) | `npx <paquete>`<br>`npm exec <paquete>` | `yarn dlx <paquete>` *(Yarn Berry)* |

# 🟢 Administrador de Versiones para Node.js
Usar `fnm`. Está prohibido usar alternativas como:

* nvm
* volta

Este proyecto usa Node.js 24.21.0

# 🏷️ Alias
Para todos los comandos de `pnpm` usar el alias `pn`

# 📦 Instalar Paquetes

Este comando instala Angular, TypeScript, Tailwind, etc:

```console
pn i
```

# ▶️ Scripts de Desarrollo

| Comando          | Ambiente     | Variable de Entorno                         |
| ---------------- | ------------ | ------------------------------------------- |
| `pn start:local` | Local host   | `src/environments/environment.localhost.ts` |
| `pn start:test`  | Pruebas      | `src/environments/environment.test.ts`      |
| `pn start:prod`  | Producción   | `src/environments/environment.prod.ts`      |

# 🚀 Generar Carpeta `dist` (Build) para Desplegar

| Comando         | Ambiente     | Variable de Entorno                   |
| --------------- | ------------ | -------------------------------------- |
| `pn build:test` | Pruebas      | `src/environments/environment.test.ts` |
| `pn build:prod` | Producción   | `src/environments/environment.prod.ts` |

# Ejecutar Carpeta `dist` con Archivos de Compilación
`pn serve:dist` ejecuta en `http://localhost:2000` los archivos ya compilados dentro de la carpeta `dist`. NO recibe ni lee variables de entorno.

## Regla
El ambiente queda **hardcodeado dentro de la carpeta `dist`** durante el build. NO se define al ejecutar `pn serve:dist`.

***Motivo:*** Los comandos `build:*` usan `fileReplacements` de `angular.json`, que reemplaza `src/environments/environment.ts` por el archivo del ambiente **antes** de compilar. Es decir, **las variables de entorno quedan hardcodeadas dentro de los archivos `.js` generados**, no se leen en tiempo de ejecución.

## Pasos
1. Generar la carpeta `dist` con el ambiente deseado, usando uno de los comandos de la sección "[Generar Carpeta `dist` (Build) para Desplegar](#-generar-carpeta-dist-build-para-desplegar)"

2. Ejecutar la carpeta `dist`

```bash
pn serve:dist
```

3. En el navegador abrir `http://localhost:2000`

## Cambiar de Ambiente
Volver a ejecutar `pn serve:dist` NO cambia el ambiente. Para cambiarlo, generar de nuevo la carpeta `dist` con `pn build:test` o `pn build:prod` según el ambiente requerido, y después ejecutar `pn serve:dist`.

Angular CLI no tiene un comando para servir la carpeta `dist`; `ng serve` compila en memoria y no usa los archivos compilados. Por eso este script usa el paquete `serve`, y la bandera `-s` (`--single`) hace el fallback a `index.html` que necesita el Angular Router para que funcionen los deep links (por ejemplo, recargar el navegador en `http://localhost:2000/iniciar-sesion`).

# 🪲 Scripts para Hacer Debugging

> [!TIP]
> # Deja de escribir `console.log()` para ver valores de variables y estados, mejor usa el debugging

| Comando          | Ambiente      | Variable de Entorno                         | Configuración de `.vscode/launch.json` |
| ---------------- | ------------- | ------------------------------------------- | -------------------------------------- |
| `pn start:local` | Local host    | `src/environments/environment.localhost.ts` | `🪲 debugging en Chrome local host`    |
| `pn start:test`  | Pruebas       | `src/environments/environment.test.ts`      | `🪲 debugging en Chrome pruebas`       |
| `pn start:prod`  | Producción    | `src/environments/environment.prod.ts`      | `🪲 debugging en Chrome produccion`    |

Para que los scripts `start:*` sirvan para depurar se tiene que escribir `debugger;` en el código.

**Ejemplo:**

```ts
import { environment } from '@/environments/environment';

export class ExampleComponent implements OnInit {
  ngOnInit() {
    const NODE_ENV = environment.NODE_ENV;
    alert(`Ambiente ${NODE_ENV}`)
    debugger; // debugger breakpoint
  }
}
```

## 🤔 Diferencia entre Navegador y Launch
Existen dos formas de ejecutar el debugger desde VS Code (o cualquier editor basado en VS Code).

|                                                                             | **Launch**                                                                                          | **Navegador**                                                                              |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| ¿Quién arranca el frontend?                                                 | El editor, al presionar `F5`                                                                        | El desarrollador, en la terminal                                                           |
| ¿Quién elige el entorno?                                                    | La configuración de `launch.json` y `tasks.json`                                                    | El script que se ejecutó en la terminal                                                    |
| Frontend ya en ejecución                                                    | Lo arranca de cero                                                                                  | Se adjunta al que ya está corriendo                                                        |
| ¿Quién abre el navegador?                                                   | VS Code abre automáticamente una nueva ventana del navegador                                        | El desarrollador debe abrir el navegador manualmente                                       |
| ¿Donde se ven los breakpoints en el codigo despues de iniciar el debugging? | En el editor de código (VS Code)                                                                    | En las herramientas de desarrollo (DevTools) de Chrome en la pestaña "Fuentes" ("Sources") |
| ¿Se puede usar desde cualquier navegador?                                   | ❌ No. `launch.json` y `tasks.json` estan configurados para funcionar unicamente con Google Chrome | ✅ Si. El desarrollador puede abrir cualquier navegador                                    |

En ambas formas, el debugger se vuelve a adjuntar automáticamente cada vez que `ng serve` reinicia el proceso durante el Hot Reload (reinicio automático de la aplicación), por lo que los breakpoints continúan funcionando después de guardar un archivo.

## ❔ ¿Cual Usar?
**Launch:** Es menos práctico de usar porque requiere del editor. Usar cuando necesite depurar y editar el código al mismo tiempo desde el editor.

**Desde navegador:** Es mas rápido de usar, solamente abra el navegador y empiece a depurar. Usar cuando necesite una depuración rápida sin editar código.

## 1️⃣ Launch: El Editor Ejecuta el Script
1. Si el frontend ya esta ejecutandose con `pn start:local`, `pn start:test` o `pn start:prod`, deténgalo antes de iniciar el debugging. De lo contrario, se producirán errores.

2. Colocar los breakpoints, escribiendo en el código

```ts
debugger;
```

3. Abrir la pestaña Ejecucion y Depuración (Run and Debug)

4. Seleccionar el entorno que quiere depurar en la lista, según la tabla de scripts:

```txt
🪲 debugging en Chrome local host

🪲 debugging en Chrome pruebas

🪲 debugging en Chrome produccion
```

5. Para que el editor de codigo ejecute el frontend, presionar:
   * `F5` en un computador de escritorio.
   * `Fn + F5` en un computador portátil.

6. En el editor de codigo abrir el archivo que se quiere depurar y que contiene `debugger;`

## 2️⃣ Desde Navegador
1. Colocar los breakpoints, escribiendo en el código:

```ts
debugger;
```

2. Ejecute el frontend con el entorno que quiere depurar `pn start:local`, `pn start:test` o `pn start:prod`.

3. Abrir herramientas de desarrollo (DevTools):
   * Abrir navegador en `http://localhost:4200/`
   * Clic derecho sobre la pagina web
   * Seleccione **inspeccionar**

4. Navegue hasta la pantalla donde se encuentra el componente que contiene el `debugger;`

5. Automaticamente el navegador abre la pestaña "Fuentes" ("Sources") de las devtools donde puede ver el código a depurar que contiene `debugger;`

# Arquitectura del Proyecto

> [!TIP]
> # 🧠 **Aprende antes de pedir cambios**
>
> No te limites a pedirle a la IA *"hazme X"* sin entender cómo funciona la arquitectura del proyecto.
>
> Hazle preguntas a la IA sobre:
>
> 1. [`AGENTS.md`](https://youtu.be/eS5HmdpcqnM?si=D7X-HFPQAfCkZ4Ks)
> 2. `.claude/skills/***`
> 3. Los **"🔗 Enlaces"**
>
> Hasta comprender cómo funciona el proyecto.
>
> Aunque es un texto largo, aprenderás la arquitectura, buenas prácticas y a detectar revisando el código, cuando la IA alucina

# [🔗 Enlace - HTTP Cats - Explicación de los Status HTTP](https://http.cat/)

# 🤖 Uso de IA

> [!CAUTION]
> # ⚠️ **IMPORTANTE** 🚨
>
> ****Ignorar esta sección ocasionará que la IA genere código que no respeta la arquitectura, estructura ni las convenciones del proyecto, produciendo código legacy, inconsistente, desordenado y con malas practicas****

## Principales IA para Desarrollo de Software

| Empresa ⬇️ / Plataforma ➡️ | Web                                                                                     | Desktop                                                               | Terminal / Bash / CLI                                              |
| --------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Anthropic                   | [Claude Web](https://claude.ai/)                                                        | [Claude Desktop](https://youtu.be/DYwZy7VNKws?si=cXTPumpZ3Jr9rNn9)    | [Claude Code](https://youtu.be/Bf7hfpItrDk?si=wjUIcIgtDX_Loyey)    |
| Open AI                     | [Chat GPT](https://chatgpt.com/)                                                        | [GPT Codex Desktop](https://youtu.be/bgx8ownl3O4?si=TzbOntfYIBVN1PGU) | [Codex](https://youtu.be/Ub-K1n4YYsg?si=EoIXGCzEa4ZxyRqA)          |
| Google                      | [Google AI Studio](https://aistudio.google.com/) / [Gemini](https://gemini.google.com/) | [Antigravity 2.0](https://antigravity.google/product/antigravity-2)   | [Antigravity CLI](https://youtu.be/bdEqIchP4x4?si=gRf6iLggXuzy_cq) |
| Anomaly Innovations         | [`opencode web`](https://opencode.ai/docs/web/)                                         | [Open Code Desktop](https://youtu.be/_SVSv2Y59P0?si=LT2S0z10t1FBxlB6) | [Open Code CLI](https://youtu.be/2gO8WyctqMk?si=aNvHlf23tKfrN-Z3)  |
| Cursor                      | [Cursor Web](https://cursor.com/agents)                                                 | [Cursor Desktop](https://youtu.be/XWsOQTqVl0w?si=0OVGRnYSCH46v2zf)    | [Cursor CLI](https://cursor.com/es/cli)                            |


> [!TIP]
> # 🧠 Mira estos enlaces 🔗 para que aprendas de IA enfocada en desarrollo de Software:
>
> ## 1. [Benchmark de IA](https://artificialanalysis.ai/)
> ## 2. [Categorización de los tipos de IA: Modelos, Harnesses y Orquestadores](https://youtu.be/_HxDbdItVcs?si=VB6SHcZB1enB2Qvl)
> ## 3. [Mejores Modelos de IA](https://youtu.be/EPz00z1ACPc?si=Dkw3zECIk1d84YxX)
> ## 4. [Mejores Harnesses de IA](https://youtu.be/Fzn9uWRRDXM?si=NJJmsOYuzTXl_aad)
> ## 5. [Mejores Orquestadores de IA](https://youtu.be/rANNn5fIVmg?si=RxFAUjPUEYzXJpbq)
> ## 6. [Desarrollo de software con IA: MCP, CLI, RAG](https://youtu.be/sn1o1Hr1pJs)

## ✏️ Edición de Código
Este proyecto esta configurado para usar _IAs de pago y desde la terminal_. **NO** sirve si usas IAs gratis o desde una pagina web, porque estan limitadas.

**Razones:**
* Si copias y pegas codigo desde plataforma web al proyecto, es probable que cometas errores

Las IAs de pago y desde la terminal tienen mejoras respecto a otras plataformas:

* Mayor comprensión del proyecto y de la estructura completa del código (_contexto_ y _tokens_).

* Acceso al sistema operativo (archivos y carpetas) y capacidad para ejecutar comandos.

* Capacidad para realizar cambios respetando la arquitectura del proyecto.

* Uso de Skills y MCP para reducir las _alucinaciones_ de la IA, permitiéndole a la IA consultar documentación oficial actualizada y seguir buenas prácticas.

# Configurar Claude Code

## Cambiar Idioma de Claude Code a Español

1. Abrir el archivo que esta en la ruta

```console
C:\Users\NOMBRE_USUARIO\.claude\settings.json
```

2. Agregar la propiedad [`language`](https://code.claude.com/docs/es/settings-reference#language) con el valor `spanish`:

```json
{
  "language": "spanish"
}
```

## Eliminar Skills Innecesarias (Bloatware) que Estan Preinstaladas en Claude Code
Esto ayuda a mejorar el consumo de tokens y contexto de Claude

1. En el explorador de archivos abrir la siguiente ruta:

```console
C:\Users\NOMBRE_USUARIO\.claude\skills\synced\ID_CARPETA
```

2. Las carpetas que estan aqui dentro son skills globales preinstaladas, puedes eliminar las siguientes carpetas:

| Carpeta | ¿Para qué sirve? |
| --- | --- |
| `\docs` | Crear y editar documentos colaborativos en claude.ai (memo, spec, PRD, runbook) a través del connector Claude Docs. |
| `\docx` | Crear, leer y editar archivos de Word (`.docx`, `.dotx`) |
| `\import-memory` | Importar a la memoria de Claude las memorias exportadas desde otro asistente de IA (ChatGPT, Gemini, etc.). |
| `\morning` | Generar un resumen matutino del día en HTML, o programarlo como tarea recurrente entre semana. |
| `\pdf` | Crear, leer y editar archivos de PDF |
| `\pptx` | Crear, leer y editar diapositivas de PowerPoint (`.pptx`, `.potx`) |
| `\xlsx` | Crear, leer y editar archivos de Excel (`.xlsx`, `.xlsm`, `.csv`, `.tsv`) |

3. Borrar esas carpetas solo las elimina del computador: Claude Code las vuelve a descargar en la siguiente sincronizacion con la cuenta de claude.ai. Para evitarlo, abrir de nuevo el archivo:

```console
C:\Users\NOMBRE_USUARIO\.claude\settings.json
```

4. Agregar la propiedad [`syncClaudeAiSkills`](https://code.claude.com/docs/es/settings-reference#syncclaudeaiskills) con el valor `false`:

```json
{
  "syncClaudeAiSkills": false
}
```

# 🅰️ Configurar Angular para que Funcione con IA
Estas configuraciones ya estan listas para funcionar. Solo debes seguir los pasos a continuación para verificar que funcionen correctamente.

# Antes de Probar que Funcione Angular con IA
Hacer esto:

1. Abrir Git Bash

2. Abrir la carpeta del proyecto
```console
cd /ruta/a/carpeta/raiz/del/proyecto
```

3. Ejecutar claude con todos los permisos:

```console
claude --dangerously-skip-permissions
```

# [📜 `AGENTS.md`](https://youtu.be/eS5HmdpcqnM?si=D7X-HFPQAfCkZ4Ks)
Es un prompt que siempre se envia a Claude. Sirve para que Claude:
* Respete la arquitectura de software del proyecto.

* Consulte la [documentacion oficial de Angular](https://angular.dev/llms.txt).

* Use Angular moderno y no legacy.

`AGENTS.md` esta basado en [este link de la documentacion oficial de Angular](https://angular.dev/ai/develop-with-ai)

Para probar que funcione envia este prompt a Claude:

```txt
citarme textualmente de `angular-cli` MCP ¿que es Signal? y ejemplo
```

La salida debe contener algo similar a esto:

```txt
Angular Signals is a system that granularly tracks
how and where your state is used throughout an application,
allowing the framework to optimize rendering updates.
```

# Diferencia entre Skills y MCP

**Skill:** Es un archivo Markdown llamado `SKILL.md` que contiene instrucciones para enseñarle a la IA cómo ejecutar un proceso, o para darle conocimiento sobre un tema. La IA carga ese contenido directamente en su contexto antes de responder.

**Model Context Protocol (MCP):** Es un protocolo (no es exactamente una API REST, aunque es similar) que permite que una IA se comunique con sistemas externos —herramientas, servicios o fuentes de datos— de forma estandarizada. Un servidor MCP puede exponer *tools* (funciones que la IA puede invocar), *resources* (datos) y *prompts* (plantillas)

## Diferencia entre MCP `angular-cli` y Skill `angular-developer`
Ambos son mantenidos por el equipo oficial de Angular (Google), y tambien le enseñan a la IA como hacer codigo con Angular. La diferencia es:

**MCP `angular-cli`** expone *tools* que la IA invoca en tiempo real, como `search_documentation` (busca en la documentación oficial de angular.dev) y `get_best_practices` (obtiene la guía oficial de buenas prácticas). El MCP no almacena esa teoría: la consulta dinámicamente cada vez que se necesita. Su contenido es la teoria de Angular

**skill `angular-developer`** Su contenido siempre es el mismo, a diferencia de MCP `angular-cli`, contiene mas ejemplos de la teoiria de Angular

# Skills

## 🔗 Enlaces con Respositorios de Skills

* ## [Skills escritas por el equipo oficial de Angular (Google)](https://github.com/angular/skills)

* ## [Web de Vercel con múltiples repositorios de Skills sobre distintos temas](https://www.skills.sh/)

* ## [Skills para UI / Maquetación](https://www.ui-skills.com/)

* ## [Skills de Anthropic AI](https://github.com/anthropics/skills/tree/main/skills)

* ## [Skills de Open AI](https://github.com/openai/plugins)

## ¿Como Configurar Skills?

> [!NOTE]
>
> Esto es una guia. **NO** debes hacer lo siguiente porque las skills ya estan configuradas
>
> Para explicar como configurar skills, se usa como ejemplo [`angular-developer`](https://github.com/angular/skills)

Hay dos formas:

### Forma 1 - Usando Comando de [www.skills.sh](https://www.skills.sh/):

1. Buscar una skill en [www.skills.sh](https://www.skills.sh/)

2. Ejecutar el comando de la skill a descargar:

```bash
pn dlx skills add https://github.com/angular/angular --skill angular-developer
```

3. La terminal hace las siguientes preguntas:

* ¿Para que IA instalar la skill?
Seleccionar Claude Code

* ¿Cual es el alcance de la skill? (Install scope)
Seleccionar Project

Hay dos alcances:

| Alcance | Disponibilidad                                                       | ¿Se puede compartir con el equipo mediante Git? |
| ------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| Global  | Disponible para la persona que la instala en **todos sus proyectos** | ❌ **No**                                      |
| Project | Disponible **solo en el proyecto actual** donde se instala           | ✅ **Sí**                                      |

4. Mover `.agents\skills\angular-developer` a `.claude\skills\angular-developer`

5. Eliminar `skills-lock.json`

### Forma 2 - Descargar Skill sin Comando
1. Buscar un repositorio con una skill

2. Descargar el repositorio

3. Mover la skill a `.claude\skills\NOMBRE-DE-LA-SKILL\SKILL.md`

### Ver Skills Instaladas
Para ver la lista de skills ejecutar el comando `/skills` dentro de Claude Code

## 🌿 `git-commit`
Por cada feature terminada hacer un commit antes de solicitar nuevas modificaciones a la IA. Evita acumular demasiados cambios, ya que puedes perder el contexto de lo que la IA está realizando y cometer errores.

Trabajar bajo el principio:

> 1 commit = 1 feature

El skill `.claude\skills\git-commit\SKILL.md` te permite realizar commits.

***Ejemplos de prompt:***

```console
git commit y git push
```

## 🌐 `playwright-cli` y `browser-agent`

> [!CAUTION]
> # ⚠️ Advertencia
>
> Usar esta skill con ciudado, es muy buena, pero:
> 1. Gasta muchos tokens.
>
> 2. Si intentas solucionar un bug con esta skill sin entender el código, es probable que introduzcas nuevos bugs.

Mira [este video](https://youtu.be/OXZRQ3BwHxQ?si=gOguZh7KLQ3aWBlE) para que aprendas ¿que es `playwright-cli`?

Sirve para que la IA (Claude Code) desde la terminal pueda controlar el navegador: navegar por páginas (rutas), hacer clics y llenar formularios sin hacerlo manualmente.

Las skills son **DIFERENTES**:

* **`playwright-cli`**: Lista y explicación de los comandos que permiten a la IA controlar el navegador.

* **`browser-agent`** Esta skill llama a la skill `playwright-cli` y le explica a la IA como usar `playwright-cli` para automatizar un proceso o solucionar un bug.

`browser-agent` se usa para lo siguiente:

| Pregunta ⬇️ / Modo ➡️                                                          | Modo AUTOMATIZAR                          | Modo DEPURAR                                 |
|---------------------------------------------------------------------------------|-------------------------------------------|----------------------------------------------|
| ¿Para qué sirve?                                                                | Ejecutar o automatizar un flujo de la app | Encontrar la causa de un bug                 |
| ¿Escribe codigo de testing en Jest, Vitest, etc?                                | ❌ No                                     | ❌ No                                       |
| Ejemplo de uso                                                                  | Llenar un formulario muchas veces         | La pagina web no es responsive, corrigela    |
| Modifica código fuente                                                          | ❌ No                                     | ✅ Sí                                       |
| Diagnostica (logs del server, `curl -i`/`-v`, cuerpo y headers de la respuesta) | ❌ No                                     | ✅ Sí                                       |
| ¿Ejecuta ESLint?                                                                | ❌ No                                     | ✅ sí, pero solo si ESLint está configurado |
| ¿Genera el build de la aplicacion?                                              | ❌ No                                     | ✅ Sí                                       |
| ¿Abre el navegador y usa comandos de `playwright-cli`?                          | ✅ Sí                                     | ✅ Sí                                       |
| ¿Pide usuario y contraseña y hace login?                                        | ✅ Sí                                     | ✅ Sí                                       |

**SIEMPRE** que necesites controlar el navegador con la IA:
1. Detener la ejecucion del proyecto

2. Llamar la skill `browser-agent` y **NO** la skill `playwright-cli`.

3. Usar este prompt:

***Ejemplo de Prompt:***
```txt
/browser-agent <<< Aqui describir de forma MUY DETALLADA
la funcionalidad a testear o el proceso a automatizar,
para mejorar el resultado es bueno decirle a Claude
rutas especificas de donde estan los archivos, componentes, funciones, etc.
que necesita para ejecutar el proceso >>>
```

## 💻 [`angular-developer`](https://github.com/angular/skills)
Skill del equipo oficial de Angular (Google) que contiene un resumen de la documentación oficial con ejemplos

Para probar que funcione envia este prompt a Claude:

```txt
/angular-developer de la skill citarme textualmente Angular Aria, titulo Styling Headless Components
```

La salida debe contener algo similar a esto:

```txt
Because Angular Aria components are headless,
they do not come with default styles (...)
```

# MCP

# [🔗 Enlace - Repositorios de MCP](https://mcpservers.org/es/)

## ¿Como Configurar MCP?

> [!NOTE]
>
> Esto es una guia. **NO** debes hacer lo siguiente porque el MCP ya esta configurado
>
> Para explicar como configurar MCP, se usa como ejemplo `angular-cli MCP`

1. Este comando instala el MCP de `angular-cli` con el `--scope project`. Es decir, configura el MCP para que se ejecute únicamente en este proyecto y pueda compartirse con el resto del equipo mediante Git:

```bash
!claude mcp add angular-cli --scope project -- pnpm dlx @angular/cli mcp
```

2. Verificar de que el comando automaticamente haya creado archivo `.mcp.json` en la ruta raiz del proyecto que contenga:

```json
{
  "mcpServers": {
    "angular-cli": {
      "type": "stdio",
      "command": "pnpm",
      "args": [
        "dlx",
        "@angular/cli",
        "mcp"
      ],
      "env": {}
    }
  }
}
```

## `angular-cli MCP`

Sirve para que la IA acceda a la documentación oficial de angular. Esto permite que la IA tenga datos actualizados de como escribir codigo de Angular.

También cuenta con muchas otras funcionalidades (tools) disponibles en este enlace. Es **IMPORTANTE** que leas este enlace:

# [🔗 Enlace - Tools de `angular-cli` MCP](https://angular.dev/ai/mcp)

Para que funcione el  `angular-cli` MCP solamente la primera vez que haces `git pull` del repositorio es necesario hacer los siguientes pasos:

1. Seleccionar la opcion

```txt
2. Use this and all future MCP servers in this project
```

2. Para verificar conexión al MCP, ejecutar:

```console
!claude mcp list
```

La salida de la terminal debe ser:
```console
angular-cli: pnpm dlx @angular/cli mcp - ✔ Connected
```

```console
/mcp
```

La salida de la terminal debe ser:
```console
❯ angular-cli · ✔ connected · 9 tools
```

Ejecutar este prompt:
```console
usar la tool search_documentation de angular-cli MCP para citar textualmente la definición de Forms with signals
```

La salida de la terminal debe incluir:

```console
Called angular-cli

Signal Forms manage form state using
Angular signals to provide automatic synchronization between
your data model and the UI with Angular Signals
```

La cita corresponde a [este link de la documentación oficial de Angular](https://angular.dev/essentials/signal-forms)

# Ejemplos de Prompts de ¿Como Usar IA en Este Proyecto?

**Iniciar tutorial paso a paso:**
```txt
usar la tool ai_tutor de angular-cli MCP para explicarme Forms with signals
```

**Refactorizar:**
```txt
usar get_best_practices de angular-cli MCP para refactorizar el componente que esta en la ruta src/***
```

**Migrar a Signals:**
```txt
usar search_documentation de angular-cli MCP para migrar a signals el componente que esta en la ruta src/***
```

# Reglas Obligatorias para Skill
Aplican a toda respuesta o modificación de código de este proyecto.

## 1. Autoridad de la Skill
Las decisiones de arquitectura, estructura y convenciones definidas en esta skill son la fuente de la verdad del proyecto. No las cuestiones, no las reemplaces, no las contradigas y no las ignores. Desobedecerlas genera malas practicas y código inescalable. Esta restricción aplica solo a lo que la skill define de forma explícita; fuera de ese alcance rige el [4. Caso no Definido en la Skill](#4-caso-no-definido-en-la-skill).

## 2. Ante Cualquier Error
Esta regla aplica en cualquier momento. Si encuentras algún error, inconsistencia, duda o ambigüedad, debes detenerte y consultarme antes de realizar cualquier modificación. No puedes asumir ni deducir implementaciones. Es preferible preguntar para aclarar una duda que asumir una solución.

La única excepción a esta regla es lo establecido en la regla anterior: [1. Autoridad de la Skill](#1-autoridad-de-la-skill).

## 3. Instrucción que Contradice una Regla Definida
Se aplica cuando la instrucción recibida contradice una regla explícitamente definida en esta skill.

Acción: implementa estrictamente lo definido en la skill. No preguntes, no propongas alternativas, no pidas confirmación.

Antes de modificar el código, emite:

```txt
ERROR: estás violando la arquitectura del proyecto, esto genera malas
prácticas. Se va a modificar el código conforme a la arquitectura definida
en la skill.

Regla violada:  <archivo#sección de la skill>
Cita textual:   "<texto literal de la regla, copiado de la skill>"
Solicitado:     <lo que pidió el usuario>
Implementado:   <lo que define la skill>
Motivo:         <por qué lo solicitado rompe la arquitectura, en una línea>
```

La cita debe ser literal, no una paráfrasis. Si no puedes copiar el texto exacto de la skill, la regla no está definida: aplica [4. Caso no Definido en la Skill](#4-caso-no-definido-en-la-skill)

## 4. Caso no Definido en la Skill
Se aplica cuando el caso, problema o pregunta no está definido en la [Tabla de Contenido](#tabla-de-contenido)

Acción: resuélvelo con tu comportamiento por defecto. La skill no restringe este caso y no altera tu forma normal de trabajar.

## 5. Código Existente que Ya Viola la Arquitectura
Se aplica cuando detectas código ya escrito que incumple una regla de esta skill.

No lo corrijas por iniciativa propia. Emite:

```txt
El siguiente código viola la arquitectura del proyecto.

Archivo:       <ruta:línea>
Código:        "<fragmento literal del código>"
Regla violada: <archivo#sección de la skill>
Cita textual:  "<texto literal de la regla>"
```

y pregunta con `AskUserQuestion`:

```txt
¿Desea corregirlo para que siga la arquitectura del proyecto?
SÍ  → corregir el código
NO  → dejarlo como está
```

* SÍ: corrige el código y continúa.
* NO: no modifiques ese código, ignora esa parte específica y continúa con la
  implementación solicitada.

Si detectas varias infracciones en la misma pasada, agrúpalas en una sola llamada a `AskUserQuestion`, una pregunta por infracción.

## 6. ¿Como Leer la Skill?
Leer **bajo demanda** los archivos `.md` ubicados en `/skills/angular-conventions/rules/`: usa la [Tabla de Contenido](#tabla-de-contenido) como referencia para inferir cuales archivos son necesarios para la tarea que estas resolviendo, y accede unicamente a esos archivos.

**Razon**: Leer todos los archivos consume contexto y tokens innecesariamente.

# Tabla de Contenido

# INCOMPLETO - aqui me falta escribir la tabla de contenido con la estructura de archivos, carpetas y titulos de /rules - para tabla de contenido usar  enlace en línea con ruta relativa ejemplo [angular-animations.md](references/angular-animations.md)

**esto es un ejemplo de como crear la tabla de contenido de la skill - NO representa la tabla de contenido real**

## Arquitectura

| Título y ruta archivo | ¿Cuándo leerlo? |
| --- | --- |
| [Las tres capas](rules/arquitectura/capas.md) | Antes de crear cualquier archivo o carpeta nueva, o al dudar qué significa Feature, Core o Shared |
| [Regla de decisión](rules/arquitectura/regla-de-decision.md) | Al decidir en qué capa ubicar un archivo, o cuando dos features necesitan el mismo código |
| [Dirección de dependencias](rules/arquitectura/direccion-de-dependencias.md) | Antes de escribir un import entre capas distintas |

## Formularios

| Archivo | ¿Cuándo leerlo? |
| --- | --- |
| [React Hook Form](rules/formularios/react-hook-form.md) | Al crear o modificar cualquier formulario, o al agregar lógica condicional entre campos |
| [Inputs reutilizables](rules/formularios/inputs-reutilizables.md) | Al crear o modificar un componente dentro de src/shared/ui/shad-cn/react-hook-form |

# Estructura del Proyecto

## Árbol de Directorios
La siguiente estructura NO es una lista exhaustiva de los archivos del proyecto, es la **arquitectura base de referencia**: el patrón que define cómo se organiza el código y que toda la aplicación debe seguir, sin importar cuánto crezca el proyecto o cuántas features se agreguen.

```txt
src/
├── assets/
│   ├── icon/ → Iconos del proyecto
│   └── img/ → Imágenes del proyecto
│
├── environments/ → variables de entorno
│   ├── data-types/
│   │   └── interfaces/
│   │       └── environment.interface.ts → Tipos de datos de las variables de entorno
│   │
│   ├── environment.localhost.ts → Variables de entorno de local host (desarrollo)
│   ├── environment.prod.ts → Variables de entorno de producción
│   └── environment.test.ts → Variables de entorno de pruebas
│
├── app/
│   ├── app.routes.ts → Definición de rutas (URL)
│   │
│   └── features/ → Contiene todas las rutas y componentes después de iniciar sesión
│       ├── auth/ → Rutas de autenticación
│       │   ├── asignar-nueva-clave/ → Recuperar y cambiar la contraseña
│       │   ├── iniciar-sesion/ → Iniciar sesión
│       │   ├── recuperar-clave/ → Enviar correo para recuperar contraseña
│       │   ├── registrarme/ → Formulario de registro de nuevo usuario
│       │   │
│       │   ├── design/ → maquetación utilizada únicamente por auth
│       │   │   └── layouts/
│       │   │       └── main-auth/ → contenedor principal de las páginas de autenticación
│       │   │
│       │   └── data-types/ → tipos de datos, contratos, constantes y definiciones utilizados exclusivamente por auth
│       │       ├── constants/
│       │       └── interfaces/
│       │
│       └── tareas/ → Feature independiente que define la ruta `/tareas`.
│           ├── tasks.component.html
│           ├── tasks.component.ts
│           │
│           ├── data-types/ → tipos de datos, contratos, constantes y definiciones utilizados exclusivamente por la feature tareas. Pueden representar conceptos de negocio específicos de la feature, por lo que no deben utilizarse desde otras features
│           │   ├── constants/
│           │   ├── interfaces/
│           │   ├── enums/
│           │   └── types/
│           │
│           ├── components/ → componentes reutilizables internos de la feature tareas. Pueden contener lógica, dependencias y acceso a servicios de esta feature. Su alcance está limitado a tareas y no deben utilizarse desde otras features
│           │
│           ├── ui/ → componentes visuales reutilizables utilizados únicamente por la feature tareas. Están enfocados en la presentación de la interfaz y deben mantenerse desacoplados de la lógica de negocio
│           │
│           └── services/ → servicios, lógica de negocio y gestión de estado utilizados únicamente por la feature tareas. Pueden depender de modelos, reglas de negocio y casos de uso específicos de la feature. Su alcance está limitado a tareas y no deben utilizarse desde otras features.
│               └── stores/ → estados compartidos por los componentes de la feature tareas. Su alcance está limitado a esta feature y no debe utilizarse para compartir estado con otras features ni para estado global de toda la aplicación
│
├── core/ → INCOMPLETO - me falta definir esta carpeta
│
├── shared/ → utilidades compartidas (globales), totalmente agnosticas a la logica de negocio/domio que se pueden usar en cualquier parte de la web
│   ├── guards/
│   │   └── auth.guard.ts → protección de rutas de todos los componentes que estan despues de loguearse
│   │
│   ├── design/ → componentes relacionados con la maquetacion (presentación)
│   │   ├── layouts/ → contenedores que definen la estructura visual y de navegación de una sección completa de la aplicación
│   │   │   └── main-wrapper/ → contenedor principal de paginas despues de loguearse
│   │   │
│   │   └── ui/ → componentes visuales reutilizables que representan partes aisladas de la interfaz, no páginas ni estructuras de navegación completas
│   │       ├── menu/ → Componente de menú
│   │       └── spartan-ng/ → componentes helm de Spartan NG (`@spartan-ng/*`)
│   │           │
│   │           ├── data-display/ → componentes que presentan datos al usuario
│   │           │   ├── carousel/ → carrusel de slides
│   │           │   └── data-table/ → tabla de datos con @tanstack/angular-table, paginación y sorting
│   │           │
│   │           ├── form/ → controles de formulario y sus dependencias, subagrupados por el tipo de interacción
│   │           │   ├── action/ → dispara una acción, no captura un valor del formulario
│   │           │   │   └── button/ → botón
│   │           │   ├── date/ → selección de fechas
│   │           │   │   ├── calendar/ → calendario
│   │           │   │   └── date-picker/ → selector de fecha sobre popover
│   │           │   ├── selection/ → elegir entre opciones predefinidas
│   │           │   │   ├── checkbox/ → casilla de verificación
│   │           │   │   ├── combobox/ → input con autocompletado
│   │           │   │   ├── radio-group/ → grupo de opciones excluyentes
│   │           │   │   ├── select/ → desplegable de selección
│   │           │   │   └── switch/ → interruptor on/off
│   │           │   └── text/ → entrada de texto libre y su etiqueta
│   │           │       ├── input/ → campos de texto de una línea
│   │           │       │   ├── input-base/ → renderiza el `<input>` nativo y recibe `type` como input; PROHIBIDO usarlo fuera de `src/shared`
│   │           │       │   ├── input-text/ → input de texto libre
│   │           │       │   ├── input-number/ → input numérico
│   │           │       │   ├── input-password/ → input de contraseña con botón toggle mostrar/ocultar valor
│   │           │       │   ├── input-email/ → input de correo
│   │           │       │   └── input-group/ → agrupa un input con prefijos/sufijos (íconos, texto, botones)
│   │           │       ├── label/ → etiqueta de un control
│   │           │       └── textarea/ → campo de texto multilínea
│   │           │
│   │           ├── navigation/ → componentes de navegación
│   │           │   ├── accordion/ → secciones plegables
│   │           │   ├── pagination/ → paginación
│   │           │   └── tabs/ → pestañas
│   │           │
│   │           ├── overlay/ → componentes que se superponen al contenido
│   │           │   ├── alert-dialog/ → diálogo de confirmación
│   │           │   ├── dialog/ → diálogo modal
│   │           │   ├── drawer/ → panel deslizante
│   │           │   ├── dropdown-menu/ → menú desplegable
│   │           │   ├── popover/ → contenido flotante anclado
│   │           │   ├── sheet/ → panel lateral
│   │           │   ├── toast/ → notificación temporal (Sonner)
│   │           │   └── tooltip/ → descripción emergente
│   │           │
│   │           └── helpers/ → expone `hlm()` y `classes()` para combinar clases de Tailwind, y `provideSpartanHlm()`, usados por todas las categorías
│   │
│   ├── services/ → servicios reutilizables de alcance global que pueden ser utilizados por múltiples features de la aplicación. Encapsulan lógica transversal, infraestructura, acceso a APIs, utilidades técnicas y gestión de estado compartido. No deben depender de reglas de negocio específicas de una feature.
│   │   ├── Crypto.service.ts → Encriptar y desencriptar texto y objeto literal usando crypto-js
│   │   ├── DataType.service.ts → funciones para tipos de datos de JS, ejemplo normalizar string
│   │   ├── DownloadFile.service.ts → funciones para descargar y ver archivos
│   │   ├── Luxon.service.ts → funciones para fechas usando Luxon
│   │   ├── SessionStorage.service.ts → manejo de `sessionStorage`, codifica y decodifica en Base64 y realiza conversión automática de tipos de datos (string, number, boolean, null, undefined, array y object) al guardar y recuperar la información.
│   │   └── Toast.service.ts → notificaciones tipo toast
│   │
│   └── http-client/ → infraestructura centralizada de HTTP: interceptors, normalización de respuestas, logging y loader global
│       ├── data-types/
│       │   └── interfaces/
│       │       └── http-client.interface.ts → contrato ApiResponse<T>: estructura estándar de respuesta de la API (success, status, message, data)
│       │
│       ├── interceptors/
│       │   ├── headers/ → interceptors que asignan headers HTTP de forma dinámica y agnóstica al dominio (no dependen de la lógica de negocio de ninguna feature)
│       │   │   ├── accept.interceptor.ts → asigna dinámicamente el header Accept en cada petición HTTP
│       │   │   └── content-type.interceptor.ts → asigna dinámicamente el header Content-Type en cada petición HTTP
│       │   │
│       │   ├── timeout.interceptor.ts → aplica tiempo máximo de 1 minuto por petición; si se supera, aborta y emite respuesta sintética con status 408
│       │   └── with-credentials.interceptor.ts → agrega withCredentials solo a los servicios internos (URLs que empiezan por environment.api); lo excluye en las APIs externas de terceros y en los endpoints de URLS_WITHOUT_CREDENTIALS
│       │
│       ├── response/ → normalización y manejo de respuestas HTTP (éxito y error) al contrato ApiResponse<T>
│       │   ├── success.interceptor.ts → intercepta respuestas HTTP exitosas y las normaliza al contrato ApiResponse<T>
│       │   │
│       │   └── error-handling/ → manejo de respuestas HTTP erróneas, separado por responsabilidad única (SRP)
│       │       ├── error.interceptor.ts → captura errores HTTP, delega el manejo global, normaliza al contrato ApiResponse<T>, loguea y "se traga" el error (nunca lo propaga con throw)
│       │       │
│       │       └── services/
│       │           ├── global-error-handler.service.ts → orquestador: según el código de estado delega en el handler correspondiente (0, 401, 403, 404, 429, 5xx)
│       │           ├── error-handler-helper.service.ts → helpers de navegación compartidos entre los handlers (pathnameIsLogin, redirectToLogin, returnToBrowserHistory)
│       │           │
│       │           └── handlers/ → cada handler resuelve un único tipo de error HTTP (responsabilidad única)
│       │               ├── network-error.handler.service.ts → status 0: la petición nunca recibió respuesta (sin internet, CORS, DNS o servidor caído); loguea en consola y notifica que no se pudo conectar
│       │               ├── unauthenticated-error.handler.service.ts → status 401: redirige a /iniciar-sesion, oculta el loader y notifica con Toast
│       │               ├── forbidden-error.handler.service.ts → status 403: vuelve atrás en el historial y notifica "acceso denegado"
│       │               ├── not-found-error.handler.service.ts → status 404: loguea en consola y notifica un error genérico
│       │               ├── too-many-requests-error.handler.service.ts → status 429: loguea en consola y notifica que se espere antes de reintentar
│       │               └── server-error.handler.service.ts → status >= 500: loguea en consola y notifica un error genérico
│       │
│       ├── services/
│       │   ├── api-response-normalizer.service.ts → valida y normaliza todas las respuestas HTTP al contrato ApiResponse<T>; usado por success.interceptor, error.interceptor y timeout.interceptor
│       │   └── http-log.service.ts → logging por consola de peticiones HTTP (exitosas, erróneas y timeout); desactivable por petición con el token HTTP_LOG_ENABLED
│       │
│       └── loader/ → módulo que centraliza el icono de carga global (componente, interceptor y estado)
│           ├── design/
│           │   └── ui/
│           │       └── fixed-loader/
│           │           ├── fixed-loader.component.html → template del icono de carga con position: fixed centrado en pantalla
│           │           └── fixed-loader.component.ts → componente del icono de carga global
│           │
│           ├── interceptors/
│           │   └── loader.interceptor.ts → controla la visibilidad del loader con un contador de peticiones HTTP activas; desactivable por petición con el token SHOW_LOADER
│           │
│           └── services/
│               └── stores/
│                   └── loader.store.ts → estado global con signals para mostrar y ocultar el icono de carga
│
└── styles/
    └── global/
        ├── scss/
        │   ├── main.scss → con @use importa estilos .scss globales de toda la pagina web, NO debe contener estilos directos
        │   ├── _scroll-bar.scss → estilos globales de barra de scroll
        │   ├── _variables.scss → variables globales de Sass
        │   │
        │   └── buttons/ → estilos globales de botones organizados en archivos .scss composables que permiten combinar variantes, tamaños, estados y temas
        │       ├── index-buttons.scss → con @use importa estilos .scss para los botones, NO debe contener estilos directos
        │       ├── _base.scss → Reset CSS para botones
        │       ├── _effects.scss → utilidades visuales reutilizables para los botones: box-shadow, blur, elevation (sin lógica UI)
        │       ├── _modifiers.scss → alteran/extienden características de los botones sin sobrescribir sus estilos principales
        │       ├── _sizes.scss → Define el tamaño del botón mediante tokens basados en la escala de Tailwind CSS 4 para padding, font-size y line-height
        │       ├── _states.scss → estados de boton: hover, active, focus, disabled
        │       ├── _themes.scss → Define los temas de color del botón mediante CSS Custom Properties generadas a partir de _tokens.scss.
        │       ├── _tokens.scss → Define los tokens de diseño del sistema de botones mediante variables Sass (colores, tipografía, espaciado y escalas).
        │       ├── _mixins.scss → codigo de Sass que se repite en diferentes archivos de src\styles\global\scss\buttons
        │       └── _variants.scss → Variantes visuales (background, outline, ghost, link) que define la apariencia y comportamiento visual según el tipo de botón.
        │
        └── tailwind/ → Carpeta para configurar Tailwind 4
            ├── import.css → importar Tailwind
            ├── preflight.css → Reset CSS basado en Tailwind
            └── theme.css → variables de Tailwind
```

## Sufijos en Nombres de Archivos
[Angular moderno eliminó la necesidad de usar sufijos](https://angular.dev/cli/new#options) como `.component`, `.service`, `.directive`, `.pipe`, etc. porque el decorador de Angular (`@Component`, `@Injectable`, etc.) ya indica qué hace el archivo.

**Regla:**
Aunque Angular moderno ya no obliga a usar sufijos, en este proyecto **sí** se usan, porque hacen explícito el tipo de cada archivo en su nombre, lo que evita ambigüedades y mantiene la consistencia al recorrer carpetas y leer imports en un proyecto grande.

### ¿Dónde Están Definidos los Sufijos?
En `angular.json`, en la key `schematics` del proyecto `front`, que está dentro de la key `projects`:

```jsonc
{
  "projects": {
    "front": {
      "schematics": {
        // aquí dentro está definido el sufijo de cada tipo de archivo
      }
    }
  }
}
```

Cada entrada de `@schematics/angular` dentro de esa key define el sufijo con el que el Angular CLI genera ese tipo de archivo.

## Idioma de Código, Archivos y Carpetas
Todo el código fuente se escribe en inglés: métodos, servicios, nombres de archivos y carpetas, etc., excepto [Qué va en español](#qué-va-en-español).

### Qué va en español
1. Los comentarios.

2. Los `value` de la key `path` definidos en `src/app/app.routes.ts`.

3. Las carpetas dentro de `src/app/features/<feature>` que representen una ruta de navegación y estén asociadas a una configuración de ruta (`Route`) en `src/app/app.routes.ts`.

**Explicación**
Toda carpeta dentro de `<feature>` que represente una ruta de navegación, y que esté asociada a una entrada del arreglo `routes: Routes` en `src/app/app.routes.ts`, debe nombrarse en español.

**Ejemplo**

```typescript
// src/app/app.routes.ts

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/app/features/auth/design/layouts/main-auth/main-auth.component').then(
        (c) => c.MainAuthComponent,
      ),
    children: [
      {
        path: 'iniciar-sesion', // value de path en español
        loadComponent: () =>
          import('@/app/features/auth/login/login.component').then((c) => c.LoginComponent),
      },
    ],
  },
];
```

Los `value` de `path` son segmentos de la URL de navegación, por lo que:

1. Las carpetas dentro de `src/app/features/<feature>` que representan rutas se nombran en español.

2. Cada una está asociada a su respectivo `path` dentro del arreglo `routes: Routes` en `src/app/app.routes.ts`.

3. Los `value` de `path` también van en español.

El resto del código dentro de esa carpeta (archivos `.ts`, clases, componentes standalone, métodos, variables, etc.) se mantiene en inglés:

```txt
src/app/
└── features/
    └── tareas/
        ├── components/
        ├── services/
        │   └── helpers/
        ├── tasks.component.html
        └── tasks.component.ts
```

## Feature Architecture
Este proyecto utiliza Feature Architecture sobre Angular

La regla principal es:

* La lógica de negocio pertenece a una feature.

* El código agnóstico al negocio pertenece a `shared`.

Un archivo no debe moverse a `shared` únicamente porque se reutiliza en varias `features`

La reutilización no convierte automáticamente un archivo en código compartido (`shared`)

## Regla de Ubicación de Archivos y Carpetas

> [!WARNING]
> # ***INCOMPLETO - verificar manualmente otra vez todo este readme md, para pasar readme md de next a angular***

## Diferencia entre `src/app/features` y `src/shared`

### `src/app/features`

Contiene código específico de una funcionalidad del sistema.

Todo archivo que conozca entidades, reglas, procesos o casos de uso del negocio debe permanecer dentro de la feature correspondiente.

La lógica de negocio nunca debe salir de su feature.

**Ejemplo:**
* `src/app/features/*/design/ui`: componentes visuales reutilizables únicamente dentro de la feature.

* `src/app/features/*/design/layouts`: layouts y contenedores utilizados exclusivamente por la feature.

* `src/app/features/*/guards`: guards con reglas de acceso o navegación específicas de la feature.

* `src/app/features/*/services`: servicios con lógica de negocio y funcionalidades propias de la feature.

* `src/app/features/*/services/stores`: gestión de datos propios de la feature.

### `src/shared`

Contiene únicamente código reutilizable y completamente agnóstico al dominio.

`shared` no puede conocer ninguna `feature`.

`shared` no puede contener reglas de negocio.

`shared` no puede contener componentes, servicios o lógica relacionados con usuarios, autenticación, productos, órdenes, dashboard o cualquier otro concepto del dominio.

**Ejemplo:**
* `src/shared/design/ui`: componentes visuales reutilizables globalmente.

* `src/shared/design/layouts`: layouts y contenedores reutilizables.

* `src/shared/guards`: guards reutilizables para control de navegación y acceso, sin lógica de negocio específica de las features

* `src/shared/services`: servicios con lógica reutilizable y utilidades compartidas entre múltiples features.

* `src/shared/services/stores`: estado global de toda la aplicación.

## Diferencia entre `components` y `ui`

### ui

`ui` contiene exclusivamente componentes de presentación y maquetación.

Los componentes de `ui` deben ser completamente agnósticos al dominio.

Un componente de `ui` no puede conocer logica de negocio, entidades del sistema ni casos de uso.

Su única responsabilidad es renderizar interfaz reutilizable.

### components

`components` contiene componentes con lógica de negocio específica de la feature donde están definidos.

Un componente pertenece a `components` cuando conoce el dominio, participa en un caso de uso o implementa comportamiento propio de la funcionalidad.

La lógica de negocio siempre pertenece a `components`, nunca a `ui`.

### Prohibido `src/shared/components`

La carpeta `src/shared/components` está prohibida.

`shared` representa código agnóstico al dominio.

`components` representa componentes con comportamiento funcional asociado a una feature.

Ambos conceptos son incompatibles.

Si un componente es agnóstico al dominio, pertenece a `shared/ui`.

Si un componente contiene lógica de negocio, pertenece a `src/app/features/*/components`.

Por esta razón **NO** debe exitir:

* `src/shared/components`
* `src/app/shared/components`
* `src/app/features/*/shared/components`.

Las únicas ubicaciones válidas para componentes compartidos es:
* `src/shared/design/layouts`

* `src/shared/design/ui`

## Diferencia entre `ui` y `layouts`

### ui

`ui` contiene exclusivamente componentes de presentación y maquetación reutilizables.

Su responsabilidad es renderizar interfaz.

Los componentes de `ui` deben ser completamente agnósticos al dominio y no pueden contener lógica de negocio, casos de uso ni conocimiento de entidades del sistema.

Un componente de `ui` **NO** debe actuar como contenedor principal de una pantalla o sección compleja.

****Ejemplos:****

* Button
* Modal
* Card

### layouts

`layouts` contiene contenedores padre reutilizables encargados de definir la estructura visual de páginas, secciones o flujos.

Su responsabilidad es organizar y componer componentes, proyectar contenido y establecer la distribución general de la interfaz.

Un layout puede contener múltiples componentes de `ui`, pero un componente de `ui` no debe asumir responsabilidades de layout.

****Ejemplos:****

* AuthLayout
* DashboardLayout
* HomeLayout

### Regla de Ubicación

La ubicación depende del alcance de reutilización:

* Si el elemento pertenece únicamente a una feature, debe ubicarse en:
  * `src/app/features/*/design/ui`
  * `src/app/features/*/design/layouts`

* Si el elemento es reutilizable globalmente y no conoce ninguna regla de negocio, debe ubicarse en:
  * `src/shared/design/ui`
  * `src/shared/design/layouts`

La decisión de ubicar un archivo en `features` o `shared` depende de su conocimiento del dominio y alcance de reutilización, no de si es un `ui` o un `layout`.

# Navegación

## Enrutado
El unico archivo de enrutado es `src/app/app.routes.ts`, NO crees otro archivo para enrutado. El enrutado modular esta prohibido.

El nombre de las carpetas dentro de `src/app` tiene que coincidir exactamente con las rutas definidas en `src/app/app.routes.ts`

Esto permite:
* Ubicar los componentes que corresponden a cada URL

* Tener un unico archivo fuente de la verdad que define las rutas

**Ejemplo:**

```txt
src/app/
└── features/
    └── tareas/
        ├── components/
        ├── services/
        │   └── helpers/
        ├── tasks.component.html
        └── tasks.component.ts
```

```ts
// src/app/app.routes.ts

import { Routes } from "@angular/router";
import { AuthGuard } from "@/shared/guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import('@/shared/design/layouts/main-wrapper/main-wrapper.component').then(
        (c) => c.MainWrapperComponent,
      ),

    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],

    children: [
      {
        path: 'tareas',
        loadComponent: () =>
          import('@/app/features/tareas/tasks.component').then((c) => c.TasksComponent),
      },
    ],
  },
];
```

En este ejemplo:

* La URL `/tareas` coincide con la ruta de la carpeta `src/app/features/tareas`

* `TasksComponent` es hijo de `MainWrapperComponent`

* `AuthGuard` protege todas las rutas hijas debido a `canActivateChild`

## Protección de Rutas
Todas las páginas protegidas de la aplicación deben ser `children` de `MainWrapperComponent`.

Los `children` de `MainWrapperComponent` son las rutas protegidas despues de que el usuario se loguea.

```ts
// src/app/app.routes.ts

import { Routes } from "@angular/router";
import { AuthGuard } from "@/shared/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/shared/design/layouts/main-wrapper/main-wrapper.component').then(
        (c) => c.MainWrapperComponent,
      ),

    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],

    children: [
      {
        path: 'tareas',
        loadComponent: () =>
          import('@/app/features/tareas/tasks.component').then((c) => c.TasksComponent),
      },
    ],
  },
];
```

# Fechas

**Reglas:**

1. Usar Luxon para el manejo de fechas y horas. **PROHIBIDO** utilizar `new Date()` nativo de JavaScript o cualquier otra librería de fechas diferente de Luxon.

2. En todos los componentes definidos en la sección [Componentes Permitidos de Calendarios](#componentes-permitidos-de-calendarios), toda su interfaz pública de fechas (`input()` y `output()`, como `dateChange`) es de tipo Luxon `DateTime`.

3. Usar los calendarios  para la selección de fechas definidos en [Componentes Permitidos de Calendarios](#componentes-permitidos-de-calendarios). **PROHIBIDO** usar cualquier otro componente de calendario, incluyendo el `<input type="date">` nativo de HTML.

4. Usar exclusivamente los componentes definidos en la sección [Componentes Permitidos de Calendarios](#componentes-permitidos-de-calendarios) para la selección de fechas. **PROHIBIDO** utilizar cualquier otro componente de calendario, incluyendo la etiqueta`<input type="date">` nativa de HTML.

5. Mantener en zona horaria local el `DateTime` de Luxon que entra o sale de los componentes definidos en la sección [Componentes Permitidos de Calendarios](#componentes-permitidos-de-calendarios), a través de sus `input()` y `output()` (`date`, `dateChange`, etc.), ya que representan una fecha seleccionada por el usuario. **PROHIBIDO** convertir ese `DateTime` a UTC (`.toUTC()`) dentro del flujo de estos componentes. Si necesitas persistir un instante (por ejemplo, `createdAt`) o enviarlo en el **payload** al backend, convierte ese `DateTime` a UTC únicamente justo antes de persistirlo o incluirlo en el payload, nunca antes. Este valor viaja en el payload como un `string` en formato ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`), por ejemplo: `2024-06-15T14:30:00Z`.

6. En `src/shared/services/Luxon.service.ts` existen funciones utilitarias reutilizables para el manejo y formateo de fechas y horas con Luxon. Reutilizarlas cuando cubran la necesidad. **PROHIBIDO** duplicar su funcionalidad. Estas funciones no contienen lógica de negocio.

## Componentes Permitidos de Calendarios

### `src\shared\design\ui\spartan-ng\form\date\calendar`
* `hlm-calendar`
* `hlm-calendar-range`
* `hlm-calendar-multi`

### `src\shared\design\ui\spartan-ng\form\date\date-picker`
* `hlm-date-picker`
* `hlm-date-picker-multi`
* `hlm-date-range-picker`

# Maquetación

## Iconos

**NO** instales otra libreria para iconos porque en este proyecto es estandar usar [Material Symbols Icons](https://fonts.google.com/icons)

Dar prioridad a usar los iconos de Material Symbols Icons

Usar siempre la siguiente estructura:

```html
<!-- my-component.component.html -->

<span class="material-symbols-outlined"> home </span>
```

La clase:

```html
material-symbols-outlined
```

No debe modificarse ni reemplazarse.

Esa clase es la que permite renderizar correctamente los Material Symbols Icons.

Lo único que debe cambiar es el nombre del icono:

```html
home
```

Dependiendo del icono que se quiera mostrar.

**Correcto**

```html
<span class="material-symbols-outlined"> delete </span>
```

```html
<span class="material-symbols-outlined"> settings </span>
```

```html
<span class="material-symbols-outlined"> search </span>
```

No agregar imágenes/SVGs manualmente si el icono ya existe en Material Symbols Icons

Cuando el icono no este en Material Symbols Icons, entonces agregarlo dentro de la carpeta assets de Angular

## Uso de Tailwind con Angular
El texto a continuación es una guia de los breaking changes mas importantes de Tailwind 4 que esta basado en la documentación oficial.

**Enlaces de Referencia**
**NO** es necesario leer estos enlaces; se incluyen únicamente como referencia:
* [Breaking changes de Tailwind 4](https://tailwindcss.com/blog/tailwindcss-v4)

* [Tema oscuro en Tailwind](https://tailwindcss.com/docs/dark-mode)

* [Media Queries (Breakpoints) de Tailwind](https://tailwindcss.com/docs/responsive-design)

* [@layer y Preflight en Tailwind](https://tailwindcss.com/docs/preflight)

* Uso de `@apply` de Tailwind:
  * [Tutorial](https://x.com/adamwathan/status/1226511611592085504)
  * [X (Twitter)](https://x.com/adamwathan/status/1559250403547652097)

**Regla:**
Este proyecto usa Tailwind 4. Está **PROHIBIDO** el uso de patrones legacy de Tailwind 3 y versiones anteriores, debido a que esto causa errores en la compilación de la aplicación.

### Tabla Comparativa de Tailwind 4 VS Tailwind 3

| Configuración               | Patrones Legacy de Tailwind 3                                          | Patrones de Tailwind 4                                                          |
| --------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Archivo de configuración    | `tailwind.config.ts`                                                   | `@theme` en archivo .css                                                        |
| Importar el CSS de Tailwind | `@tailwind base;`<br>`@tailwind components;`<br>`@tailwind utilities;` | `@import "tailwindcss"`                                                         |
| Modo oscuro                 | `darkMode: "class"`                                                    | `@custom-variant dark (&:where(.dark, .dark *))`                                |
| Colores personalizados      | `theme.extend.colors`                                                  | `@theme { --color-*: value }`                                                   |
| Animaciones                 | `require("tailwindcss-animate")`                                       | `@keyframes` de CSS en `@theme` + `@starting-style` para animaciones de entrada |
| Modificador `!important`    | `!flex` (al inicio, después de variantes)                              | `flex!` (al final del nombre de clase)                                          |

### Archivo de Configuración de Tailwind

**Incorrecto - Configurar Tailwind 3 con archivo `.js`**

```js
/* tailwind.config.js */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "oklch(62.8% 0.258 29.23)" // #FF0000
      },
    },
  },
};
```

**Correcto - Configurar Tailwind 4 con archivo `.css`**

```CSS
@theme {
  --color-primary-color: oklch(62.8% 0.258 29.23); // #FF0000
}
```

### Configurar PostCSS
Para configurar Tailwind 4, en la carpeta raiz del proyecto debe existir un archivo `.postcssrc.json` que contenga lo siguiente:

```JSON
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### Importar el CSS de Tailwind
Para importar Tailwind 4 desde el archivo CSS de estilos globales (por ejemplo, `src/css/global.css`) existen dos formas:

#### Forma 1 - `@import`
Para Tailwind 4 usar:

```CSS
@import 'tailwindcss';
```

Prohibido usar la configuración de import de Tailwind 3:

```CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Forma 2 - `@layer` - CSS Cascade Layers
En Tailwind 4 `@layer` permite personalizar:
* Los estilos que se importan de Tailwind.

* El orden de las capas de estilos.

Por defecto, el orden de las capas de Tailwind 4 es el siguiente. En este ejemplo solo incluye las capas de Tailwind 4 y no de ningun otro estilo CSS ni libreria de UI:

```CSS
@layer theme, base, components, utilities;
```

### Tema Oscuro
Para aplicar estilos del tema oscuro, usar siempre la variante `dark:` de Tailwind directamente en el HTML.

**Correcto:**

```html
<div class="bg-white dark:bg-gray-900">
  <!-- ... -->
</div>
```

No escribas estilos del tema oscuro en archivos CSS.

**Incorrecto:**

```css
.container {
  background: white;

  .dark & {
    background: #111827;
  }
}
```

La única excepción son las variables de color del tema de Spartan ng. Estas se definen en CSS, una vez para el tema claro y otra para el oscuro, y se exponen a Tailwind con `@theme inline`

**Correcto:**

```css
@theme inline {
  --color-card: var(--card);
}

:root {
  --card: oklch(1 0 0);
}

:root.dark {
  --card: oklch(0.205 0 0);
}
```

Las clases generadas a partir de estas variables, como `bg-card`, cambian de tema automáticamente, así que no necesitan `dark:`.

### Valores de Utilidad Dinámicos y Variantes (Variable `--spacing`)
Las utilidades y variantes de Tailwind 4 permiten aceptar determinados tipos de valores arbitrarios sin necesidad de ninguna configuración ni de recurrir a la sintaxis de valores arbitrarios.

Por ejemplo, en Tailwind 4 puedes crear cuadrículas de cualquier tamaño directamente:

```HTML
<div class="grid grid-cols-15">
  <!-- ... -->
</div>
```

También puedes usar atributos `data-*` booleanos personalizados sin necesidad de definirlos previamente:

```HTML
<div data-current class="opacity-75 data-current:opacity-100">
  <!-- ... -->
</div>
```

Incluso las utilidades de espaciado, como `px-*`, `mt-*`, `w-*` y `h-*`, ahora se derivan dinámicamente de una única variable de escala de espaciado y aceptan cualquier valor directamente. Cada clase de espaciado es el número de la clase multiplicado por la variable `--spacing`:

```CSS
/* CSS generado */

@layer theme {
  :root {
    --spacing: 0.25rem;
  }
}

@layer utilities {
  .mt-8 {
    margin-top: calc(var(--spacing) * 8);
  }
  .w-17 {
    width: calc(var(--spacing) * 17);
  }
  .pr-29 {
    padding-right: calc(var(--spacing) * 29);
  }
}
```

## ¿Cómo Usar Tailwind y CSS Juntos?
Los componentes se estilizan solo con clases de Tailwind en su plantilla. CSS se usa solo para estilos globales y para configurar librerías de UI, como las variables de tema de Spartan.

**Reglas:**
* No escribas CSS que sobrescriba clases de Tailwind ni que compita con ellas por especificidad.

* No escribas estilos de componentes en archivos CSS.

* En los componentes de Angular está prohibido usar:
  * El atributo `style`.
  * `[style.propiedad]`
  * `[ngStyle]`.
  * Las propiedades `styles`, `styleUrl` y `styleUrls` del decorador `@Component`.

### Anidamiento de Selectores CSS (CSS Nesting)
Con CSS Nesting se anidan dentro del selector al que pertenecen:

1. **Los selectores hijos:** para aplicar estilos a elementos dentro de otro elemento, anida su selector dentro del selector del padre.

2. **Las media queries:** el bloque `@media` se anida dentro del selector al que le cambia los estilos.

En ambos casos está prohibido repetir el selector en una regla aparte o en un bloque `@media` aparte.

**Correcto:**

```CSS
div.parent {
  border: 1px solid green;

  p.child {
    color: red;
  }
}
```

**Incorrecto**

```CSS
div.parent {
  border: 1px solid green;
}

div.parent p.child {
  color: red;
}
```

```CSS
/* es incorrecto porque la media query está en un bloque @media aparte y repite el selector h1 */
h1 {
  color: red;
}

@media (width >= 768px) {
  h1 {
    color: blue;
  }
}
```

### Unidades Relativas al Viewport
Esta regla aplica a Tailwind y a CSS en las siguientes propiedades de tamaño:

* **Tailwind:** `h-*`, `min-h-*`, `max-h-*`, `w-*`, `min-w-*` y `max-w-*`.

* **CSS:** `height`, `min-height`, `max-height`, `width`, `min-width` y `max-width`.

Para medidas relativas al viewport, usa `dvh` y `dvw`. No uses `vh` ni `vw`, tampoco en valores arbitrarios como `h-[100vh]`.

**Correcto:**

```html
<div class="h-dvh w-dvw">
  <!-- ... -->
</div>
```

```css
.layout {
  height: 100dvh;
  width: 100dvw;
}
```

**Incorrecto:**

```html
<div class="h-screen w-screen">
  <!-- ... -->
</div>
```

```css
.layout {
  height: 100vh;
  width: 100vw;
}
```

### Colores
Esta regla aplica a Tailwind y a CSS. Todo color debe escribirse en `oklch` en:

* **Tailwind:** variables de `@theme` y valores arbitrarios.

* **CSS:** variables CSS y cualquier propiedad que reciba un color, como `color`, `background-color`, `border-color`, etc.

No uses hexadecimal, `rgb()`, `rgba()`, `hsl()`, `hsla()` ni nombres de color como `red`.

Las clases de la paleta predeterminada de Tailwind, como `bg-red-500`, están permitidas.

**Correcto:**

```css
@theme {
  --color-blue-azure: oklch(64.1% 0.172 247.8); /* #0191ee */
}

.header {
  border-color: oklch(62.8% 0.258 29.23);
}
```

```html
<div class="bg-[oklch(62.8%_0.258_29.23)]"></div>
```

**Incorrecto:**

```css
@theme {
  --color-blue-azure: #0191ee;
}

:root {
  --card: #fff;
}

.header {
  border-color: rgb(255 0 0);
}
```

```html
<div class="bg-[rgb(255_0_0)]"></div>
```

### `@apply`
Prohibido usar `@apply` de Tailwind

***Incorrecto:***

```HTML
<!-- my-component.component.html -->

<button class="button">
  Boton
</button>
```

```CSS
.button {
  @apply bg-red-600 text-white px-4 py-2 rounded-lg;
}
```

## Media Queries (Breakpoints)
Tailwind y CSS usan los mismos breakpoints: los definidos en `@theme`. Está prohibido usar otros valores.

```css
@theme {
  /* celular */
  --breakpoint-xsm: 30rem; /* @media (width >= 480px) { ... } */

  /* tablet */
  --breakpoint-sm: 40rem; /* @media (width >= 640px) { ... } */
  --breakpoint-md: 48rem; /* @media (width >= 768px) { ... } */
  --breakpoint-lg: 64rem; /* @media (width >= 1024px) { ... } */

  /* pantalla computador portatil */
  --breakpoint-xl: 80rem; /* @media (width >= 1280px) { ... } */

  /* monitor */
  --breakpoint-2xl: 96rem; /* @media (width >= 1536px) { ... } */
  --breakpoint-3xl: 120rem; /* @media (width >= 1920px) { ... } */
}
```

`xsm` y `3xl` son propios del proyecto. El resto son los predeterminados de Tailwind 4.

### Mobile First
Tailwind y CSS se escriben mobile first

**Correcto:**

```html
<!-- my-component.component.html -->

<div class="p-2 xsm:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 3xl:p-10"></div>
```

```css
/* archivo global de CSS */

h1 {
  padding: 0.5rem;

  @media (width >= 480px) {
    padding: 0.75rem;
  }

  @media (width >= 640px) {
    padding: 1rem;
  }

  @media (width >= 768px) {
    padding: 1.25rem;
  }

  @media (width >= 1024px) {
    padding: 1.5rem;
  }

  @media (width >= 1280px) {
    padding: 1.75rem;
  }

  @media (width >= 1536px) {
    padding: 2rem;
  }

  @media (width >= 1920px) {
    padding: 2.5rem;
  }
}
```

### Sintaxis de Rango
Escribir las media queries con la sintaxis de rango (operadores de comparación) de CSS Media Queries Level 4. Está **PROHIBIDO** usar los prefijos `min-width` y `max-width`.

La sintaxis de rango también se escribe como se especifica en el titulo [Mobile First](#mobile-first): se parte del estilo base de móvil y se amplía hacia arriba con `width >=`. Por lo tanto, dentro de la sintaxis de rango también está **PROHIBIDO** `width <=` (desktop first) y acotar entre dos anchos (`768px <= width <= 1023px`).

| Sintaxis Legacy (prohibida)                         | Sintaxis de rango (obligatoria)     | ¿Mobile first? |
| --------------------------------------------------- | ----------------------------------- | -------------- |
| `@media (min-width: 768px)`                         | `@media (width >= 768px)`           | Sí             |
| `@media (max-width: 767px)`                         | `@media (width <= 767px)`           | No, prohibido  |
| `@media (min-width: 768px) and (max-width: 1023px)` | `@media (768px <= width <= 1023px)` | No, prohibido  |

**Correcto:**

```css
/* archivo global de CSS */

/* usa la sintaxis de rango y es mobile first: desde 768px en adelante */
h1 {
  color: red;

  @media (width >= 768px) {
    color: blue;
  }
}
```

**Incorrecto**

```css
/* archivo global de CSS */

/* es incorrecto porque usa min-width en vez de la sintaxis de rango */
h1 {
  color: red;

  @media (min-width: 768px) {
    color: blue;
  }
}
```

```css
/* archivo global de CSS */

/* es incorrecto porque usa max-width: no es sintaxis de rango y además es desktop first */
h1 {
  color: red;

  @media (max-width: 767px) {
    color: blue;
  }
}
```

```css
/* archivo global de CSS */

/* es incorrecto porque usa min-width y max-width en vez de la sintaxis de rango */
h1 {
  color: red;

  @media (min-width: 768px) and (max-width: 1023px) {
    color: blue;
  }
}
```

### Media Queries en CSS
Las media queries en CSS solo se usan en estilos globales. Los componentes usan los prefijos de Tailwind.

**Correcto:**

```css
/* archivo global de CSS */

h1 {
  color: red;

  @media (width >= 768px) {
    color: blue;
  }
}
```

**Incorrecto**

```css
/* es incorrecto porque usa width <= (desktop first) */
h1 {
  color: red;

  @media (width <= 767px) {
    color: blue;
  }
}
```

```css
/* es incorrecto porque acota entre dos anchos en vez de ser mobile first */
h1 {
  color: red;

  @media (768px <= width <= 1023px) {
    color: blue;
  }
}
```

```css
/* my-component.css */

/* es incorrecto porque son estilos de componente en un archivo CSS */
.card {
  padding: 1rem;

  @media (width >= 768px) {
    padding: 1.5rem;
  }
}
```

## Componentes de UI
Este proyecto usa los componentes de Spartan NG que están instalados en `src\shared\design\ui\spartan-ng`.

Spartan NG tiene dos capas:
* **`@spartan-ng/brain/*` (brain):** Primitivas accesibles y sin estilo, instaladas vía npm. Aportan navegación por teclado, gestión de foco, configuración ARIA y estado. Es el equivalente en Angular a Base UI de React.

* **`@spartan-ng/*` (helm):** Las versiones con estilo (Tailwind) construidas sobre brain. Son los componentes que se usan directamente en las plantillas (`hlm-...`, `hlmBtn`, `hlmInput`, etc.).

Esta regla aplica a **cualquier componente visual del proyecto** (formularios, cards, badges, tooltips, layouts, etc.), no solo a formularios.

### Orden de Decisión
Para construir cualquier elemento de UI, evaluar en este orden y detenerse en el primer caso que aplique:

1. **¿El componente está en "[Componentes Permitidos](#componentes-permitidos)"?**
   Usar el componente helm de Spartan de la lista. Está prohibido usar su equivalente nativo de HTML.
   Ejemplo: existe la etiqueta nativa `<dialog>` de HTML, pero como `Dialog` está en la lista, se debe usar el `Dialog` de Spartan (`<hlm-dialog>` y sus directivas).

2. **¿El componente es un botón?**
   Ir a [Orden de Decisión para Botones](#orden-de-decisión-para-botones) y aplicar sus 3 pasos. Esa sección resuelve el caso completo: **no** continuar con los pasos 3 ni 4 de esta lista.

3. **¿El componente NO está en la lista y NO es un botón?**
   Maquetar con Tailwind. En este caso sí se usan elementos HTML nativos (`<div>`, `<span>`, etc.) como base del maquetado. Ejemplo: `Card` no está en la lista, se maqueta con Tailwind sobre `<div>`.

4. **Alcance de la prohibición de HTML nativo (aplica a los casos 1, 2 y 3):**
   El HTML nativo solo está prohibido en dos situaciones:
   * (a) Cuando existe un equivalente en "[Componentes Permitidos](#componentes-permitidos)": usar Spartan ng, no el nativo.

   * (b) La etiqueta `<button>` nativa: ver [Orden de Decisión para Botones](#orden-de-decisión-para-botones).

   En cualquier otro caso (componentes que no están en la lista), el HTML nativo es la base esperada para maquetar con Tailwind.

### Refuerzo para Formularios
Además de lo anterior, en formularios usar los componentes de Spartan de "[Componentes Permitidos](#componentes-permitidos)" para todos los controles disponibles (checkbox, input, label, Radio Group, Select, Switch, textarea, etc.). No se permite ningún control de formulario en HTML nativo cuando existe su equivalente en la lista.

Para el formulario en sí, sí se permite usar la etiqueta nativa `<form>` de HTML junto con Angular Forms with signals para el manejo de estado y validación.

### Orden de Decisión para Botones

> [!CAUTION]
> Evaluar los 3 pasos **en orden** y **detenerse en el primer caso que aplique**. No saltar pasos ni combinarlos.

Todo se decide con una sola pregunta: **¿el archivo que estás editando _implementa_ la librería de UI, o la _consume_?**

| El archivo que estás editando…                    | Rol        | Botón que se usa            |
| ------------------------------------------------- | ---------- | --------------------------- |
| Está dentro de `src/shared/design/ui/spartan-ng`  | Implementa | `hlmBtn` → **paso 1**       |
| Está en cualquier otra ruta de `src`              | Consume    | `appBtn` → **paso 2**       |

> [!IMPORTANT]
> En Angular los dos botones son **directivas de atributo**, no componentes. Se aplican **sobre** una etiqueta `<button>` o `<a>`, y por eso conviven en el mismo elemento con las directivas de comportamiento de Spartan (`hlmDialogTrigger`, `hlmDialogClose`, etc.).
>
> | Directiva | Selector real                  |
> | --------- | ------------------------------ |
> | `hlmBtn`  | `button[hlmBtn], a[hlmBtn]`    |
> | `appBtn`  | `button[appBtn], a[appBtn]`    |

#### Paso 1 - Botón Interno de la Librería de UI → `hlmBtn` de Spartan NG
**Condición:** el botón se escribe **dentro** de `src/shared/design/ui/spartan-ng`, en el archivo que implementa o define un componente de Spartan NG.

**Usar:** la directiva `hlmBtn` de `src/shared/design/ui/spartan-ng/form/action/button` — alias `@spartan-ng/button`.

Así lo hace la propia librería:

```html
<!-- src/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-content.component.ts -->
<button hlmBtn variant="ghost" size="icon-sm" class="absolute end-2 top-2" hlmDialogClose>
  <span class="sr-only">close</span>
  <span class="material-symbols-outlined">close</span>
</button>
```

**Alcance:** esta regla aplica **únicamente** al código que implementa o define los componentes de la librería de UI. **NO** aplica al código de la aplicación donde esos componentes son consumidos — ese caso lo resuelve el paso 2.

#### Paso 2 - Botón Fuera de la Librería de UI → Directiva `appBtn`
**Condición:** el botón **NO** se escribe dentro de `src/shared/design/ui/spartan-ng`. Ocurre en cualquiera de estos dos casos:

**2.1. El botón se usa al consumir un componente de la librería de UI.**
Ejemplo: al usar `hlm-dialog`, `hlm-drawer`, `hlm-sheet`, `hlm-alert-dialog` o `hlmDropdownMenu` — tanto el trigger que abre el overlay como los botones de acción de su contenido (Guardar, Cancelar).

**2.2. El botón pertenece a la interfaz de usuario de la aplicación.**
Ejemplo: Iniciar sesión, Guardar, Cancelar, Crear, Editar, Eliminar, Buscar, Aceptar, Continuar.

**Usar:**  Directiva `appBtn`

**PROHIBIDO** usar `hlmBtn` (`@spartan-ng/button`) fuera de `src/shared/design/ui/spartan-ng`.

> [!WARNING]
> INCOMPLETO
> la directiva `appBtn` **todavía no existe** y es el selector previsto para su directiva y sus inputs (`theme`, `variant`, `size`, `modifiers`, `effects`) reflejan los del botón composable equivalente de Next.js, que consume el mismo sistema Sass de `src/styles/global/scss/buttons`.
>
> Al crear la directiva, alinear selector e inputs con lo documentado aquí, o actualizar esta sección para que coincida con la implementación real.

#### PROHIBIDA la Etiqueta `<button>` Nativa de HTML sin Directiva de Botón
Aplica a los pasos 1 y 2. En Angular la etiqueta `<button>` es el **elemento anfitrión**: tanto `hlmBtn` como `appBtn` son directivas de atributo y no existen sin ella.

Lo que está prohibido es escribir un `<button>` **desnudo**, es decir, sin ninguna de las dos directivas de botón:

**Incorrecto:**
```html
<button class="btn btn-primary btn-background" (click)="save()">Guardar</button>
<button hlmDialogTrigger>Abrir</button>
```

**Correcto:**
```html
<button appBtn theme="primary" variant="background" (click)="save()">Guardar</button>
<button appBtn hlmDialogTrigger theme="primary" variant="background">Abrir</button>
```

La misma regla aplica a `<a>`: prohibido un `<a>` con apariencia de botón sin `appBtn`.

#### Cómo Combinar el Botón Composable con las Directivas de Spartan
Los triggers y los cierres de Spartan son **directivas de comportamiento**: aportan accesibilidad y estado, pero **ningún estilo**. Por eso conviven en el mismo `<button>` que `appBtn`, que aporta los estilos.

Sus selectores exigen la etiqueta `<button>`, así que esta convivencia es la única forma válida de consumirlos:

| Directiva de comportamiento               | Selector real                                                     |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `hlmDialogTrigger`                        | `button[hlmDialogTrigger], button[hlmDialogTriggerFor]`           |
| `hlmDialogClose`                          | `button[hlmDialogClose]`                                          |
| `hlmSheetTrigger` / `hlmSheetClose`       | `button[hlmSheetTrigger]` / `button[hlmSheetClose]`               |
| `hlmDrawerTrigger` / `hlmDrawerClose`     | `button[hlmDrawerTrigger]` / `button[hlmDrawerClose]`             |
| `hlmAlertDialogTrigger`                   | `button[hlmAlertDialogTrigger], button[hlmAlertDialogTriggerFor]` |
| `hlmDropdownMenuTrigger`                  | `[hlmDropdownMenuTrigger]` (acepta cualquier elemento)            |

**Ejemplo Completo — `hlm-dialog` consumido desde la aplicación:**

```html
<hlm-dialog>
  <!-- 2.1 — trigger: comportamiento de Spartan + estilos de appBtn en el mismo <button> -->
  <button appBtn hlmDialogTrigger theme="primary" variant="background">Abrir</button>

  <hlm-dialog-content *hlmDialogPortal="let ctx">
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Título</h3>
    </hlm-dialog-header>

    <hlm-dialog-footer>
      <!-- 2.1 — cerrar: directiva de cierre de Spartan + appBtn -->
      <button appBtn hlmDialogClose theme="secondary" variant="outline">Cancelar</button>

      <!-- 2.2 — acción de la aplicación: appBtn solo -->
      <button appBtn theme="primary" variant="background" type="submit">Guardar</button>
    </hlm-dialog-footer>
  </hlm-dialog-content>
</hlm-dialog>
```

#### Piezas que Traen `hlmBtn` Incrustado
Algunas piezas de Spartan traen los estilos de botón incrustados y **no se pueden desactivar**. Lo hacen por dos mecanismos:

* **`hostDirectives`** que aplican `HlmButton` al elemento anfitrión (`hlmAlertDialogAction`, `hlmAlertDialogCancel`, `hlmInputGroupButton`, `hlmCarouselNext`, `hlmCarouselPrevious`).

* **`buttonVariants()` o `hlmBtn` dentro de su propio template** (`hlmPaginationLink`, `hlm-date-picker-trigger`, celdas de día del `Calendar`).

En ambos casos el elemento recibe las clases Tailwind de Spartan. Se resuelven caso por caso:

| Pieza                                       | ¿`hlmBtn` incrustado? | Qué hacer                                                 |
| ------------------------------------------- | --------------------- | --------------------------------------------------------- |
| `hlmDialogTrigger` / `hlmDialogClose`       | No                    | `appBtn` en el mismo `<button>`                           |
| `hlmSheetTrigger` / `hlmSheetClose`         | No                    | `appBtn` en el mismo `<button>`                           |
| `hlmDrawerTrigger` / `hlmDrawerClose`       | No                    | `appBtn` en el mismo `<button>`                           |
| `hlmAlertDialogTrigger`                     | No                    | `appBtn` en el mismo `<button>`                           |
| `hlmAlertDialogCancel`                      | **Sí**                | **PROHIBIDO.** Usar `<button appBtn brnDialogClose>`      |
| `hlmAlertDialogAction`                      | **Sí**                | **PROHIBIDO.** Usar `<button appBtn>` suelto en el footer |
| `hlmInputGroupButton`                       | **Sí**                | **Permitido**: es cromo interno del `Input Group`         |
| `hlmCarouselNext` / `hlmCarouselPrevious`   | **Sí**                | **Permitido**: es cromo interno del `Carousel`            |

**Criterio que resuelve cualquier pieza que no esté en la tabla:**
* El botón representa una **acción de la aplicación** (Guardar, Cancelar, Eliminar) → `appBtn`. Su apariencia pertenece a la aplicación.

* El botón es **cromo interno del componente** (flechas del `Carousel`, addon del `Input Group`) → la pieza de Spartan con `hlmBtn` incrustado. Su apariencia pertenece al componente, no a la aplicación.

`hlmAlertDialogAction` y `hlmAlertDialogCancel` están prohibidos porque aplican `HlmButton` de forma incondicional y sus estilos Tailwind chocarían con las clases `.btn-*` de `appBtn` en el mismo elemento. Se reemplazan así, sin perder comportamiento:

* `hlmAlertDialogAction` solo aporta estilos, **no cierra el diálogo** → se sustituye por un `<button appBtn>` suelto.

* `hlmAlertDialogCancel` es `BrnDialogClose` + `HlmButton` → se sustituye por `brnDialogClose` (importado de `@spartan-ng/brain/dialog`), que aporta el cierre **sin ningún estilo**.

```html
<hlm-alert-dialog-footer>
  <!-- cierre neutro de la capa brain + estilos de appBtn -->
  <button appBtn brnDialogClose theme="secondary" variant="outline">Cancelar</button>

  <!-- en vez de hlmAlertDialogAction, appBtn suelto -->
  <button appBtn theme="danger" variant="background" (click)="delete()">Eliminar</button>
</hlm-alert-dialog-footer>
```

### Dependencias Internas de los Componentes Permitidos
Si un componente de [Componentes Permitidos](#componentes-permitidos) depende de otros componentes helm de Spartan NG para funcionar, esas dependencias sí se pueden usar aunque no estén listadas explícitamente. Dependencias reales de este proyecto:

| Componente       | Depende de                                        |
| ---------------- | ------------------------------------------------- |
| `Combobox`       | `Input Group` + `Button`                          |
| `Date Picker`    | `Calendar` + `Popover` + `Input Group` + `Button` |
| `Calendar`       | `Select` + `Button`                               |
| `Input Group`    | `Input Base` + `Textarea` + `Button`              |
| `Input Text`     | `Input Base`                                      |
| `Input Number`   | `Input Base`                                      |
| `Input Email`    | `Input Base`                                      |
| `Input Password` | `Input Base` + `Input Group` + `Button`           |
| `Carousel`       | `Button`                                          |

`Button` (`@spartan-ng/button`) e `Input Base` (`@spartan-ng/input-base`) son los dos requisitos que **no** aparecen en la tabla [Componentes Permitidos](#componentes-permitidos), y son justamente el caso que cubre esta regla: solo se usan internamente para construir los demás componentes.

Los botones se resuelven aparte, con [Orden de Decisión para Botones](#orden-de-decisión-para-botones): dentro de `src/shared/design/ui/spartan-ng` se usa la directiva `hlmBtn`, y al consumir esos componentes desde la aplicación se usa la directiva `appBtn` de `src/shared/design/ui/buttons`.

### Data Table
Solo se permite el patrón "Data Table" de Spartan, construido sobre las directivas `Table` (`hlmTable`, `hlmTr`, `hlmTh`, `hlmTd`, etc.) + **`@tanstack/angular-table`**, incluyendo paginación y sorting. Es decir, se usa el conjunto completo Data Table (Table + TanStack + paginación + sorting), no una tabla estática suelta. No esta permitiro usar la etiqueta `<table>` nativa de HTML

### Prohibiciones
* Prohibido instalar componentes nuevos de Spartan (vía su CLI, por ejemplo: `pnpm ng g @spartan-ng/cli:ui <componente>` o `nx g @spartan-ng/cli:ui <componente>`) distintos a los de "[Componentes Permitidos](#componentes-permitidos)".

* Prohibido usar cualquier librería de UI externa (Angular Material, PrimeNG, NG-ZORRO, etc.).

* Prohibido usar `input-base` (`src\shared\design\ui\spartan-ng\form\text\input\input-base`) fuera de `src/shared`. Es una pieza interna que solo existe para construir `input-text`, `input-number`, `input-password` e `input-email`. Fuera de `src/shared` se usa uno de esos cuatro, nunca el base.

### Componentes Permitidos
Los componentes están agrupados en cuatro categorías dentro de `src\shared\design\ui\spartan-ng`: `overlay`, `form`, `navigation` y `data-display`.

Siempre para importar los componentes usar los import alias de Spartan ng que estan en `tsconfig.json`

Cada carpeta de componente tiene su barrel export en `index.ts`, que reexporta todos sus archivos y define la constante `Hlm*Imports`.

| Nombre Componente                                                | Ruta                                                             |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Accordion                                                        | `src\shared\design\ui\spartan-ng\navigation\accordion`           |
| Alert Dialog                                                     | `src\shared\design\ui\spartan-ng\overlay\alert-dialog`           |
| Calendar                                                         | `src\shared\design\ui\spartan-ng\form\date\calendar`             |
| Carousel                                                         | `src\shared\design\ui\spartan-ng\data-display\carousel`          |
| Checkbox                                                         | `src\shared\design\ui\spartan-ng\form\selection\checkbox`        |
| Combobox                                                         | `src\shared\design\ui\spartan-ng\form\selection\combobox`        |
| Data Table (con `@tanstack/angular-table`, paginación y sorting) | `src\shared\design\ui\spartan-ng\data-display\data-table`        |
| Date Picker                                                      | `src\shared\design\ui\spartan-ng\form\date\date-picker`          |
| Dialog                                                           | `src\shared\design\ui\spartan-ng\overlay\dialog`                 |
| Drawer                                                           | `src\shared\design\ui\spartan-ng\overlay\drawer`                 |
| Dropdown Menu                                                    | `src\shared\design\ui\spartan-ng\overlay\dropdown-menu`          |
| Input Email                                                      | `src\shared\design\ui\spartan-ng\form\text\input\input-email`    |
| Input Group                                                      | `src\shared\design\ui\spartan-ng\form\text\input\input-group`    |
| Input Number                                                     | `src\shared\design\ui\spartan-ng\form\text\input\input-number`   |
| Input Password                                                   | `src\shared\design\ui\spartan-ng\form\text\input\input-password` |
| Input Text                                                       | `src\shared\design\ui\spartan-ng\form\text\input\input-text`     |
| Label                                                            | `src\shared\design\ui\spartan-ng\form\text\label`                |
| Pagination                                                       | `src\shared\design\ui\spartan-ng\navigation\pagination`          |
| Popover                                                          | `src\shared\design\ui\spartan-ng\overlay\popover`                |
| Radio Group                                                      | `src\shared\design\ui\spartan-ng\form\selection\radio-group`     |
| Select                                                           | `src\shared\design\ui\spartan-ng\form\selection\select`          |
| Sheet                                                            | `src\shared\design\ui\spartan-ng\overlay\sheet`                  |
| Toast (Sonner)                                                   | `src\shared\design\ui\spartan-ng\overlay\toast`                  |
| Switch                                                           | `src\shared\design\ui\spartan-ng\form\selection\switch`          |
| Tabs                                                             | `src\shared\design\ui\spartan-ng\navigation\tabs`                |
| Textarea                                                         | `src\shared\design\ui\spartan-ng\form\text\textarea`             |
| Tooltip                                                          | `src\shared\design\ui\spartan-ng\overlay\tooltip`                |


## Estilos Globales para Botones

**Enlaces de Referencia**
**NO** es necesario leer estos enlaces; se incluyen únicamente como referencia. Está guía de estilos para botones está basada en:

* [Botones de Bootstrap 5](https://getbootstrap.com/docs/5.3/components/buttons/)

* [Tailwind 4 font-size](https://tailwindcss.com/docs/font-size)

* [Tailwind 4 line-height](https://tailwindcss.com/docs/line-height)

* [Tailwind 4 padding](https://tailwindcss.com/docs/padding)

**Incorrecto:**

Usar etiquetas `<img>` para iconos porque las imágenes no se integran correctamente con la arquitectura CSS de los botones y dificultan aplicar estilos dinámicos como:

- `color`
- `hover`
- `active`
- `disabled`
- `font-size`
- dark mode

Esto rompe la consistencia visual y vuelve el código más difícil de mantener y escalar.

```html
<button>
  <img src="/assets/icon/delete.svg" alt="Eliminar" />
</button>
```

Por ejemplo, para intentar cambiar color, tamaño o estados visuales de imágenes `<img>`, normalmente se termina recurriendo a hacks visuales con CSS, lo cual es mala práctica:

```SCSS
// cambiar tamaño de imagen
button {
  img {
    display: inline-block;
    width: 20px;
    height: 20px;
  }
}
```

```SCSS
// cambiar color de imagen
img {
  filter: brightness(0) saturate(100%) invert(100%);
}
```

```SCSS
// Recortar la imagen usando la forma del SVG
img {
  mask-image: url(icon.svg);
}
```

```SCSS
// Hacer imagen semitransparente al pasar el mouse
button {
  &:hover {
    img {
      opacity: 0.5;
    }
  }
}
```

Esto genera:

- Son difíciles de mantener.
- Generan inconsistencias visuales.
- Complican los estilos para los estados del botón.
- Rompen fácilmente en dark mode.
- Vuelven el CSS más complejo y frágil.

**Correcto:**
Los iconos de los botones deben utilizar Material Symbols Icons

[Material Symbols Icons](https://fonts.google.com/icons) funcionan como texto estilizable mediante CSS, lo que permite integrarlos correctamente con la arquitectura visual del proyecto.

```html
<button class="btn btn-primary btn-outline btn-icon-only btn-rounded-full btn-shadow">
  <span class="material-symbols-outlined">arrow_forward</span>
</button>
```

**Incorrecto:**

Usar Tailwind CSS para definir estilos de botones directamente en cada componente, ya que esto genera estilos inconsistentes y no escalables:

```HTML
<button class="rounded-2xl bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed enabled:cursor-pointer">
  Aceptar
</button>
```

Mezclar las clases globales de botones (`.btn`, `.btn-primary`, `.btn-outline-*`, etc.) con clases de Tailwind CSS.

```HTML
<button class="btn btn-primary bg-red-500 px-10 rounded-full">
  <span class="material-symbols-outlined">save</span>
  <span class="text-blue-500">Guardar</span>
</button>
```

Usar muchas clases de Sass para cada uno de los estilos de los botones, porque mezcla múltiples responsabilidades en una sola clase:

- Icono
- Texto
- Borde

```HTML
<button class="btn-with-icon-text-border">
  <span class="material-symbols-outlined"> home </span>
  <span>Boton</span>
</button>
```

Ese enfoque no escala bien, ya que cada nueva combinación obliga a crear más clases:

```SCSS
.btn-with-icon-text-border-loading {}
.btn-with-icon-text-background-lg {}
.btn-with-icon-text-border-disabled {}
```

Esto genera:

- Archivos Sass enormes y difíciles de mantener.
- Duplicación innecesaria de código.
- Inconsistencias visuales.
- Dificultad para reutilizar un estándar de diseño.

**Correcto:**

Las clases de botones deben representar una sola responsabilidad y ser **composables**.

En arquitectura CSS y de componentes, composable significa que una clase puede combinarse con otras clases pequeñas y reutilizables para construir distintos comportamientos sin duplicar código.

Cada clase modifica únicamente una característica específica del botón. Esto permite combinar comportamientos sin duplicar estilos:

| Archivo              | Descripción                                                                                                                                                                  | Ejemplo de código                                                |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| `index-buttons.scss` | Archivo orquestador. Importa todos los módulos SCSS mediante `@use`. No debe contener estilos CSS, variables ni lógica visual.                                               | `@use "./base.scss";`                                            |
| `_base.scss`         | Define la estructura base del sistema de botones: reset CSS, layout, alineación, box model y estilos fundamentales de `.btn`. Todas las variantes parten de esta clase base. | `.btn {} `                                                       |
| `_variants.scss`     | Define la apariencia principal del botón (fondo, borde y comportamiento visual). Las variantes pueden combinarse con cualquier tema, tamaño o modificador.                   | `.btn-background {} .btn-outline {} .btn-ghost {} .btn-link {} ` |
| `_themes.scss`       | Define los temas de color mediante CSS Custom Properties. Cada tema establece los colores utilizados por las variantes (`solid`, `outline`, `ghost`, etc.).                  | `.btn-primary {} .btn-secondary {} .btn-success {} `             |
| `_sizes.scss`        | Define la escala de tamaños del botón mediante `padding`, `font-size` y `line-height`. Puede combinarse con cualquier variante o tema.                                       | `.btn-xs {} .btn-sm {} .btn-base {} .btn-lg {} `                 |
| `_states.scss`       | Define los estados interactivos y de accesibilidad del botón. Centraliza comportamientos relacionados con `focus-visible`, `hover`, `active` y `disabled`.                   |                                                                  |
| `_effects.scss`      | Contiene utilidades visuales reutilizables independientes de la lógica del botón. Permite agregar efectos opcionales como sombras, blur o elevación.                         | `.btn-shadow {} `                                                |
| `_modifiers.scss`    | Clases composables que alteran o extienden características específicas del botón sin modificar su variante principal.                                                        | `.btn-full-width {} .btn-rounded-full {} .btn-icon-only {}`      |
| `_mixins.scss`       | Codigo de Sass reutilizable que se repite en diferentes archivos de src\styles\global\scss\buttons                                                                                | `@mixin btn-base-size {}`                                        |
| `_tokens.scss`       | Variables globales de Sass utilizadas por todo el sistema de botones. Centraliza colores, tamaños tipográficos y escalas de espaciado para mantener consistencia visual.     | `$primary: oklch(...);`                                          |

### Manual de Uso para Dar Estilos a Botones

Esta guía explica cómo utilizar correctamente los estilos globales de botones definidos en:

```txt
src/styles/global/scss/buttons
```

### UI/UX

En el diseño de interfaces (UI/UX), el color de un botón no es solo decorativo:
cada variante representa una intención de acción dentro del sistema.

Esto ayuda al usuario a entender rápidamente qué va a ocurrir antes de hacer clic.

**Los colores fuertes:**

- Capturan atención.
- Indican importancia.
- El usuario lo identifica como el botón más importante para hacer clic.

**Los colores suaves o transparentes:**

- Reducen distracción.
- Bajan la jerarquía visual.
- Mantienen el foco en el contenido principal.

**Reglas de UI/UX**

- Solo debe existir 1 acción primaria por pantalla (colores fuertes).
- Las acciones secundarias deben tener menor jerarquía visual (colores suaves).
- Las acciones destructivas deben ser claramente identificables.
- El color no es decoración, es comunicación.

### Clase `.btn` con Estilos Base

La clase `.btn` define los estilos base y actúa como un reset CSS para todos los botones, sin importar su variante o tipo (`primary`, `outline`, `ghost`, etc.).

Esta clase **siempre debe utilizarse**, ya que establece la estructura común del componente y garantiza consistencia en toda la UI.

Incluye estilos fundamentales como `padding`, `font-size`, alineación del contenido, comportamiento de interacción (`hover`, `active`, `disabled`) y configuración de layout.

Por defecto, `.btn` tiene `background-color: transparent`, por lo que **no representa un botón visual completo por sí sola**. Su función es servir como base para que las variantes (`.btn-primary`, `.btn-outline-*`, etc.) apliquen el estilo visual final.

- Botones **activados** usan `cursor: pointer` para indicar que el botón es interactivo y puede ser clickeado.

- Botones **desactivados** usan `cursor: not-allowed` para indicar que el botón no está disponible y no puede ser clickeado.

```html
<button class="btn">
  Base class
</button>
```

### Enlaces

`btn btn-link` define los estilos para los enlaces para `<a>` y `<button>`

![enlaces](./docs/readme-md/img/button/enlaces.png)

```html
<a class="btn btn-link" routerLink="/home">
  Ir a home
</a>

<button class="btn btn-link" routerLink="/home">
  Ir a home
</button>

<button disabled class="btn btn-link" routerLink="/home">
  Ir a home
</button>

<a class="btn btn-link" target="_blank" rel="noopener noreferrer" href="https://www.google.com">
  Ir a Google
</a>
```

### Botones con Color de Fondo

`btn-background` agrega color de fondo al boton.

En sistemas de diseño modernos, los botones se clasifican según su nivel de importancia y riesgo de la acción:

| Tipo de boton | Significado                                                    |
| ------------- | -------------------------------------------------------------- |
| Primary       | acción principal (continuar / confirmar / guardar)             |
| Secondary     | acción secundaria (cancelar / salir)                           |
| Ghost         | acción discreta sin estructura visual fuerte - no tiene border |
| Danger        | eliminar o destruir                                            |
| Warning       | advertencia                                                    |
| Success       | confirmación positiva                                          |
| Info          | información                                                    |
| Link          | navegación / enlaces                                           |
| Dark          | variante de alto contraste para acciones neutras o de soporte  |

![variantes-con-color-de-fondo](./docs/readme-md/img/button/variantes-con-color-de-fondo.png)

```html
<button class="btn btn-primary btn-background">Primary</button>
<button class="btn btn-secondary btn-background">Secondary</button>
<button class="btn btn-success btn-background">Success</button>
<button class="btn btn-danger btn-background">Danger</button>
<button class="btn btn-warning btn-background">Warning</button>
<button class="btn btn-info btn-background">Info</button>
<button class="btn btn-light btn-background">Light</button>
<button class="btn btn-dark btn-background">Dark</button>
```

### Botones con Borde + Texto

Las clases `.btn-outline-*` se usan para botones que tienen `border`, pero no color de fondo `background-color` por defecto.

El comportamiento visual depende del estado de interacción:

- **Estado normal (sin `hover`)** → sin fondo `background-color: transparent` y se muestra únicamente el `border`.

- **Estado `hover`** → botón cambia su `background-color` dependiendo del tipo de botón.

Algunos botones usan colores claros en el texto o borde, por lo que deben colocarse sobre fondos oscuros para mantener un buen contraste y asegurar que sean claramente visibles.

![borde-con-texto](./docs/readme-md/img/button/borde-con-texto.png)

```html
<button class="btn btn-primary btn-outline">Primary</button>
<button class="btn btn-secondary btn-outline">Secondary</button>
<button class="btn btn-success btn-outline">Success</button>
<button class="btn btn-danger btn-outline">Danger</button>
<button class="btn btn-warning btn-outline">Warning</button>
<button class="btn btn-info btn-outline">Info</button>
<button class="btn btn-light btn-outline">Light</button>
<button class="btn btn-dark btn-outline">Dark</button>
```

### Botones con Sombra

`btn-shadow` agrega una sombra a cualquier variante de botón, sin importar su estilo (fondo, borde o ghost).

![botones-con-sombra](./docs/readme-md/img/button/botones-con-sombra.png)

```html
<!-- sombra + fondo + texto -->
<button class="btn btn-primary btn-background btn-shadow">Primary</button>

<!-- sombra + texto -->
<button class="btn btn-secondary btn-ghost btn-shadow">Secondary</button>

<!-- sombra + borde + texto -->
<button class="btn btn-success btn-outline btn-shadow">Success</button>

<!-- sombra + bordes redondeados + icono + fondo -->
<button class="btn btn-warning btn-background btn-icon-only btn-shadow">
  <span class="material-symbols-outlined">warning</span>
</button>

<!-- sombra + bordes redondeados + icono + borde -->
<button class="btn btn-success btn-outline btn-icon-only btn-shadow">
  <span class="material-symbols-outlined">check_circle</span>
</button>

<!-- sombra + borde + btn-rounded-full forma de circulo + icono -->
<button class="btn btn-outline btn-danger btn-icon-only btn-rounded-full btn-shadow">
  <span class="material-symbols-outlined">delete</span>
</button>

<!-- sombra + btn-rounded-full forma de circulo + icono -->
<button class="btn btn-ghost btn-info btn-icon-only btn-rounded-full btn-shadow">
  <span class="material-symbols-outlined">info</span>
</button>

<!-- sombra + icono + fondo + texto -->
<button class="btn btn-primary btn-background btn-shadow">
  <span class="material-symbols-outlined">arrow_forward</span>
  <span>Primary</span>
</button>

<!-- sombra + icono + fondo + texto + boton redondo -->
<button class="btn btn-info btn-background btn-rounded-full btn-shadow">
  <span class="material-symbols-outlined">info</span>
  <span>Info</span>
</button>
```

### Botones con Icono

Cuando el botón contenga únicamente un icono (sin texto), se utilicen las clases `btn` y `btn-icon-only`.

![solo-icono](./docs/readme-md/img/button/solo-icono.png)

```HTML
<!-- bordes redondeados -->
<button class="btn btn-warning btn-background btn-icon-only">
  <span class="material-symbols-outlined">warning</span>
</button>

<!-- btn-rounded-full forma de circulo -->
<button class="btn btn-outline btn-danger btn-icon-only btn-rounded-full">
  <span class="material-symbols-outlined">delete</span>
</button>

<button class="btn btn-ghost btn-dark btn-icon-only btn-rounded-full">
  <span class="material-symbols-outlined">settings</span>
</button>

<!-- xs boton muy pequeño -->
<button class="btn btn-info btn-background btn-icon-only btn-rounded-full btn-xs">
  <span class="material-symbols-outlined">info</span>
</button>

<!-- 2xl boton muy grande -->
<button class="btn btn-primary btn-background btn-icon-only btn-rounded-full btn-2xl">
  <span class="material-symbols-outlined">arrow_forward</span>
</button>
```

### Botones con Icono + Fondo

![icono-fondo](./docs/readme-md/img/button/icono-fondo.png)

```html
<button class="btn btn-primary btn-background btn-icon-only">
  <span class="material-symbols-outlined">arrow_forward</span>
</button>

<button class="btn btn-secondary btn-background btn-icon-only">
  <span class="material-symbols-outlined">close</span>
</button>

<button class="btn btn-success btn-background btn-icon-only">
  <span class="material-symbols-outlined">check_circle</span>
</button>

<button class="btn btn-danger btn-background btn-icon-only">
  <span class="material-symbols-outlined">delete</span>
</button>

<button class="btn btn-warning btn-background btn-icon-only">
  <span class="material-symbols-outlined">warning</span>
</button>

<button class="btn btn-info btn-background btn-icon-only">
  <span class="material-symbols-outlined">info</span>
</button>

<button class="btn btn-light btn-background btn-icon-only">
  <span class="material-symbols-outlined">light_mode</span>
</button>

<button class="btn btn-dark btn-background btn-icon-only">
  <span class="material-symbols-outlined">dark_mode</span>
</button>
```

### Botones con Borde + Icono

![icono-borde](./docs/readme-md/img/button/icono-borde.png)

```html
<button class="btn btn-primary btn-outline btn-icon-only">
  <span class="material-symbols-outlined">arrow_forward</span>
</button>

<button class="btn btn-secondary btn-outline btn-icon-only">
  <span class="material-symbols-outlined">close</span>
</button>

<button class="btn btn-success btn-outline btn-icon-only">
  <span class="material-symbols-outlined">check_circle</span>
</button>

<button class="btn btn-danger btn-outline btn-icon-only">
  <span class="material-symbols-outlined">delete</span>
</button>

<button class="btn btn-warning btn-outline btn-icon-only">
  <span class="material-symbols-outlined">warning</span>
</button>

<button class="btn btn-info btn-outline btn-icon-only">
  <span class="material-symbols-outlined">info</span>
</button>

<button class="btn btn-light btn-outline btn-icon-only">
  <span class="material-symbols-outlined">light_mode</span>
</button>

<button class="btn btn-dark btn-outline btn-icon-only">
  <span class="material-symbols-outlined">dark_mode</span>
</button>
```

### Botones con Icono + Fondo + Texto

![icono-fondo-texto](./docs/readme-md/img/button/icono-fondo-texto.png)

```html
<button class="btn btn-primary btn-background">
  <span class="material-symbols-outlined">arrow_forward</span>
  <span>Primary</span>
</button>

<button class="btn btn-secondary btn-background">
  <span class="material-symbols-outlined">close</span>
  <span>Secondary</span>
</button>

<button class="btn btn-success btn-background">
  <span class="material-symbols-outlined">check_circle</span>
  <span>Success</span>
</button>

<button class="btn btn-danger btn-background">
  <span class="material-symbols-outlined">delete</span>
  <span>Danger</span>
</button>

<button class="btn btn-warning btn-background">
  <span class="material-symbols-outlined">warning</span>
  <span>Warning</span>
</button>

<button class="btn btn-info btn-background">
  <span class="material-symbols-outlined">info</span>
  <span>Info</span>
</button>

<button class="btn btn-light btn-background">
  <span class="material-symbols-outlined">light_mode</span>
  <span>Light</span>
</button>

<button class="btn btn-dark btn-background">
  <span class="material-symbols-outlined">dark_mode</span>
  <span>Dark</span>
</button>
```

### Botones Redondos

`btn-rounded-full` redondea al maximo las esquinas de cualquier tipo de boton

| Tipo de botón  | Condición (dimensiones) | Resultado visual                                  |
|----------------|-------------------------|---------------------------------------------------|
| Rectangular    | width ≠ height          | Esquinas totalmente redondeadas (forma alargada)  |
| Cuadrado       | width = height          | Círculo perfecto (no óvalo)                       |

![botones-redondos](./docs/readme-md/img/button/botones-redondos.png)

```HTML
<button class="btn btn-primary btn-background btn-rounded-full">Primary</button>

<button class="btn btn-secondary btn-outline btn-rounded-full">Secondary</button>

<button class="btn btn-info btn-background btn-rounded-full">
  <span class="material-symbols-outlined">info</span>
  <span>Info</span>
</button>

<button class="btn btn-outline btn-danger btn-icon-only btn-rounded-full">
  <span class="material-symbols-outlined">delete</span>
</button>

<button class="btn btn-background btn-warning btn-icon-only btn-rounded-full">
  <span class="material-symbols-outlined">warning</span>
</button>

<!-- SIN btn-rounded-full tiene esquinas redondeadas -->
<button class="btn btn-background btn-success btn-icon-only">
  <span class="material-symbols-outlined">check_circle</span>
</button>
```

### Botones sin Fondo ni Borde

`btn-ghost` tiene las siguientes características:

- **Fondo:** transparente.
- **Borde:** inexistente.
- **Color:** usa los mismos colores de las variantes (primary, secondary, success, etc).
- **Hover:** Cambia color de fondo al situar mouse en boton.
- **Uso:** acciones secundarias o discretas.

***NO hover***

![botones-sin-fondo-ni-borde](./docs/readme-md/img/button/botones-sin-fondo-ni-borde.png)

***hover***

![botones-sin-fondo-ni-borde-hover](./docs/readme-md/img/button/botones-sin-fondo-ni-borde-hover.png)

```HTML
<button class="btn btn-primary btn-ghost">Primary</button>

<button class="btn btn-secondary btn-ghost">
  <span class="material-symbols-outlined">close</span>
  <span>Secondary</span>
</button>

<button class="btn btn-warning btn-ghost btn-icon-only btn-rounded-full">
  <span class="material-symbols-outlined">warning</span>
</button>
```

### Boton Desactivado `cursor: not-allowed`

Agregar el atributo booleano de HTML `disabled` a la etiqueta `<button>` hace que los botones tomen estilos de desactivados.

El estilo de boton desactivado se aplica a cualquier tipo de boton.

![boton-desactivado](./docs/readme-md/img/button/boton-desactivado.png)

```HTML
<button disabled class="btn btn-primary btn-background">Primary</button>

<button disabled class="btn btn-secondary btn-outline">Secondary</button>

<button disabled class="btn btn-icon-only btn-outline btn-danger btn-rounded-full">
  <span class="material-symbols-outlined">delete</span>
</button>

<button disabled class="btn btn-icon-only btn-warning btn-background">
  <span class="material-symbols-outlined">warning</span>
</button>

<button disabled class="btn btn-icon-only btn-outline btn-info">
  <span class="material-symbols-outlined">info</span>
</button>

<button disabled class="btn btn-dark btn-background">
  <span class="material-symbols-outlined">dark_mode</span>
  <span>Dark</span>
</button>

<!-- Enlaces -->
<button disabled class="btn btn-link" routerLink="/home">Link</button>
```

### Tamaños

Puedes modificar el tamaño de cualquier variante de botón, sin importar su estilo (fondo, borde o ghost).

El ajuste de tamaño se aplica a todo el boton y afecta de manera proporcional a todos sus elementos internos:

- Tamaño del botón `padding`.

- Tamaño del texto `font-size`.

- Tamaño de los iconos.

- El espacio entre el icono y el texto `gap` es proporcional al tamaño del botón, ya que utiliza la unidad de medida `em`, la cual depende del `font-size` del propio botón.

El tamaño por defecto de todos los botones es `.btn-base`:

Esto significa que no es necesario declararlo explícitamente: si no se especifica un modificador de tamaño, el botón siempre asumirá este estilo automáticamente.

```SCSS
.btn-base {
  padding: 0.5rem 0.75rem;      // py-2 = 0.5rem = 8px, px-3 = 0.75rem = 12px

  font-size: 1rem;              // text-base = 1rem = 16px
  line-height: calc(1.2 / 1);   // (line-height que se desea aplicar / font-size)
}
```

![tamanos](./docs/readme-md/img/button/tamanos.png)

```HTML
<button class="btn btn-primary btn-background btn-xs">
  Muy pequeño
</button>

<button class="btn btn-secondary btn-outline btn-sm">
  Pequeño
</button>

<button class="btn btn-secondary btn-outline">
  Valor por defecto
</button>

<button class="btn btn-secondary btn-outline btn-base">
  Valor por defecto
</button>

<button class="btn btn-success btn-background btn-lg">
  <span class="material-symbols-outlined">check_circle</span>
  <span>Grande</span>
</button>

<button class="btn btn-danger btn-outline btn-xl">
  <span class="material-symbols-outlined">delete</span>
  <span>Muy grande</span>
</button>

<button class="btn btn-warning btn-background btn-2xl">
  <span class="material-symbols-outlined">warning</span>
  <span>Enorme</span>
</button>

<button class="btn btn-info btn-background btn-3xl">
  <span class="material-symbols-outlined">rocket_launch</span>
  <span>Gigante</span>
</button>
```

### Modificadores - Boton en Bloque - Responsive

En CSS un elemento en bloque es aquel que ocupa todo el ancho disponible de su contenedor y siempre inicia en una nueva línea ("renglon")

```SCSS
.block {
  display: block;
}
```

```SCSS
.flex {
  display: flex;
}
```

`btn-full-width` convierte el boton a elemento en bloque, hace que el boton ocupe todo al ancho disponible de su contenedor padre y es responsive

Funciona para cualquier variante de botón, sin importar su estilo (fondo, borde o ghost).

![boton-responsive](./docs/readme-md/img/button/boton-responsive.png)

```HTML
<!-- solo texto -->
<button class="btn btn-danger btn-background btn-full-width">Danger</button>

<!-- solo icono + fondo -->
<button class="btn btn-dark btn-background btn-icon-only btn-full-width">
  <span class="material-symbols-outlined">dark_mode</span>
</button>

<!-- icono + fondo + texto -->
<button class="btn btn-success btn-background btn-full-width">
  <span class="material-symbols-outlined">check_circle</span>
  <span>Success</span>
</button>

<!-- icono + borde -->
<button class="btn btn-outline btn-info btn-icon-only btn-full-width">
  <span class="material-symbols-outlined">info</span>
</button>

<!-- sin fondo ni borde  -->
<button class="btn btn-primary btn-icon-only btn-ghost btn-full-width">
  <span class="material-symbols-outlined">arrow_forward</span>
</button>
```

### Ubicación de Iconos y Texto en Botones

**Incorrecto:**

Usar [flex-direction](https://tailwindcss.com/docs/flex-direction) para cambiar ubicacion de iconos:

```HTML
<button class="btn btn-primary btn-background flex-row-reverse">
  <span class="material-symbols-outlined">arrow_forward</span>
  <span>Primary</span>
</button>
```

**Correcto:**

Cambiar la ubicación del icono y texto en el HTML, sin usar Sass ni Tailwind.

*icono a la izquierda - texto a la derecha*

![icono-izquierda-texto-derecha](./docs/readme-md/img/button/icono-izquierda-texto-derecha.png)

```HTML
<button class="btn btn-primary btn-background">
  <span class="material-symbols-outlined">arrow_forward</span>
  <span>Primary</span>
</button>
```

*icono a la derecha - texto a la izquierda*

![icono-derecha-texto-izquierda](./docs/readme-md/img/button/icono-derecha-texto-izquierda.png)

```HTML
<button class="btn btn-primary btn-background">
  <span>Primary</span>
  <span class="material-symbols-outlined">arrow_forward</span>
</button>
```

# Consumo de API

## Contrato `ApiResponse<T>`
`ApiResponse<T>` es la interface que define la estructura unica con la que el frontend recibe **TODAS** las respuestas de las APIs (internas y externas). Sin importar que responda el backend, `src\shared\http-client` envuelve toda respuesta HTTP en este contrato; el generico `<T>` tipa el contenido de `data`:

```ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}
```

Ruta del import:

```ts
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
```

## Flujo para Consumir API:
Toda petición tiene que pasa primero por `src\shared\http-client`, y desde ahí se dirige a las APIs internas y externas. Los dos destinos posibles del flujo son:

```txt
                     ┌──────────────────────────────┐
                     │           Frontend           │
                     └──────────────┬───────────────┘
                                    │
                                    ↓
                     ┌──────────────────────────────┐
                     │  httpResource / HttpClient   │
                     └──────────────┬───────────────┘
                                    │
                                    ↓
             ┌──────────────────────────────────────────────┐
             │    Interceptors de src\shared\http-client    │
             │  (por aqui pasan TODAS las peticiones HTTP)  │
             └──────────────────────┬───────────────────────┘
                                    │
                 ┌──────────────────┴──────────────────┐
                 ↓                                     ↓
┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│          Internal APIs           │  │          External APIs           │
│ (Servicio interno / First-Party) │  │ (Servicio externo / Third-Party) │
└──────────────────────────────────┘  └──────────────────────────────────┘
```

## Estandarización de Respuestas al Contrato `ApiResponse<T>`
Toda respuesta que pasa por `HttpClient` termina envuelta en el contrato `ApiResponse<T>`, sin importar el escenario:

| Escenario | Quién lo estandariza | Resultado |
| --------- | -------------------- | --------- |
| 2xx con body que cumple el contrato | `success.interceptor` → normalizer (Caso 1) | El body pasa tal cual |
| 2xx con body fuera del contrato (array plano, string, objeto cualquiera, `null` de un 204) | `success.interceptor` → normalizer (Caso 2) | Se envuelve: `success: true`, `data` = body crudo, message del body o `FALLBACK_MESSAGE(status)` |
| Petición que tarda >1 minuto | `timeout.interceptor` | Respuesta sintética 408 envuelta |
| Backend que "miente" (status del body ≠ status HTTP real) | `getRealHttpStatus` en ambos interceptores | Siempre gana el status real de `HttpClient` + `console.error` de alerta |
| Cualquier petición HTTP en curso (exitosa, errónea o con timeout) | `loader.interceptor` | No toca el body: estandariza el icono de carga global (`fixed-loader`). Un CONTADOR de peticiones activas muestra el loader mientras sea > 0 y `finalize()` lo oculta solo cuando llega a 0, incluso si la respuesta falló; se desactiva por petición con el token `SHOW_LOADER` en `false` |

## Manejo Global de Errores (`src\shared\http-client\response\error-handling`)

| Escenario | Quién lo estandariza | Resultado |
| --------- | -------------------- | --------- |
| 4xx/5xx con o sin contrato | `error.interceptor` | Se envuelve, el error se "traga" y sale como respuesta sintética; además dispara los handlers globales (401/403/404/429/5xx) |
| Error de red / servidor caído (`status 0`, body `ProgressEvent`) | `error.interceptor` | `success: false`, `data: null` (el `ProgressEvent` se descarta), message = `Network Error`; el handler global SÍ actúa: `network-error.handler.service.ts` |
| Respuesta sin body (`status 204`) | `success.interceptor` | `success: true`, `data: null` (nunca `''` ni `undefined`), message = `No Content` |
| JSON malformado del backend | `error.interceptor` (Angular lo reporta como error de parsing) | Envuelto con el message de parsing de Angular |
| Acciones globales según el status de error (0/401/403/404/429/5xx) | `global-error-handler.service.ts` (orquestador, invocado por `error.interceptor`) | Redirige cada status a su handler dedicado: 0 → `network`, 401 → `unauthenticated`, 403 → `forbidden`, 404 → `not-found`, 429 → `too-many-requests` y cualquier status >= 500 se normaliza al bucket 500 → `server-error`. Si el status no está mapeado no ejecuta ninguna acción (`noop`) |

## Reglas de `src\shared\http-client`
1. **PROHIBIDO** escribir logica de negocio/dominio en cualquier archivo de `src\shared\http-client`: todo su codigo tiene que ser agnostico al negocio, es decir, limitarse a responsabilidades transversales de HTTP (interceptores, normalizacion del contrato `ApiResponse<T>`, manejo global de errores, loader, logs) y funcionar igual en cualquier proyecto sin conocer las features que lo consumen.

## Reglas para Consumir API
1. **PROHIBIDO** usar cualquier otro metodo para consumir APIs que no sea HttpClient como fetch o axios directo

2. **PROHIBIDO** usar `try/catch` y sus equivalentes de Angular/RxJS: `catchError()` de RxJS, el callback `error` de `subscribe({ next, error })`, `.catch()` de Promises con `firstValueFrom()`. Esto **NO** es un bug, es una desición de arquitectura de software, intencional para estandarizar respuesta de APIs.

  **Explicacion:** El `src\shared\http-client\response\error-handling\error.interceptor.ts` se "traga" el error: **NUNCA** se propaga con `throw` ni llega al consumidor; en su lugar emite una respuesta sintetica envuelta en el contrato `ApiResponse<T>`. **Las peticiones HTTP erroneas NUNCA llegaran al bloque catch**, por eso el `try/catch` (y sus equivalentes) seria codigo muerto que jamas se ejecuta.

3. **PROHIBIDO** propagar los errores de las peticiones HTTP: esta prohibido usar `throw new Error()`, `throw error` o `throwError()` de RxJS. Si nadie lanza errores, no existe nada que capturar y el `try/catch` (y sus equivalentes) pierde toda razon de existir

4. **SIEMPRE** todas las peticiones HTTP exitosas y erroneas tienen que validarse con la key `success`: es la key `success: boolean` del contrato `ApiResponse<T>` que envuelve toda respuesta HTTP; la calcula `src\shared\http-client` a partir del http status real de la respuesta (`true` cuando el status es 2xx, `false` en cualquier otro caso). Validar con la key `success` (desestructurada, ver regla 6) es la sustitucion a la propagacion de errores y al `try/catch`: `if (!success) return;` es la unica validacion que necesita el consumidor

5. **PROHIBIDO** (en la gran mayoria de los casos) crear un estado booleano propio (signal, variable, etc.) para mostrar y ocultar el icono de cargando: `src\shared\http-client\loader\interceptors\loader.interceptor.ts` ya se encarga de mostrarlo y ocultarlo automaticamente en TODAS las peticiones HTTP, a traves del componente `src\shared\http-client\loader\design\ui\fixed-loader`.

   **Caso muy especial (extremadamente raro):** se permite desactivar el icono de cargando **EXCLUSIVAMENTE** en peticiones HTTP donde, por experiencia de usuario, sea totalmente necesario **NO** bloquear la UI (pantalla) con el `position: fixed` del componente `fixed-loader`. Para ese unico caso, pasar el token `SHOW_LOADER` (exportado por `loader.interceptor.ts`, por defecto `true`) en `false` en esa peticion concreta:

   ```ts
   import { environment } from '@/environments/environment';

   async getTasks(): Promise<void> {
     const { success, data } = await firstValueFrom(
       this.http.get<ApiResponse<Task[]>>(`${environment.api}tasks`, {
         context: new HttpContext().set(SHOW_LOADER, false),
       }),
     );

     if (!success) return;

     this.tasks.set(data);
   }
   ```

6. Desestructurar las keys del contrato `ApiResponse<T>` (`success`, `status`, `message`, `data`) al consumir la respuesta. Esta **PROHIBIDO** acceder directamente a las keys sin desestructurar: `response.success`, `response.status`, `response.message` y `response.data`.

7. Usar early return pattern al validar la key `success` de las peticiones HTTP: validar primero el caso fallido y salir de inmediato con `if (!success) return;`, para que la logica principal quede en el nivel raiz de la funcion, sin anidacion.

8. Importar los environment desde el archivo base `@/environments/environment`. Esta **PROHIBIDO** importar directamente un archivo de entorno especifico (`environment.localhost`, `environment.test`, `environment.prod`): el build de Angular (`fileReplacements` segun el script de `package.json`) es quien reemplaza el archivo base por el del entorno que corresponda; importar uno especifico quema el entorno y rompe ese reemplazo.

9. Construir la URL de toda peticion HTTP concatenando `environment.api` + el endpoint. `environment.api` es la URL base de la API segun el entorno de ejecucion (por ejemplo `'http://localhost:3000/api/v1/'`), asi el mismo codigo funciona en localhost, pruebas y produccion sin modificar nada. Esta **PROHIBIDO** quemar (hardcodear) la URL base en la peticion.

10. **PROHIBIDO** usar `async/await` con `lastValueFrom()` de RxJS: la unica forma permitida de convertir el Observable de `HttpClient` en Promise es `firstValueFrom()`. Razon: `firstValueFrom()` resuelve apenas llega la PRIMERA emision, mientras que `lastValueFrom()` solo resuelve cuando el Observable se COMPLETA; aplicado a un stream que nunca se completa, la Promise queda colgada para siempre y el `await` bloquea ese flujo indefinidamente. En una peticion HTTP ambos se comportan igual (HttpClient emite un unico valor y completa), por eso se estandariza `firstValueFrom()` como unico patron.

11. **PROHIBIDO** usar `toPromise()`: esta deprecado desde RxJS 7 y eliminado en RxJS 8, por lo que es codigo legacy que rompera al actualizar la libreria. Ademas su comportamiento es ambiguo: resuelve con el ULTIMO valor solo cuando el Observable se completa y resuelve con `undefined` si se completa sin emitir, lo que obliga a tipar el resultado como `T | undefined`. El reemplazo oficial y unico permitido en este proyecto es `firstValueFrom()` (ver regla 10).

## Casos Donde Usar `async/await con firstValueFrom()`

## Casos Donde Usar Observable
* Debounce para retrasar peticiones HTTP al buscar en OnChange de input

## Casos Donde Usar `httpResource()`
* Usar `httpResource` para peticiones HTTP GET que requieran reactividad. No utilizarlo para mutaciones (POST, PUT, PATCH o DELETE); en esos casos, utilizar directamente `HttpClient`.

## Casos Donde Usar `HttpClient`

## Casos Donde Usar `resource()`
Para peticiones HTTP usa `httpResource()` o `HttpClient`, no `resource()` + `fetch`: pasa por el stack de `HttpClient` (interceptors, auth, manejo de errores) y te ahorra escribir params/loader a mano.

## Casos Donde Usar `toSignal`
Re-fetch reactivo

# INCOMPLETO - VERIFICAR Q EN "CONSUMO DE API" HAYA ESCRITO LO Q ESTA EN SIGUIENTE TEXTO

```txt
En nuevo proyecto angular

En esta sección
https://github.com/DanielPinedaM/nuevo-proyecto-Angular#-consumo-de-api

Explicar con ejemplos y usando http gateway observable cuando usar cada uno de los patrones angular  para consumir API que son los siguientes

async await  firstValueFrom

toSignal()

RxJS operators (switchMap, mergeMap, concatMap, exhaustMap, debounceTime, distinctUntilChanged) - este ejemplo debe ser de debounce

ejecuta varias promesas en paralelo y devuelve los resultados cuando todas terminan correctamente; si una falla, la operación completa falla

Ejecutar todas las peticiones en paralelo sin importar si fallan o son exitosas

Esperar que una petición  termine antes de la siguiente

Segunda petición depende del resultado de la primera

Ejecutar peticiones secuencialmente

Explicar la diferencia y cuando usar first value from y observables para hacer petición http

También me falta ejemplo de llamar API usando  observable

Observable no espera , es asíncrono , es como si pasara derecho , y cuando se resuelva la llamada a la API (promesa) entonces obtiene (devuelve) la respuesta 

first value from usa await por lo q espera antes de continuar con la siguiente linea de código

Observable sirve para hacer debounce


Además, `GatewayApiService` maneja:

* icono de loader global
* timeout
* logging
* logger
* validaciones de seguridad (guards)
```

# Buenas Practicas

## Tipado en TypeScript

### Strict Type Checking
Usar strict type checking

### Inferencia de Tipos
Preferir la inferencia de tipos cuando el tipo sea obvio

**Incorrecto:**

```ts
// el tipo es obvio, anotarlo es ruido
const total: number = 10;
const isActive: boolean = true;
const tags: string[] = ['angular', 'signals'];
```

**Correcto:**

```ts
const total = 10;
const isActive = true;
const tags = ['angular', 'signals'];
```

### `unknown` en Lugar de `any`
Prohibido el tipo `any`; usa `unknown` cuando el tipo sea incierto.

**Incorrecto:**

```ts
function parseTitle(value: any): string {
  // any desactiva el chequeo de tipos: esto compila y falla en runtime
  return value.toUpperCase();
}
```

**Correcto:**

```ts
function parseTitle(value: unknown): string {
  // unknown obliga a comprobar el tipo antes de usarlo
  if (typeof value === 'string') return value;

  return '';
}
```

### `interface` para Tipos de Objeto
Preferir `interface` para tipos de objeto (`Task`) y para el tipo de los elementos en arrays de objetos (`Task[]`).

**Incorrecto:**

```ts
// un objeto no se modela con type
type Task = {
  id: number;
  title: string;
  completed: boolean;
};

// ni con el objeto escrito en línea
const tasks: { id: number; title: string; completed: boolean }[] = [];
```

**Correcto:**

```ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const tasks: Task[] = [];
```

### `Record<Clave, Valor>` para Claves Dinámicas
Usar `Record<Clave, Valor>` para objetos con claves dinámicas.

**Incorrecto:**

```ts
interface TasksById {
  [key: number]: Task;
}
```

**Correcto:**

```ts
const tasksById: Record<number, Task> = {};
const labels: Record<string, string> = { pending: 'Pendiente', done: 'Hecha' };
```

### `type` para Primitivos, Literales y Uniones
Usar `type` para tipos primitivos, literales y uniones.

**Incorrecto:**

```ts
// una union no se modela con interface
interface TaskStatus {
  value: 'pending' | 'in-progress' | 'done';
}
```

**Correcto:**

```ts
type TaskStatus = 'pending' | 'in-progress' | 'done';
type TaskFilter = TaskStatus | 'all';

interface TaskStatus {
  value: TaskStatus;
}
```

## Evitar Prop Drilling y Usar Data Down, Events Up

**Regla:**
PROHIBIDO el prop drilling. Toda comunicación entre componentes usa **data down, events up**.

Aplicar SIEMPRE que se diseñe, cree, divida, modifique o refactorice un componente, o que se defina cómo se comunican dos componentes.

**Definiciones:**
* **Data down:** el padre pasa el dato al hijo **directo** con `input()`. El hijo lo consume; nunca lo muta.

* **Events up:** el hijo notifica al padre **directo** con `output()`. El padre es dueño del estado y el único que lo actualiza.

* **Prop drilling (PROHIBIDO):** un `input()` o un `output()` que atraviesa **1 o más componentes intermedios que no lo consumen** y que solo lo reenvían hacia abajo o lo re-emiten hacia arriba.

Un `input()` que el hijo directo sí consume NO es prop drilling. Lo prohibido es el componente de paso.

### Alternativas, en Este Orden
1. **Composición, reestructurar el árbol de componentes:** eliminar o reubicar el componente intermedio para que el que produce el dato y el que lo consume queden padre/hijo directos. No usa ninguna API extra, cambia la forma del árbol. Es la opción por defecto.

2. **Content projection con `ng-content`:** cuando el componente intermedio debe existir, que proyecte el contenido en lugar de reenviar `input()`/`output()`. Así el padre queda conectado directamente con el componente que consume el dato.

3. **`@Service()` singleton con signals:** solo si lo anterior no aplica. El estado vive en el service, y cada componente lo inyecta con `inject()` donde lo necesita. PROHIBIDO usar RxJS como contenedor de estado

### Checklist Antes de Escribir el Componente
```txt
- [ ] 1. Por cada input()/output() nuevo: verificar que el componente que lo declara consume el valor.
- [ ] 2. Si solo lo reenvía o lo re-emite, es prop drilling: no escribirlo.
- [ ] 3. Resolverlo reestructurando el árbol; si el intermedio debe existir, usar ng-content; si nada de eso aplica, mover el estado a un @Service() singleton con signals.
- [ ] 4. Confirmar que el hijo no muta el input(): notifica con output() y el padre decide.
```

### Prohibiciones
* Declarar un `input()` cuyo único uso sea pasarlo a otro componente en el template.

* Declarar un `output()` cuyo único uso sea re-emitir el `output()` de un hijo.

* Mutar dentro del hijo el valor recibido por `input()`.

### Al Refactorizar
Antes de modificar un componente, recorrer la cadena de `input()`/`output()` de arriba abajo y listar los que atraviesan componentes intermedios. Cada uno es una violación y debe eliminarse aplicando las alternativas.

## Rutas Absolutas en `import` e Imágenes
La regla es la misma para `import` e imágenes: siempre usar ruta absoluta. Está prohibido usar rutas relativas.

Para los `import`, usar los alias definidos en `paths` de `tsconfig.json`.

**Correcto:**

```html
<!-- my-component.component.html -->

<!-- usar slash al principio de /assets -->
<img src="/assets/img/logo.png" alt="Logo" />
```

```ts
// my-component.component.ts

// usar el alias @/ definido en tsconfig.json
import { MyComponent } from '@/app/features/my-feature/my-component/my-component.component';
```

**Incorrecto:**

```html
<!-- my-component.component.html -->

<!-- es incorrecto porque se escribe ../ -->
<img src="../../../assets/img/logo.png" alt="Logo" />
```

```html
<!-- my-component.component.html -->

<!-- es incorrecto porque NO se escribió el slash al principio de assets -->
<img src="assets/img/logo.png" alt="Logo" />
```

```ts
// my-component.component.ts

// es incorrecto porque se escribe ../ en lugar de usar el alias @/
import { MyComponent } from '../../features/my-feature/my-component/my-component.component';
```
