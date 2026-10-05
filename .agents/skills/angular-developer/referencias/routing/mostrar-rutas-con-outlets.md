# Mostrar rutas con outlets

La directiva `RouterOutlet` es un placeholder donde Angular renderiza el componente correspondiente a la URL actual.

## Uso básico

Incluye `<router-outlet />` en tu template. Angular inserta el componente de la ruta como un hermano inmediatamente después del outlet.

```html
<app-header /> <router-outlet />
<!-- El contenido de la ruta aparece aquí -->
<app-footer />
```

## Outlets anidados

Las rutas hijas requieren su propio `<router-outlet />` dentro del template del componente padre.

```ts
// Template del componente padre
<h1>Settings</h1>
<router-outlet /> <!-- Los componentes hijos como Profile o Security se renderizan aquí -->
```

## Outlets con nombre (rutas secundarias)

Las páginas pueden tener múltiples outlets. Asigna un `name` a un outlet para apuntar a él específicamente. El nombre por defecto es `'primary'`.

```html
<router-outlet />
<!-- Primario -->
<router-outlet name="sidebar" />
<!-- Secundario -->
```

Define el `outlet` en la configuración de la ruta:

```ts
{
  path: 'chat',
  component: Chat,
  outlet: 'sidebar'
}
```

## Eventos del ciclo de vida del outlet

`RouterOutlet` emite eventos cuando los componentes cambian:

- `activate`: Se instanció un nuevo componente.
- `deactivate`: Se destruyó un componente.
- `attach` / `detach`: Se usan con `RouteReuseStrategy`.

```html
<router-outlet (activate)="onActivate($event)" />
```

## Pasar datos mediante `routerOutletData`

Puedes pasar datos contextuales al componente de la ruta usando el input `routerOutletData`. El componente accede a ellos mediante el injection token `ROUTER_OUTLET_DATA` como un signal.

```ts
// En el padre
<router-outlet [routerOutletData]="{ theme: 'dark' }" />

// En el componente de la ruta
outletData = inject(ROUTER_OUTLET_DATA) as Signal<{ theme: string }>;
```
