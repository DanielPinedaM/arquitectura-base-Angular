import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: 'ul[hlmPaginationContent]',
	host: { 'data-slot': 'pagination-content' },
})
export class HlmPaginationContentDirective {
	constructor() {
		classes(() => 'gap-0.5 flex items-center');
	}
}
