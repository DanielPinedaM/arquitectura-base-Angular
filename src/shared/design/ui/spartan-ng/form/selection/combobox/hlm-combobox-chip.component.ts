import { HlmComboboxChipRemoveDirective } from '@/shared/design/ui/spartan-ng/form/selection/combobox/hlm-combobox-chip-remove.directive';
import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BrnComboboxChip } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/hlm-helper';

@Component({
	selector: 'hlm-combobox-chip',
	imports: [HlmComboboxChipRemoveDirective],
	hostDirectives: [{ directive: BrnComboboxChip, inputs: ['value'] }],
	host: { 'data-slot': 'combobox-chip' },
	template: `
		<ng-content />

		@if (showRemove()) {
			<button hlmComboboxChipRemove>
				<span class="material-symbols-outlined">close</span>
			</button>
		}
	`,
})
export class HlmComboboxChipComponent {
	public readonly showRemove = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	constructor() {
		classes(
			() =>
				'bg-muted text-foreground flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap has-data-[slot=combobox-chip-remove]:pe-0 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
		);
	}
}
