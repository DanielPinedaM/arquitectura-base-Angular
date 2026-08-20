import { Directive } from '@angular/core';
import { BrnSheetTitle } from '@spartan-ng/brain/sheet';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmSheetTitle]',
	hostDirectives: [BrnSheetTitle],
	host: { 'data-slot': 'sheet-title' },
})
export class HlmSheetTitleDirective {
	constructor() {
		classes(() => 'text-foreground text-base font-medium');
	}
}
