import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

/**
 * Directive para aplicar estilos tipo Shadcn a un elemento <tr>
 * dentro de un contexto HlmTableDirective.
 */
@Directive({
	selector: 'tr[hlmTr],tr[hlmTableRow]',
	host: { 'data-slot': 'table-row' },
})
export class HlmTrDirective {
	constructor() {
		classes(() => 'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors has-aria-expanded:bg-muted/50');
	}
}
