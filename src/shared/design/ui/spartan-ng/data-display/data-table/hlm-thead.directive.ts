import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

/**
 * Directive para aplicar estilos tipo Shadcn a un elemento <thead>
 * dentro de un contexto HlmTableDirective.
 */
@Directive({
	selector: 'thead[hlmTHead],thead[hlmTableHeader]',
	host: { 'data-slot': 'table-header' },
})
export class HlmTHeadDirective {
	constructor() {
		classes(() => '[&_tr]:border-b');
	}
}
