import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

/**
 * Directive para aplicar estilos tipo Shadcn a un elemento <table>.
 */
@Directive({
	selector: 'table[hlmTable]',
	host: { 'data-slot': 'table' },
})
export class HlmTableDirective {
	constructor() {
		classes(() => 'w-full caption-bottom text-sm');
	}
}
