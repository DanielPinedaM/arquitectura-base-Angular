import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmPopoverDescription]',
	host: { 'data-slot': 'popover-description' },
})
export class HlmPopoverDescriptionDirective {
	constructor() {
		classes(() => 'text-muted-foreground');
	}
}
