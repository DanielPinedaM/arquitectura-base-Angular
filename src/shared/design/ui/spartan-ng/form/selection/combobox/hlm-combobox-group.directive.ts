import { Directive } from '@angular/core';
import { BrnComboboxGroup } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmComboboxGroup]',
	hostDirectives: [BrnComboboxGroup],
	host: { 'data-slot': 'combobox-group' },
})
export class HlmComboboxGroupDirective {
	constructor() {
		classes(() => 'data-hidden:hidden');
	}
}
