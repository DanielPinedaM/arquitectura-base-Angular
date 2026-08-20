import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmDialogHeader],hlm-dialog-header',
	host: { 'data-slot': 'dialog-header' },
})
export class HlmDialogHeaderDirective {
	constructor() {
		classes(() => 'gap-2 flex flex-col');
	}
}
