# Migraciones automáticas y modernización del código

Cuando se te asigne la tarea de refactorizar o modernizar un codebase existente, prefiere siempre usar los schematics automatizados oficiales disponibles en `@angular/core` en lugar del reemplazo manual de texto.

## Descubrir migraciones

Para ver todos los schematics disponibles para la versión instalada del framework principal, ejecuta:
`ng generate @angular/core: --help`

## Schematics de migración comunes

Usa los siguientes comandos para aplicar actualizaciones de sintaxis específicas. Puedes limitar el alcance de estos comandos a un proyecto o directorio específico usando los flags `--project <name>` o `--path <dir>`.

| Funcionalidad a modernizar    | Comando a ejecutar                                                     |
| :---------------------------- | :--------------------------------------------------------------------- |
| **Control flow integrado**    | `ng generate @angular/core:control-flow`                               |
| **Inputs basados en signals** | `ng generate @angular/core:signal-input-migration`                     |
| **Signal Queries**            | `ng generate @angular/core:signal-queries-migration`                   |
| **Outputs funcionales**       | `ng generate @angular/core:output-migration`                           |
| **Función `inject()`**        | `ng generate @angular/core:inject`                                     |
| **Etiquetas de autocierre**   | `ng generate @angular/core:self-closing-tag`                           |
| **Standalone**                | `ng generate @angular/core:standalone` (ver el flujo de trabajo abajo) |

## Flujo de trabajo especializado: migrar a standalone

La migración a standalone es una refactorización interactiva de múltiples pasos. **DEBES** realizarla en tres etapas discretas, verificando que la aplicación compile y se ejecute correctamente después de que termine cada etapa:

1. **Fase 1**: Ejecuta `ng generate @angular/core:standalone` y selecciona la opción **Convert all components, directives and pipes to standalone**.
2. **Fase 2**: Verifica el build con `ng build`. Ejecuta el comando de nuevo y selecciona **Remove unnecessary NgModule classes**.
3. **Fase 3**: Verifica el build con `ng build`. Ejecuta la pasada final y selecciona **Bootstrap the application using standalone APIs**.
