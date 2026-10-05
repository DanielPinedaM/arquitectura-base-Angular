# Configuración de entornos

## Estrategias de configuración

Angular soporta dos estrategias principales de configuración:

- **Configuración en tiempo de build** usando archivos de environment
- **Configuración en runtime** cargando valores al iniciar la aplicación

Elige el enfoque según tus requisitos de deployment.

---

## Configuración en tiempo de build

Los archivos de environment definen valores de configuración que se reemplazan en tiempo de build.

> **Nota de seguridad:** Los archivos de environment se empaquetan dentro de la aplicación del lado del cliente.
> Son visibles para cualquiera que pueda cargar la página.
> Nunca almacenes información sensible como API keys, secretos o credenciales en los archivos de environment.
> Los usuarios pueden acceder fácilmente a estos valores.

Genera los archivos de environment usando el CLI:

```bash
ng generate environments
```

Esto crea archivos específicos de cada entorno, como:

```ts
// environment.ts
export const environment = {
  apiUrl: 'https://api.example.com',
};
```

```ts
// environment.development.ts
export const environment = {
  apiUrl: 'http://localhost:3000',
};
```

Importa el environment donde se necesite:

```ts
import {environment} from '../environments/environment';

const apiUrl = environment.apiUrl;
```

Angular CLI reemplaza el archivo apropiado según la configuración de build.

Si necesitas verificar el modo de desarrollo, usa `isDevMode()` de `@angular/core` en lugar de depender de un flag `production` mantenido manualmente.

> Los cambios en los archivos de environment requieren volver a hacer build de la aplicación.

---

## Configuración en runtime (avanzado)

En algunos escenarios, las aplicaciones necesitan cargar la configuración en runtime en lugar de en tiempo de build.

Esto permite que el mismo artefacto de build se despliegue en múltiples entornos sin volver a hacer build.

Un enfoque común es cargar un archivo de configuración JSON desde la carpeta `assets` durante la
inicialización de la aplicación.

### Ejemplo

```json
// src/assets/config.json
{
  "apiUrl": "https://api.example.com"
}
```

Carga la configuración antes de que la aplicación inicie:

```ts
import {Service, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

interface AppConfig {
  apiUrl: string;
}

@Service()
export class AppConfigService {
  private config!: AppConfig;

  private readonly http = inject(HttpClient);

  loadConfig() {
    return this.http.get<AppConfig>('/assets/config.json').pipe(
      tap((data) => {
        this.config = data;
      }),
    );
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }
}
```

Registra el loader durante el bootstrap de la aplicación:

```ts
import {provideAppInitializer, inject} from '@angular/core';

provideAppInitializer(() => {
  const config = inject(AppConfigService);
  return config.loadConfig();
});
```

Esto asegura que la configuración esté disponible antes de que la aplicación se renderice.

> La configuración en runtime es un patrón avanzado y no es necesaria para la mayoría de las aplicaciones.

---

## Elegir una estrategia

| Criterio                         | Tiempo de build | Runtime        |
| -------------------------------- | --------------- | -------------- |
| Cambiar sin volver a hacer build | No              | Sí             |
| Rendimiento al iniciar           | Más rápido      | Ligero retraso |
| Complejidad                      | Baja            | Moderada       |
| Flexibilidad de deployment       | Limitada        | Alta           |

Usa la configuración en tiempo de build para la mayoría de las aplicaciones, y la configuración en runtime cuando necesites
desplegar el mismo build en múltiples entornos.
