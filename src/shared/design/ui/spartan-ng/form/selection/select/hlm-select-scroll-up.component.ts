import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnSelectScrollUp } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/hlm-helper';

@Component({
	selector: 'hlm-select-scroll-up',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnSelectScrollUp],
	template: `
		<span class="material-symbols-outlined">keyboard_arrow_up</span>
	`,
})
export class HlmSelectScrollUpComponent {
	constructor() {
		classes(() => 'bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_.material-symbols-outlined:not([class*=\'text-\'])]:text-[length:--spacing(4)] sticky top-0 w-full data-hidden:hidden');
	}
}
