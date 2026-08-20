import { ChangeDetectionStrategy, Component } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Component({
	selector: 'hlm-dropdown-menu-radio-indicator',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { 'data-slot': 'dropdown-menu-radio-item-indicator' },
	template: `
		<span class="material-symbols-outlined">check</span>
	`,
})
export class HlmDropdownMenuRadioIndicatorComponent {
	constructor() {
		classes(
			() =>
				'absolute end-2 flex items-center justify-center [&_.material-symbols-outlined]:text-[length:--spacing(4)] pointer-events-none opacity-0 group-data-checked/dropdown-menu-radio:opacity-100',
		);
	}
}
