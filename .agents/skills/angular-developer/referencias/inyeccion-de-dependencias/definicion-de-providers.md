# Definición de dependency providers

Angular ofrece formas automáticas y manuales de proveer dependencias a su sistema de inyección de dependencias (DI).

## Provisión automática

La forma más común de proveer un servicio es usando `providedIn: 'root'` en un `@Injectable()`.

### InjectionToken

Usa `InjectionToken` para dependencias que no son clases (objetos de configuración, funciones, primitivos). Un `InjectionToken` también puede proveerse automáticamente.

```ts
import {InjectionToken} from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: () => ({apiUrl: 'https://api.example.com'}),
});
```

## Provisión manual

Usas el array `providers` cuando un servicio no tiene `providedIn`, cuando quieres una nueva instancia para un componente específico o al configurar valores en runtime.

```ts
@Component({
  providers: [
    // Forma abreviada de { provide: LocalService, useClass: LocalService }
    LocalService,

    // useClass: Intercambia implementaciones
    {provide: Logger, useClass: BetterLogger},

    // useValue: Provee valores estáticos
    {provide: API_URL_TOKEN, useValue: 'https://api.example.com'},

    // useFactory: Genera el valor dinámicamente
    {
      provide: ApiClient,
      useFactory: (http = inject(HttpClient)) => new ApiClient(http),
    },

    // useExisting: Crea un alias
    {provide: OldLogger, useExisting: NewLogger},

    // multi: Provee múltiples valores para el mismo token como un array
    {provide: INTERCEPTOR_TOKEN, useClass: AuthInterceptor, multi: true},
  ],
})
export class Example {}
```

## Scopes de los providers

- **Bootstrap de la aplicación**: Singletons globales. Úsalo para clientes HTTP, logging o configuración de toda la aplicación.
- **Componente/Directiva**: Instancias aisladas. Úsalo para estado o formularios específicos de un componente. Los servicios se destruyen cuando el componente se destruye.
- **Ruta**: Servicios específicos de una feature que se cargan solo con rutas específicas.

## Patrón para librerías: funciones `provide*`

Los autores de librerías deben exportar funciones que devuelvan arrays de providers para encapsular la configuración:

```ts
export function provideAnalytics(config: AnalyticsConfig): Provider[] {
  return [{provide: ANALYTICS_CONFIG, useValue: config}, AnalyticsService];
}
```
