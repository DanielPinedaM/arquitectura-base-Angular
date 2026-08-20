import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

/**
 * Directive para aplicar estilos tipo Shadcn a un elemento <tfoot>
 * dentro de un contexto HlmTableDirective.
 */
@Directive({
	selector: 'tfoot[hlmTFoot],tfoot[hlmTableFooter]',
	host: { 'data-slot': 'table-footer' },
})
export class HlmTFootDirective {
	constructor() {
		classes(() => 'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0');
	}
}
