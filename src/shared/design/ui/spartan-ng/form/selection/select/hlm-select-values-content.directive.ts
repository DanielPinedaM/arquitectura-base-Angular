import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({ selector: '[hlmSelectValuesContent],hlm-select-values-content' })
export class HlmSelectValuesContentDirective {
	constructor() {
		classes(() => 'gap-2 flex');
	}
}
