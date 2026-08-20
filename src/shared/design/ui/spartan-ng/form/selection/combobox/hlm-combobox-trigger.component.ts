import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnComboboxAnchor, BrnComboboxPopoverTrigger, BrnComboboxTrigger } from '@spartan-ng/brain/combobox';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { ButtonVariants, HlmButtonDirective } from '@spartan-ng/button';
import { hlm } from '@spartan-ng/hlm-helper';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-combobox-trigger',
	imports: [
		HlmButtonDirective,
		BrnComboboxAnchor,
		BrnComboboxTrigger,
		BrnComboboxPopoverTrigger,
		BrnFieldControlDescribedBy,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button
			brnComboboxTrigger
			brnComboboxAnchor
			brnComboboxPopoverTrigger
			brnFieldControlDescribedBy
			hlmBtn
			data-slot="combobox-trigger"
			[id]="buttonId()"
			[class]="_computedClass()"
			[variant]="variant()"
			[forceInvalid]="forceInvalid()"
		>
			<ng-content />
			<span class="material-symbols-outlined text-muted-foreground text-[length:--spacing(4)]">keyboard_arrow_down</span>
		</button>
	`,
})
export class HlmComboboxTriggerComponent {
	private static _id = 0;

	public readonly userClass = input<ClassValue>('', {
		alias: 'class',
	});
	protected readonly _computedClass = computed(() => hlm('data-placeholder:text-muted-foreground', this.userClass()));

	public readonly buttonId = input<string>(`hlm-combobox-trigger-${HlmComboboxTriggerComponent._id++}`);

	public readonly variant = input<ButtonVariants['variant']>('outline');

	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}
