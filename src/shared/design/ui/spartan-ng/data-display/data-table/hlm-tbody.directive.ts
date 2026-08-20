import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

/**
 * Directive para aplicar estilos tipo Shadcn a un elemento <tbody>
 * dentro de un contexto HlmTableDirective.
 */
@Directive({
	selector: 'tbody[hlmTBody],tbody[hlmTableBody]',
	host: { 'data-slot': 'table-body' },
})
export class HlmTBodyDirective {
	constructor() {
		classes(() => '[&_tr:last-child]:border-0');
	}
}
