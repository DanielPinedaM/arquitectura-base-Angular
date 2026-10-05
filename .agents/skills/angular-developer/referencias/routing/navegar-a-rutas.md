# Navegar a rutas

Angular proporciona formas tanto declarativas como programáticas de navegar entre rutas.

## Navegación declarativa (`RouterLink`)

Usa la directiva `RouterLink` en los elementos anchor.

```ts
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
      <a [routerLink]="['/user', userId]">Profile</a>
    </nav>
  `,
})
export class Nav {
  userId = '123';
}
```

- **Paths absolutos**: Empiezan con `/` (p. ej., `/settings`).
- **Paths relativos**: Sin `/` al inicio. Usa `../` para subir un nivel.

## Navegación programática (`Router`)

Inyecta el servicio `Router` para navegar mediante código TypeScript.

### `router.navigate()`

Usa un array de comandos.

```ts
private router = inject(Router);
private route = inject(ActivatedRoute);

// Navegación estándar
this.router.navigate(['/profile']);

// Con parámetros
this.router.navigate(['/search'], {
  queryParams: { q: 'angular' },
  fragment: 'results'
});

// Navegación relativa
this.router.navigate(['edit'], { relativeTo: this.route });
```

### `router.navigateByUrl()`

Usa un path de tipo string. Ideal para la navegación absoluta o URLs completas.

```ts
this.router.navigateByUrl('/products/123?view=details');

// Reemplaza la entrada actual en el historial
this.router.navigateByUrl('/login', {replaceUrl: true});
```

## Parámetros de URL

- **Route Params**: Parte del path (p. ej., `/user/123`).
- **Query Params**: Después del `?` (p. ej., `/search?q=query`).
- **Matrix Params**: Limitados a un segmento (p. ej., `/products;category=books`).
