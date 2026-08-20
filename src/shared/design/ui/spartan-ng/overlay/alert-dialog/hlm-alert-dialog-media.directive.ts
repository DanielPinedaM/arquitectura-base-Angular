import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmAlertDialogMedia],hlm-alert-dialog-media',
	host: { 'data-slot': 'alert-dialog-media' },
})
export class HlmAlertDialogMediaDirective {
	constructor() {
		classes(() => 'bg-muted mb-2 inline-flex size-10 items-center justify-center rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[ng-icon:not([class*=\'text-\'])]:text-[length:--spacing(6)]');
	}
}
