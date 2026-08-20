import { Directive, input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/button';

@Directive({
	selector: 'button[hlmAlertDialogAction]',
	hostDirectives: [{ directive: HlmButtonDirective, inputs: ['variant', 'size'] }],
	host: { 'data-slot': 'alert-dialog-action', '[type]': 'type()' },
})
export class HlmAlertDialogActionDirective {
	public readonly type = input<'button' | 'submit' | 'reset'>('button');
}
