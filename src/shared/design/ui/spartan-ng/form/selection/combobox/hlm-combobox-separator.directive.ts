import { Directive } from '@angular/core';
import { BrnComboboxSeparator } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmComboboxSeparator]',
	hostDirectives: [{ directive: BrnComboboxSeparator, inputs: ['orientation'] }],
	host: { 'data-slot': 'combobox-separator' },
})
export class HlmComboboxSeparatorDirective {
	constructor() {
		classes(() => 'bg-border -mx-1 my-1 h-px');
	}
}
