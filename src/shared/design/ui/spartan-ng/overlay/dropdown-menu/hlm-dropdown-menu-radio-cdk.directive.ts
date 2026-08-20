import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem, CdkMenuItemRadio, CdkMenuItemSelectable } from '@angular/cdk/menu';
import { Directive, booleanAttribute, input } from '@angular/core';

/** @internal. Usar HlmDropdownMenuRadioDirective en su lugar. */
@Directive({
	selector: '[hlmDropdownMenuRadioCdk]',
	providers: [
		{ provide: CdkMenuItemRadio, useExisting: HlmDropdownMenuRadioCdkDirective },
		{ provide: CdkMenuItemSelectable, useExisting: HlmDropdownMenuRadioCdkDirective },
		{ provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
	],
})
export class HlmDropdownMenuRadioCdkDirective extends CdkMenuItemRadio {
	public readonly keepOpen = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	public override trigger(options?: { keepOpen: boolean }) {
		super.trigger({ ...options, keepOpen: this.keepOpen() });
	}
}
