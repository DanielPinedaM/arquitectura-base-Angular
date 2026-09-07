import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BrnSelectItem } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/hlm-helper';

@Component({
	selector: 'hlm-select-item',
	hostDirectives: [{ directive: BrnSelectItem, inputs: ['id', 'disabled', 'value'] }],
	host: { 'data-slot': 'select-item' },
	template: `
		<ng-content />
		@if (_active()) {
			<span class="material-symbols-outlined absolute end-2 flex items-center justify-center text-[length:--spacing(4)]" aria-hidden="true">check</span>
		}
	`,
})
export class HlmSelectItemComponent {
	private readonly _brnSelectItem = inject(BrnSelectItem);

	protected readonly _active = this._brnSelectItem.active;

	constructor() {
		classes(
			() =>
				'data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground gap-1.5 rounded-md py-1 ps-1.5 pe-8 text-sm *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_.material-symbols-outlined]:pointer-events-none [&_.material-symbols-outlined]:shrink-0',
		);
	}
}
