import { Directive } from '@angular/core';
import { BrnDrawerTitle } from '@spartan-ng/brain/drawer';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmDrawerTitle]',
	hostDirectives: [BrnDrawerTitle],
	host: { 'data-slot': 'drawer-title' },
})
export class HlmDrawerTitleDirective {
	constructor() {
		classes(() => 'text-foreground text-base font-medium');
	}
}
