# Creación de nuevos proyectos

Si el usuario no proporciona lineamientos, estas son algunas reglas por defecto a seguir al crear un nuevo proyecto de Angular:

1. Usa la última versión estable de Angular a menos que el usuario especifique lo contrario.
2. Usa Signal Forms para la gestión de formularios en proyectos nuevos (estable en Angular v22 y versiones posteriores) [Más información](../formularios/signal-forms.md).

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
