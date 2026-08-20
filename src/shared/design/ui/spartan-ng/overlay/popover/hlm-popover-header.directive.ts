import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmPopoverHeader],hlm-popover-header',
	host: { 'data-slot': 'popover-header' },
})
export class HlmPopoverHeaderDirective {
	constructor() {
		classes(() => 'flex flex-col gap-0.5 text-sm');
	}
}
