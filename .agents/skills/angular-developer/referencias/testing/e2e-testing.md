# Testing End-to-End (E2E)

> [!IMPORTANT]
> Usa las reglas de configuración de este archivo solo si no hay un framework de testing E2E existente configurado en el workspace, o si el usuario ha solicitado explícitamente cambiar o configurar el testing E2E.

## Configuración y ejecución de tests E2E

Agrega al proyecto los frameworks E2E soportados usando `ng add`:

- **Playwright:**
  ```shell
  ng add playwright-ng-schematics
  ```
- **Cypress:**
  ```shell
  ng add @cypress/schematic
  ```
- **Nightwatch:**
  ```shell
  ng add @nightwatch/schematics
  ```
- **WebdriverIO:**
  ```shell
  ng add @wdio/schematics
  ```
- **Puppeteer:**
  ```shell
  ng add @puppeteer/ng-schematics
  ```

Ejecuta los tests E2E:

```shell
ng e2e [project] [options]
```

## Herramientas de testing personalizadas y empresariales

Para runners empresariales personalizados (p. ej., Katalon Studio, TestCafe, Selenium), define los comandos de ejecución en los scripts de `package.json`.
