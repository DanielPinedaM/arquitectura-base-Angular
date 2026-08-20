import { Directive } from '@angular/core';
import { BrnSelectSeparator } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmSelectSeparator],hlm-select-separator',
	hostDirectives: [{ directive: BrnSelectSeparator, inputs: ['orientation'] }],
	host: { 'data-slot': 'select-separator' },
})
export class HlmSelectSeparatorDirective {
	constructor() {
		classes(() => 'bg-border -mx-1 my-1 h-px pointer-events-none');
	}
}
