import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

/**
 * Directive para aplicar estilos tipo Shadcn a un elemento <td>
 * dentro de un contexto HlmTableDirective.
 */
@Directive({
	selector: 'td[hlmTd],td[hlmTableCell]',
	host: { 'data-slot': 'table-cell' },
})
export class HlmTdDirective {
	constructor() {
		classes(() => 'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0');
	}
}
