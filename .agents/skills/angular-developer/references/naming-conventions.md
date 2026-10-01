# Convenciones de nomenclatura de Angular (guía de estilo de Angular v20+)

Esta skill aplica las convenciones de nomenclatura de Angular para componentes, servicios, directivas, pipes y modelos. Aunque promueve la filosofía moderna **"Intent over Role"** introducida en Angular v20, **primero debe respetar las configuraciones existentes del proyecto**.

---

## Principios fundamentales

1. **Prioriza las convenciones existentes**: Antes de generar o refactorizar archivos, revisa los archivos existentes del proyecto, la configuración de `angular.json` y las reglas de ESLint. **No fuerces la nomenclatura sin sufijos en proyectos que dependen de los sufijos estándar.**
2. **Elimina los sufijos de rol (solo proyectos modernos)**: En proyectos configurados para "Intent over Role" o en proyectos v20+ recién creados, los nombres de archivo ya no incluyen extensiones funcionales como `.component.ts`, `.service.ts` o `.directive.ts`. Las clases TypeScript correspondientes eliminan sufijos como `Component`, `Service` o `Directive`.
3. **Nomenclatura basada en la intención/propósito**: Cuando la nomenclatura sin sufijos está activa, nombra los archivos y las clases según su dominio específico, responsabilidad o propósito de negocio (p. ej., `-data`, `-store`, `-api` o `-formatter`).
4. **La ubicación de la carpeta como contexto**: Apóyate en la jerarquía de carpetas (`core/`, `features/`, `shared/`) y en las capacidades del IDE para identificar el rol técnico de los archivos, en lugar de codificar ese contexto dentro del nombre del archivo.
5. **Excepción para interfaces/modelos**: Las interfaces y los modelos de datos conservan el sufijo `.model.ts` para declarar claramente los contratos de tipos.

---

## Estructura de proyecto recomendada y reglas de nomenclatura

### 1. Coincidencia y consistencia entre archivo e identificador

- **Guiones en los nombres de archivo**: Sigue usando kebab-case (guiones) para separar palabras en los nombres de archivo (p. ej., `product-list.ts`).
- **Coincidencia de identificadores**: Los nombres de archivo deben alinearse directamente con la clase/identificador principal de TypeScript (p. ej., `product-list.ts` contiene `class ProductList`).
- **Nombres de archivo unificados**: Si usas archivos separados de template o de estilos, mantén los nombres idénticos al archivo TypeScript principal:
  - `product-list.ts`
  - `product-list.html`
  - `product-list.css`
- **Archivos de test**: Sigue usando el mismo nombre base con el sufijo `.spec.ts` (p. ej., `product-list.spec.ts` para `product-list.ts`).

### 2. Directorio core (base de la aplicación)

Aloja servicios singleton, estado global y modelos de todo el sistema.

- **Servicios (lógica/estado)**:
  - _Anterior_: `auth.service.ts` (Clase: `AuthService`)
  - _Nuevo_: `auth.ts` (Clase: `AuthService`)
  - _Alternativa (específica de la intención)_: Usa sufijos descriptivos del propósito del dominio como `[domain]-data.ts`, `[domain]-store.ts` o `[domain]-data-client.ts` (p. ej., `auth-data.ts` / `AuthData`, `user-data-client.ts` / `UserDataClient`).
- **Modelos**: Conserva el sufijo `.model.ts` para las estructuras de datos.
  - _Ejemplo_: `user.model.ts` (Interfaz: `User`)

### 3. Directorio features (lógica de negocio del dominio)

Organiza los archivos en carpetas específicas de cada feature que contengan los componentes, servicios locales y rutas relacionados con ese dominio.

- **Componente principal de la feature**: Nombra el componente principal de la feature según la ruta o la propia feature.
  - _Ejemplo_: `features/profile/profile.ts` (Clase: `Profile`)
- **Subcomponentes de la feature**: Nombra los subcomponentes según su rol de visualización o funcional.
  - _Ejemplo_: `features/profile/components/profile-header.ts` (Clase: `ProfileHeader`)
  - _Ejemplo_: `features/projects/components/project-card.ts` (Clase: `ProjectCard`)
- **Servicios de la feature**: Nombra los servicios de la feature según las necesidades de datos o de estado específicas de la feature.
  - _Ejemplo_: `features/projects/projects-data.ts` (Clase: `ProjectsData`)

### 4. Directorio shared (toolkit de UI reutilizable)

Almacena en una carpeta compartida los elementos puros y de presentación, y los helpers, sin ninguna lógica de negocio.

- **Componentes compartidos**: Nombra los componentes compartidos según su rol reutilizable en la UI.
  - _Ejemplo_: `shared/components/button/button.ts` (Clase: `Button`)
  - _Ejemplo_: `shared/components/spinner/spinner.ts` (Clase: `Spinner`)
- **Pipes compartidos**: Nombra los pipes compartidos según su propósito de formateo.
  - _Ejemplo_: `shared/pipes/format-date.ts` (Clase: `FormatDate`)
- **Directivas compartidas**: Nombra las directivas según el comportamiento que adjuntan a los elementos.
  - _Anterior_: `highlight.directive.ts` (Clase: `HighlightDirective`)
  - _Nuevo_: `highlight.ts` (Clase: `Highlight`)

---

## Buenas prácticas y reglas de coexistencia

- **Cómo determinar el estilo en uso**:
  1.  Inspecciona los archivos adyacentes en el directorio de destino (¿terminan en `.component.ts` o en `.ts`?).
  2.  Revisa `angular.json` en busca de opciones personalizadas de schematics que puedan configurar el comportamiento de los sufijos.
  3.  Si no estás seguro, usa el estilo tradicional con sufijo de rol (`.component.ts`, `.service.ts`), ya que es el valor por defecto más seguro en el ecosistema de Angular.
- **Evita colisiones de namespace**: Sin sufijos de rol, archivos como `user.ts` (componente) y `user.model.ts` (modelo) pueden colisionar si ambos declaran una clase/interfaz llamada `User`.
  - Para evitarlo, usa nombres más específicos y basados en la intención para los componentes (p. ej., `class UserProfile` en `user-profile.ts` o `class UserDetail` en `user-detail.ts`), manteniendo el nombre simple del dominio para la interfaz (`interface User` en `user.model.ts`).
- **Verificación de consistencia**: No mezcles los estilos antiguos con sufijo y los nuevos estilos sin sufijo en la misma carpeta de feature o módulo. Mantén el código legacy existente tal como está, a menos que migres todo el módulo a la estructura moderna.
- **Apóyate en el IDE**: Confía en la navegación de código de los IDE modernos (p. ej., "Go to Definition" o búsquedas difusas de nombres de clases como `AuthData` o `ProfileHeader`) y en los íconos de tipo de archivo, en lugar de escanear visualmente los strings de los sufijos.
