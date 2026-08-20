import { CdkMenuGroup } from '@angular/cdk/menu';
import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmDropdownMenuGroup],hlm-dropdown-menu-group',
	hostDirectives: [CdkMenuGroup],
	host: { 'data-slot': 'dropdown-menu-group' },
})
export class HlmDropdownMenuGroupDirective {
	constructor() {
		classes(() => 'block');
	}
}
