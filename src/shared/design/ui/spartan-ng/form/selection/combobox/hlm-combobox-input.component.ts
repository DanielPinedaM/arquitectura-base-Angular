import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BrnComboboxAnchor, BrnComboboxImports, BrnComboboxPopoverTrigger } from '@spartan-ng/brain/combobox';
import { HlmInputGroupDirective, HlmInputGroupImports } from '@spartan-ng/input-group';
import { classes } from '@spartan-ng/hlm-helper';

@Component({
	selector: 'hlm-combobox-input',
	imports: [HlmInputGroupImports, BrnComboboxImports, BrnComboboxPopoverTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnComboboxAnchor, HlmInputGroupDirective],
	template: `
		<input
			brnComboboxInput
			#comboboxInput="brnComboboxInput"
			brnComboboxPopoverTrigger
			[closeOnTriggerClick]="false"
			hlmInputGroupInput
			[id]="inputId()"
			[placeholder]="placeholder()"
			[forceInvalid]="forceInvalid()"
			[aria-invalid]="ariaInvalidOverride()"
		/>

		<hlm-input-group-addon align="inline-end">
			@if (showTrigger()) {
				<button
					brnComboboxPopoverTrigger
					hlmInputGroupButton
					data-slot="input-group-button"
					[disabled]="comboboxInput.disabled()"
					size="icon-xs"
					variant="ghost"
					class="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
				>
					<span class="material-symbols-outlined">keyboard_arrow_down</span>
				</button>
			}

			@if (showClear()) {
				<button
					*brnComboboxClear
					hlmInputGroupButton
					data-slot="combobox-clear"
					[disabled]="comboboxInput.disabled()"
					size="icon-xs"
					variant="ghost"
				>
					<span class="material-symbols-outlined">close</span>
				</button>
			}
		</hlm-input-group-addon>

		<ng-content />
	`,
})
export class HlmComboboxInputComponent {
	private static _id = 0;

	public readonly inputId = input<string>(`hlm-combobox-input-${HlmComboboxInputComponent._id++}`);
	public readonly placeholder = input<string>('');

	public readonly showTrigger = input<boolean, BooleanInput>(true, { transform: booleanAttribute });
	public readonly showClear = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Override manual para aria-invalid. Cuando no se establece, se autodetecta desde el estado de error del combobox padre. */
	public readonly ariaInvalidOverride = input<boolean | undefined, BooleanInput>(undefined, {
		transform: (v: BooleanInput) => (v === '' || v === undefined ? undefined : booleanAttribute(v)),
		alias: 'aria-invalid',
	});

	constructor() {
		classes(() => 'w-auto');
	}
}
