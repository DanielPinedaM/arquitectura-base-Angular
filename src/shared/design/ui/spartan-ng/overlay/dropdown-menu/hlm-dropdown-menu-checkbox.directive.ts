import { type BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, inject, input } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';
import { HlmDropdownMenuCheckboxCdkDirective } from '@/shared/design/ui/spartan-ng/overlay/dropdown-menu/hlm-dropdown-menu-checkbox-cdk.directive';
import { HlmDropdownMenuFocusOnHoverDirective } from '@/shared/design/ui/spartan-ng/overlay/dropdown-menu/hlm-dropdown-menu-focus-on-hover.directive';

@Directive({
	selector: '[hlmDropdownMenuCheckbox],[hlmDropdownMenuCheckboxItem]',
	hostDirectives: [
		{
			directive: HlmDropdownMenuCheckboxCdkDirective,
			inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked', 'keepOpen'],
			outputs: ['cdkMenuItemTriggered: triggered'],
		},
		HlmDropdownMenuFocusOnHoverDirective,
	],
	host: {
		'data-slot': 'dropdown-menu-checkbox-item',
		'[attr.data-disabled]': '_cdkMenuItem.disabled ? "" : null',
		'[attr.data-checked]': '_cdkMenuItem.checked ? "" : null',
		'[attr.data-inset]': 'inset() ? "" : null',
	},
})
export class HlmDropdownMenuCheckboxDirective {
	protected readonly _cdkMenuItem = inject(HlmDropdownMenuCheckboxCdkDirective);

	public readonly inset = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	constructor() {
		classes(
			() =>
				'hover:bg-accent focus:bg-accent hover:text-accent-foreground focus:text-accent-foreground hover:**:text-accent-foreground focus:**:text-accent-foreground gap-1.5 rounded-md py-1 ps-1.5 pe-8 text-sm data-inset:ps-7 [&_.material-symbols-outlined:not([class*=\'text-\'])]:text-[length:--spacing(4)] group/dropdown-menu-checkbox relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_.material-symbols-outlined]:pointer-events-none [&_.material-symbols-outlined]:shrink-0',
		);
	}
}
