import { Directive } from '@angular/core';
import { BrnComboboxPlaceholder } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmComboboxPlaceholder],hlm-combobox-placeholder',
	hostDirectives: [BrnComboboxPlaceholder],
	host: { 'data-slot': 'combobox-placeholder' },
})
export class HlmComboboxPlaceholderDirective {
	constructor() {
		classes(
			() =>
				'gap-2 [&_ng-icon:not([class*=\'text-\'])]:text-[length:--spacing(4)] flex items-center data-hidden:hidden [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
		);
	}
}
