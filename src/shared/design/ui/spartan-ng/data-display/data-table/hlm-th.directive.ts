import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

/**
 * Directive para aplicar estilos tipo Shadcn a un elemento <th>
 * dentro de un contexto HlmTableDirective.
 */
@Directive({
	selector: 'th[hlmTh],th[hlmTableHead]',
	host: { 'data-slot': 'table-head' },
})
export class HlmThDirective {
	constructor() {
		classes(() => 'text-foreground h-10 px-2 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0');
	}
}
