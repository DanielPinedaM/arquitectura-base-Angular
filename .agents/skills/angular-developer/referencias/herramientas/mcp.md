# Angular CLI MCP Server

Angular CLI incluye un servidor Model Context Protocol (MCP) que permite a los asistentes de IA (como Cursor, Gemini CLI, JetBrains AI, etc.) interactuar directamente con Angular CLI. Proporciona tools para el análisis de proyectos, migraciones guiadas y la ejecución de builds/tests.

## Tools disponibles (por defecto)

Cuando el MCP server está habilitado, los agentes de IA tienen acceso a las siguientes tools:

| Nombre                      | Descripción                                                                                                            |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `ai_tutor`                  | Inicia un tutor interactivo de Angular impulsado por IA.                                                               |
| `devserver.start`           | Inicia de forma asíncrona un dev server (`ng serve`). Retorna inmediatamente.                                          |
| `devserver.stop`            | Detiene el dev server.                                                                                                 |
| `devserver.wait_for_build`  | Devuelve los logs del build más reciente en un dev server en ejecución.                                                |
| `get_best_practices`        | Obtiene la Guía de Buenas Prácticas de Angular (crucial para standalone components, typed forms, etc.).                |
| `list_projects`             | Lista todas las aplicaciones y librerías del workspace leyendo `angular.json`.                                         |
| `onpush_zoneless_migration` | Analiza el código y proporciona un plan para migrarlo a la change detection `OnPush` (requisito previo para zoneless). |
| `run_target`                | Ejecuta un target configurado.                                                                                         |
| `search_documentation`      | Busca en la documentación oficial en `https://angular.dev/llms.txt`.                                                   |

## Configuración

Para usar el MCP server, configura tu entorno host (IDE o CLI) para que ejecute `npx @angular/cli mcp`.

### Antigravity IDE

Crea un archivo llamado `.antigravity/mcp.json` en la raíz de tu proyecto:

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### Gemini CLI

Crea `.gemini/settings.json` en la raíz del proyecto:

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### Cursor

Crea `.cursor/mcp.json` en la raíz del proyecto (o de forma global en `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### VS Code

Crea `.vscode/mcp.json`:

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## Opciones del comando

Puedes pasar argumentos al MCP server en el array `args` de tu configuración:

- `--read-only`: Solo registra tools que no modifican el proyecto.
- `--local-only`: Solo registra tools que no requieren conexión a internet.

Ejemplo para el modo de solo lectura:

```json
"args": ["-y", "@angular/cli", "mcp", "--read-only"]
```
