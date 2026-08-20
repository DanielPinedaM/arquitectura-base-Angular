import { Directive } from '@angular/core';
import { BrnDrawerDescription } from '@spartan-ng/brain/drawer';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmDrawerDescription]',
	hostDirectives: [BrnDrawerDescription],
	host: { 'data-slot': 'drawer-description' },
})
export class HlmDrawerDescriptionDirective {
	constructor() {
		classes(() => 'text-muted-foreground text-sm');
	}
}
