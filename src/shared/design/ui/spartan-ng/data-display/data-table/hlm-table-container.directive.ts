import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: 'div[hlmTableContainer]',
	host: { 'data-slot': 'table-container' },
})
export class HlmTableContainerDirective {
	constructor() {
		classes(() => 'relative w-full overflow-x-auto');
	}
}
