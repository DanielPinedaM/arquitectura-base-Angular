import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmDropdownMenuSeparator],hlm-dropdown-menu-separator',
	host: { 'data-slot': 'dropdown-menu-separator' },
})
export class HlmDropdownMenuSeparatorDirective {
	constructor() {
		classes(() => 'bg-border -mx-1 my-1 h-px block');
	}
}
