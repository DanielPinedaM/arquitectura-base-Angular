import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmPopoverTitle]',
	host: { 'data-slot': 'popover-title' },
})
export class HlmPopoverTitleDirective {
	constructor() {
		classes(() => 'font-medium');
	}
}
