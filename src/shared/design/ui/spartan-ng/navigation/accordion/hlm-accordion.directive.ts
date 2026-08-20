import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'orientation'] }],
	host: {
		'data-slot': 'accordion',
	},
})
export class HlmAccordionDirective {
	constructor() {
		classes(() => 'flex w-full flex-col');
	}
}
