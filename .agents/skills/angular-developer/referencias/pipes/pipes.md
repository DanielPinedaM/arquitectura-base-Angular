# Pipes

Los pipes transforman datos de forma declarativa dentro de los templates de Angular usando el operador `|`.

## Uso de pipes en templates

Importa la clase del pipe y agrégala al array `imports` del componente.

```ts
import {Component} from '@angular/core';
import {DatePipe, CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-invoice',
  imports: [DatePipe, CurrencyPipe],
  template: `
    <p>Date: {{ issuedOn | date: 'mediumDate' }}</p>
    <p>Total: {{ amount | currency }}</p>
  `,
})
export class Invoice {
  issuedOn = new Date();
  amount = 49.99;
}
```

## Uso de la lógica de un pipe fuera de los templates

**NO inyectes clases de pipes en servicios u otras clases.** Los pipes son operadores de template, no servicios inyectables. Inyectarlos provoca errores de DI en contextos standalone y crea un acoplamiento innecesario.

### Pipes personalizados — extrae la función de transformación

Extrae la lógica a una función simple. El pipe delega en ella; los servicios importan la función directamente.

```ts
// kebab-case.ts
export function toKebabCase(value: string): string {
  return value.toLowerCase().replace(/ /g, '-');
}
```

```ts
// kebab-case.pipe.ts
import {Pipe, PipeTransform} from '@angular/core';
import {toKebabCase} from './kebab-case';

@Pipe({name: 'kebabCase'})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return toKebabCase(value);
  }
}
```

```ts
// formatter.service.ts — importa la función, NO el pipe
import {Service} from '@angular/core';
import {toKebabCase} from './kebab-case';

@Service()
export class FormatterService {
  toSlug(title: string): string {
    return toKebabCase(title);
  }
}
```

### Pipes integrados sensibles al locale — usa funciones de formato standalone

`@angular/common` exporta una función standalone por cada pipe integrado sensible al locale:

| Pipe           | Función standalone |
| -------------- | ------------------ |
| `DatePipe`     | `formatDate`       |
| `CurrencyPipe` | `formatCurrency`   |
| `DecimalPipe`  | `formatNumber`     |
| `PercentPipe`  | `formatPercent`    |

Inyecta `LOCALE_ID` para obtener el locale actual y pásalo a la función.

```ts
// CORRECTO — usa formatNumber en lugar de inyectar DecimalPipe
import {Service, LOCALE_ID, inject} from '@angular/core';
import {formatNumber} from '@angular/common';

@Service()
export class PriceService {
  private locale = inject(LOCALE_ID);

  formatQuantity(value: number): string {
    return formatNumber(value, this.locale, '1.0-0');
  }
}
```

```ts
// INCORRECTO — no inyectes clases de pipes
import {Service, inject} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Service()
export class PriceService {
  // ❌ DecimalPipe no está diseñado para ser inyectado
  private pipe = inject(DecimalPipe);
}
```

## Crear pipes personalizados

Usa Angular CLI para generar un pipe:

```bash
ng generate pipe path/to/my-pipe
```

Un pipe necesita un decorador `@Pipe` con un `name` y un método `transform` que implemente `PipeTransform`.

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'truncate'})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}
```

- **`name`**: camelCase. No uses guiones.
- **Nombre de la clase**: Versión en PascalCase de `name` con `Pipe` agregado al final (p. ej., `TruncatePipe`).

## Pipes impuros

Marca un pipe con `pure: false` solo cuando necesites detectar mutaciones dentro de arrays u objetos. Los pipes impuros se ejecutan en cada ciclo de change detection y pueden afectar el rendimiento.

```ts
@Pipe({name: 'filterItems', pure: false})
export class FilterItemsPipe implements PipeTransform {
  transform(items: string[], query: string): string[] {
    return items.filter((i) => i.includes(query));
  }
}
```

IMPORTANTE: Evita los pipes impuros a menos que sean absolutamente necesarios.
