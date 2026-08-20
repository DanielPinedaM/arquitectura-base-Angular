import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmDrawerFooter],hlm-drawer-footer',
	host: { 'data-slot': 'drawer-footer' },
})
export class HlmDrawerFooterDirective {
	constructor() {
		classes(() => 'gap-2 p-4 mt-auto flex flex-col');
	}
}
