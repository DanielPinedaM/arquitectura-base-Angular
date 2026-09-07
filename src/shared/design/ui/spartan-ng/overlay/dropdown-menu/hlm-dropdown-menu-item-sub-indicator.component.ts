import { ChangeDetectionStrategy, Component } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Component({
	selector: 'hlm-dropdown-menu-item-sub-indicator',
	template: `
		<span class="material-symbols-outlined text-[length:--spacing(4)] rtl:rotate-180">chevron_right</span>
	`,
})
export class HlmDropdownMenuItemSubIndicatorComponent {
	constructor() {
		classes(() => 'ms-auto flex items-center justify-center');
	}
}
