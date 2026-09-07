import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BrnComboboxItem } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/hlm-helper';

@Component({
	selector: 'hlm-combobox-item',
	hostDirectives: [{ directive: BrnComboboxItem, inputs: ['id', 'disabled', 'value'] }],
	host: { 'data-slot': 'combobox-item' },
	template: `
		<ng-content />
		@if (_active()) {
			<span class="material-symbols-outlined pointer-events-none absolute end-2 flex items-center justify-center text-[length:--spacing(4)]" aria-hidden="true">check</span>
		}
	`,
})
export class HlmComboboxItemComponent {
	private readonly _brnComboboxItem = inject(BrnComboboxItem);

	protected readonly _active = this._brnComboboxItem.active;

	constructor() {
		classes(
			() =>
				'data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground gap-2 rounded-md py-1 ps-1.5 pe-8 text-sm relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-hidden:hidden [&_.material-symbols-outlined]:pointer-events-none [&_.material-symbols-outlined]:shrink-0',
		);
	}
}
