import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem, CdkMenuItemCheckbox, CdkMenuItemSelectable } from '@angular/cdk/menu';
import { Directive, booleanAttribute, input } from '@angular/core';

/** @internal. Usar HlmDropdownMenuCheckboxDirective en su lugar. */
@Directive({
	selector: '[hlmDropdownMenuCheckboxCdk]',
	providers: [
		{ provide: CdkMenuItemCheckbox, useExisting: HlmDropdownMenuCheckboxCdkDirective },
		{ provide: CdkMenuItemSelectable, useExisting: HlmDropdownMenuCheckboxCdkDirective },
		{ provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
	],
})
export class HlmDropdownMenuCheckboxCdkDirective extends CdkMenuItemCheckbox {
	public readonly keepOpen = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	public override trigger(options?: { keepOpen: boolean }) {
		super.trigger({ ...options, keepOpen: this.keepOpen() });
	}
}
